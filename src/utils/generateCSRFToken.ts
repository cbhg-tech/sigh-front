export function generateCSRFToken() {
  const randomString = Math.random().toString(36).substring(2, 12);

  const timestamp = Date.now();
  const csrfToken = `${randomString}_${timestamp}`;

  const cookieOptions = {
    path: "/",
    secure: true,
    sameSite: "strict",
    // httpOnly: true,
  };

  const cookieOptionsString = Object.entries(cookieOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

  document.cookie = `csrf_token=${csrfToken}; ${cookieOptionsString}`;

  return csrfToken;
}
