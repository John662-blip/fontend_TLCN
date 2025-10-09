

// Xin access token mới bằng refresh token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const refreshExpiresAt = localStorage.getItem("refresh_expires_at");

  // Nếu refresh token hết hạn → logout
  if (!refreshToken || Date.now() >= parseInt(refreshExpiresAt)) {
    console.warn("Refresh token hết hạn, logout ngay!");
    logout();
    return null;
  }

  try {
    const response = await fetch("http://localhost:8080/refreshToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshToken }),
    });

    if (!response.ok) {
      console.error("Lỗi khi refresh token:", response.status);
      logout();
      return null;
    }

    const data = await response.json();

    // Lưu token mới
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("expires_at", Date.now() + data.expires_in * 1000);
    localStorage.setItem(
      "refresh_expires_at",
      Date.now() + data.refresh_expires_in * 1000
    );

    console.log("🔄 Access token mới:", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Lỗi khi gọi API refresh:", error);
    logout();
    return null;
  }
};

// Lấy access token hợp lệ
export const getValidAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  const expiresAt = localStorage.getItem("expires_at");

  if (!accessToken || !expiresAt) {
    return null;
  }

  // Nếu access token còn hạn → dùng luôn
  if (Date.now() < parseInt(expiresAt) - 30 * 1000) {
    return accessToken;
  }

  // Nếu access token hết hạn nhưng refresh token còn hạn → xin mới
  return await refreshAccessToken();
};

// Logout
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("refresh_expires_at");
};
