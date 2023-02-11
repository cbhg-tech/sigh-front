import { useState } from "react";

const useCookies = (key: string) => {
  const [cookie, setCookie] = useState(() => {
    const cookieValue = window.document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${key}=`));

    if (cookieValue) {
      return cookieValue.split("=")[1];
    }

    return "";
  });

  const setCookieValue = (value: string) => {
    window.document.cookie = `${key}=${value}`;
    setCookie(value);
  };

  return { cookie, setCookieValue };
};

export { useCookies };
