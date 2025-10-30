import Cookies from "js-cookie";

// 🔄 Xin access token mới bằng refresh token
export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get("refresh_token");

  // Nếu không có refresh token → logout
  if (!refreshToken) {
    console.warn("⚠️ Không tìm thấy refresh token, logout!");
    logout();
    return null;
  }

  try {
    const response = await fetch("http://localhost:8080/refreshToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.error("❌ Lỗi khi refresh token:", response.status);
      logout();
      return null;
    }

    const data = await response.json();

    // ✅ Lưu token mới vào cookie
    Cookies.set("access_token", data.access_token, {
      expires: (data.expires_in - 50) / 86400, // đổi giây → ngày
      path: "/",
      secure: true,
      sameSite: "Strict",
    });

    Cookies.set("refresh_token", data.refresh_token, {
      expires: (data.refresh_expires_in - 500) / 86400,
      path: "/",
      secure: true,
      sameSite: "Strict",
    });

    return data.access_token;
  } catch (error) {
    console.error("🔥 Lỗi khi gọi API refresh:", error);
    logout();
    return null;
  }
};

// ✅ Lấy access token hợp lệ
export const getValidAccessToken = async () => {
  const accessToken = Cookies.get("access_token");

  // Nếu không có access token → thử refresh
  if (!accessToken) {
    return await refreshAccessToken();
  }
  else{

   return accessToken;
  }
};

// 🚪 Logout
export const logout = () => {
  Cookies.remove("access_token", { path: "/" });
  Cookies.remove("refresh_token", { path: "/" });
};
