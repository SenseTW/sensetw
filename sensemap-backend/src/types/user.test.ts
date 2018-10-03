import * as U from "./user";
import { context } from "../context";
import { users } from "../../seeds/dev";

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

const nonExistentID = "0be4e68e-c0f8-41a3-bffd-f3d430cd9822";

test("createUser", async () => {
  const { db } = context({ req: null });
  const u0 = await U.createUser(
    db,
    { username: "foo", email: "foo@example.com" },
    "mysecret"
  );

  expect(u0.id).toBeTruthy();
  expect(u0.username).toBe("foo");
  expect(u0.email).toBe("foo@example.com");

  const u1 = await U.getUser(db, u0.id);
  expect(u1.id).toBe(u0.id);
});

test("getUser not found", async () => {
  const { db } = context({ req: null });
  const u0 = await U.getUser(db, nonExistentID);
  expect(u0).toBeNull();
});

test("updateUserPassword", async () => {
  const { db } = context({ req: null });
  const u0 = await U.createUser(
    db,
    { username: "foo", email: "foo@example.com" },
    "mysecret"
  );

  const s0 = await db
    .select("salthash")
    .from("user")
    .where("id", u0.id)
    .first();
  expect(s0.salthash).toMatch(/^\$2a\$08\$/);

  await U.updateUserPassword(db, u0.id, "myothersecret");
  const s1 = await db
    .select("salthash")
    .from("user")
    .where("id", u0.id)
    .first();
  expect(s1.salthash).toMatch(/^\$2a\$08\$/);
  expect(s1.salthash).not.toBe(s0.salthash);
});

test("authenticate", async () => {
  const { db } = context({ req: null });
  const u0 = await U.createUser(
    db,
    { username: "foo", email: "foo@example.com" },
    "mysecret"
  );

  const u1 = await U.authenticate(db, {
    type: "username",
    username: u0.username,
    password: "mysecret"
  });
  expect(u1.id).toBe(u0.id);

  const u2 = await U.authenticate(db, {
    type: "username",
    username: u0.username,
    password: "wrongsecret"
  });
  expect(u2).toBeNull();

  const u3 = await U.authenticate(db, {
    type: "email",
    email: "foo@example.com",
    password: "mysecret"
  });
  expect(u3.id).toBe(u0.id);
});

test("checkUsername", () => {
  expect(U.checkUsername("ab")).toBe(
    "Username must be between 3 and 30 characters."
  );
  expect(U.checkUsername("32aaaaaaaaaaaaaabbbbbbbbbbbbbbbb")).toBe(
    "Username must be between 3 and 30 characters."
  );
  expect(U.checkUsername("foo-bar")).toBe(
    "Username must contain only letters, numbers, periods, and underscores."
  );
  expect(U.checkUsername("the_42_awesome.monkeys")).toBe("");
});

describe("GraphQL", () => {
  test("User fields", async () => {
    const u = await U.resolvers.Query.User(null, { id: users[0].id }, { db });
    expect(u.id).toBe(users[0].id);
    expect(u.email).toBe("hello@somewhere");
    expect(u.maps).toBeTruthy();
  });
});

describe("Reset password token", () => {
  test("createResetPasswordToken", async () => {
    const u0 = await U.createUser(
      db,
      { username: "foo", email: "foo@example.com" },
      "mysecret"
    );
    const t0 = await U.createResetPasswordToken(db, u0.id);
    expect(t0.userId).toBe(u0.id);
    expect(t0.token).toBeTruthy();
    expect(t0.token.length).toBeGreaterThan(63);
  });

  test("findUserByResetPasswordToken", async () => {
    const u0 = await U.createUser(
      db,
      { username: "foo", email: "foo@example.com" },
      "mysecret"
    );
    const t0 = await U.createResetPasswordToken(db, u0.id);
    const u1 = await U.findUserByResetPasswordToken(db, t0.token);
    expect(u1.id).toBe(u0.id);
  });
});
