import { NextRequest } from "next/server";

export async function getFormData<T extends Record<string, unknown>>(
  req: NextRequest
): Promise<T> {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  return data as T;
}
