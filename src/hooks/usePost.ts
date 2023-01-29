import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface FetchResult<T> {
  status: FetchStatus;
  data: T | unknown;
  error: string | null;
  mutate: (body: unknown) => Promise<void>;
}

export const usePost = <T>(url: string): FetchResult<T> => {
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [data, setData] = useState<T | unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (body: unknown) => {
    setStatus("loading");

    try {
      const response = await axios.post(url, body);

      setData(response.data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (err instanceof AxiosError) {
        return setError(err.response?.data.error);
      }
      setError("Houve um erro ao tentar se conectar ao servidor");
    }
  };

  return { status, data, error, mutate };
};
