import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const fetcher = (url: string) =>
  axios.get(`${apiUrl}${url}`).then((res) => res.data);
