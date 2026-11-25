function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

async function verifyAdminUser(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return { ok: false, status: 401, message: "Thiếu token đăng nhập." };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { ok: false, status: 500, message: "Thiếu cấu hình Supabase trên server." };
  }

  // 1. Xác thực user từ Supabase Auth
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userRes.ok) {
    return { ok: false, status: 401, message: "Phiên đăng nhập không hợp lệ." };
  }
  const user = await userRes.json();

  // 2. Kiểm tra role trong bảng profiles
  const profileRes = await fetch(
    `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}&select=role`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!profileRes.ok) {
    return { ok: false, status: 403, message: "Không kiểm tra được quyền Admin." };
  }

  const profiles = await profileRes.json();
  if (profiles?.[0]?.role !== "admin") {
    return { ok: false, status: 403, message: "Chỉ Admin mới có quyền truy cập." };
  }

  return { ok: true, user };
}

export default async function handler(req, res) {
  try {
    const auth = await verifyAdminUser(req);
    if (!auth.ok) {
      return sendJson(res, auth.status, { error: auth.message });
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return sendJson(res, 500, {
        error: "Thiếu CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY hoặc CLOUDINARY_API_SECRET.",
      });
    }

    const basicAuth =
      "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const parsedUrl = new URL(req.url, "http://localhost");

    // GET: Lấy danh sách ảnh trong folder
    if (req.method === "GET") {
      const folder = parsedUrl.searchParams.get("folder") || "web_sekai/banner_images";
      const nextCursor = parsedUrl.searchParams.get("next_cursor") || "";

      if (!folder.startsWith("web_sekai/")) {
        return sendJson(res, 400, { error: "Thư mục không hợp lệ." });
      }

      // Dynamic Folder Mode (mặc định tài khoản mới)
      let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/by_asset_folder?asset_folder=${encodeURIComponent(
        folder
      )}&max_results=100`;
      if (nextCursor) {
        apiUrl += `&next_cursor=${encodeURIComponent(nextCursor)}`;
      }

      let cldRes = await fetch(apiUrl, {
        headers: { Authorization: basicAuth },
      });

      // Fallback nếu tài khoản dùng Fixed Folder Mode cũ
      if (cldRes.status === 404) {
        let fallbackUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${encodeURIComponent(
          folder + "/"
        )}&max_results=100`;
        if (nextCursor) {
          fallbackUrl += `&next_cursor=${encodeURIComponent(nextCursor)}`;
        }
        cldRes = await fetch(fallbackUrl, {
          headers: { Authorization: basicAuth },
        });
      }

      const data = await cldRes.json();
      if (!cldRes.ok) {
        return sendJson(res, cldRes.status, {
          error: data?.error?.message || "Không tải được danh sách ảnh từ Cloudinary.",
        });
      }

      const resources = (data.resources || [])
        .filter((item) => !item.resource_type || item.resource_type === "image")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((item) => ({
          asset_id: item.asset_id,
          public_id: item.public_id,
          display_name: item.display_name || item.public_id.split("/").pop(),
          format: item.format,
          width: item.width,
          height: item.height,
          bytes: item.bytes,
          secure_url: item.secure_url,
          created_at: item.created_at,
        }));

      return sendJson(res, 200, {
        resources,
        next_cursor: data.next_cursor || null,
      });
    }

    // DELETE: Xóa 1 ảnh theo public_id
    if (req.method === "DELETE") {
      const publicId = parsedUrl.searchParams.get("public_id");
      if (!publicId) {
        return sendJson(res, 400, { error: "Thiếu public_id cần xóa." });
      }

      const delUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?public_ids[]=${encodeURIComponent(
        publicId
      )}&invalidate=true`;

      const delRes = await fetch(delUrl, {
        method: "DELETE",
        headers: { Authorization: basicAuth },
      });

      const delData = await delRes.json();
      if (!delRes.ok) {
        return sendJson(res, delRes.status, {
          error: delData?.error?.message || "Không xóa được ảnh.",
        });
      }

      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (err) {
    return sendJson(res, 500, { error: err.message || "Lỗi server nội bộ." });
  }
}