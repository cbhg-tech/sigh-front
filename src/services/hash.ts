import * as crypto from "crypto";

export function hashService() {
  const generate = (password: string) =>
    crypto.createHash("sha256").update(password).digest("hex");

  const compare = (password: string, hash: string) =>
    crypto.createHash("sha256").update(password).digest("hex") === hash;

  return {
    generate,
    compare,
  };
}
