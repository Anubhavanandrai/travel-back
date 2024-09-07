import dotenv from "dotenv";

dotenv.config();

export const config = {
  secret_key: process.env.SECRET_KEY,
};
