import * as Knex from "knex";
import * as U from "./user";
import { User } from "./sql";

export async function getUser(
  db: Knex,
  accessToken: string
): Promise<User | null> {
  const rows = await db
    .select(["userId"])
    .from("oauth_token")
    .where("accessToken", accessToken);
  if (rows.length === 0) {
    return null;
  }
  return await U.getUser(db, rows[0].userId);
}

export async function getUserFromAuthorization(
  db: Knex,
  authorization: string | null
): Promise<User | null> {
  if (!authorization || authorization.substr(0, 7) !== "Bearer ") {
    return null;
  }
  const accessToken = authorization.substr(7);
  return getUser(db, accessToken);
}
