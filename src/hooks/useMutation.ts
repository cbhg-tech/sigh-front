import { useState } from "react";
import axios, { AxiosError, Method } from "axios";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface FetchResult<T> {
  status: FetchStatus;
  data: T | unknown;
  error: string | null;
  mutate: (body?: unknown) => Promise<void>;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const useMutation = <T>(url: string, method: Method): FetchResult<T> => {
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [data, setData] = useState<T | unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (body?: unknown) => {
    setStatus("loading");

    try {
      const response = await axios.request<T>({
        url: `${apiUrl}${url}`,
        method,
        data: body,
      });

      if (response.data) {
        setData(response.data);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");

      if (err instanceof AxiosError) {
        setError(err.response?.data.error);
        throw err;
      }

      setError("Houve um erro ao tentar se conectar ao servidor");
      throw err;
    }
  };

  return { status, data, error, mutate };
};
