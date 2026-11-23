import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";

// ES modules need unstable_mockModule, and the mocked modules must be imported afterwards.
const User = Object.assign(jest.fn(), { findOne: jest.fn(), findById: jest.fn() });
const Post = Object.assign(jest.fn(), { findById: jest.fn(), findByIdAndUpdate: jest.fn(), find: jest.fn() });
jest.unstable_mockModule("../models/User.js", () => ({ default: User }));
jest.unstable_mockModule("../models/Post.js", () => ({ default: Post }));

const { login, register } = await import("../controllers/auth.js");
const { addRemoveFriend, getUserFriends } = await import("../controllers/users.js");
const { likePost, getUserPosts } = await import("../controllers/posts.js");

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.resetAllMocks());

describe("login", () => {
  test("400 when the user does not exist", async () => {
    User.findOne.mockResolvedValue(null);
    const res = makeRes();
    await login({ body: { email: "a@b.com", password: "x" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("400 for a wrong password", async () => {
    User.findOne.mockResolvedValue({ _id: "u1", password: await bcrypt.hash("right", 4) });
    const res = makeRes();
    await login({ body: { email: "a@b.com", password: "wrong" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Invalid credentials. " });
  });

  test("returns a signed token for the right password", async () => {
    User.findOne.mockResolvedValue({ _id: "u1", password: await bcrypt.hash("right", 4) });
    const res = makeRes();
    await login({ body: { email: "a@b.com", password: "right" } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const { token } = res.json.mock.calls[0][0];
    expect(jwt.verify(token, "test-secret").id).toBe("u1");
  });
});

describe("register", () => {
  test("stores a bcrypt hash, never the plain password", async () => {
    let created;
    User.mockImplementation((data) => {
      created = data;
      return { ...data, save: jest.fn().mockResolvedValue(data) };
    });
    const res = makeRes();
    await register({ body: { firstName: "A", lastName: "B", email: "a@b.com", password: "plain-pw" } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(created.password).not.toBe("plain-pw");
    expect(await bcrypt.compare("plain-pw", created.password)).toBe(true);
  });
});

describe("friends", () => {
  const person = (id, friends = []) => ({ _id: id, firstName: id, lastName: "x", friends, save: jest.fn() });

  test("addRemoveFriend adds a friend on both sides when not yet friends", async () => {
    const me = person("me");
    const other = person("other");
    User.findById.mockImplementation(async (id) => ({ me, other }[id]));
    const res = makeRes();
    await addRemoveFriend({ params: { id: "me", friendId: "other" } }, res);
    expect(me.friends).toEqual(["other"]);
    expect(other.friends).toEqual(["me"]);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("addRemoveFriend removes the friend from the caller's list when already friends", async () => {
    const me = person("me", ["other"]);
    const other = person("other", ["me"]);
    User.findById.mockImplementation(async (id) => ({ me, other }[id]));
    await addRemoveFriend({ params: { id: "me", friendId: "other" } }, makeRes());
    expect(me.friends).toEqual([]);
  });

  test("getUserFriends returns only the public fields", async () => {
    const friend = { _id: "f1", firstName: "F", lastName: "L", occupation: "dev", location: "Cairo", picturePath: "p.jpg", password: "secret" };
    User.findById.mockImplementation(async (id) => (id === "me" ? { friends: ["f1"] } : friend));
    const res = makeRes();
    await getUserFriends({ params: { id: "me" } }, res);
    expect(res.json).toHaveBeenCalledWith([
      { _id: "f1", firstName: "F", lastName: "L", occupation: "dev", location: "Cairo", picturePath: "p.jpg" },
    ]);
  });
});

describe("posts", () => {
  test("likePost adds a like, then removes it", async () => {
    const likes = new Map();
    Post.findById.mockResolvedValue({ likes });
    Post.findByIdAndUpdate.mockImplementation(async (id, update) => ({ id, ...update }));

    await likePost({ params: { id: "p1" }, body: { userId: "u1" } }, makeRes());
    expect(likes.get("u1")).toBe(true);

    await likePost({ params: { id: "p1" }, body: { userId: "u1" } }, makeRes());
    expect(likes.has("u1")).toBe(false);
  });

  test("getUserPosts filters by userId", async () => {
    Post.find.mockResolvedValue([{ _id: "p1" }]);
    const res = makeRes();
    await getUserPosts({ params: { userId: "u1" } }, res);
    expect(Post.find).toHaveBeenCalledWith({ userId: "u1" });
    expect(res.json).toHaveBeenCalledWith([{ _id: "p1" }]);
  });
});
