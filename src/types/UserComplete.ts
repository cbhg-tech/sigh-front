import { Admin, Athlete, User } from "@prisma/client";

export type UserComplete = Omit<User, "createdAt" | "updatedAt"> & {
  admin?: Omit<Admin, "createdAt" | "updatedAt"> | null;
  athlete?: Omit<Athlete, "createdAt" | "updatedAt"> | null;
};
