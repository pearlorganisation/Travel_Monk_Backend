import dotenv from "dotenv";
dotenv.config();

export const DB_NAME = "Travel_Monk";
// export const DB_NAME = "Travel_Monk_DB_2";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
  secure: process.env.NODE_ENV !== "development",
};

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);
