import reducer, { setMode, setLogin, setLogout, setFriends, setPosts, setPost } from "./index";

const initial = reducer(undefined, { type: "@@INIT" });

describe("auth slice", () => {
  test("starts light, logged out, with no posts", () => {
    expect(initial).toEqual({ mode: "light", user: null, token: null, posts: [] });
  });

  test("setMode toggles light and dark", () => {
    const dark = reducer(initial, setMode());
    expect(dark.mode).toBe("dark");
    expect(reducer(dark, setMode()).mode).toBe("light");
  });

  test("setLogin stores the user and token, setLogout clears them", () => {
    const user = { _id: "u1", firstName: "A", friends: [] };
    const loggedIn = reducer(initial, setLogin({ user, token: "t" }));
    expect(loggedIn.user).toEqual(user);
    expect(loggedIn.token).toBe("t");
    const out = reducer(loggedIn, setLogout());
    expect(out.user).toBeNull();
    expect(out.token).toBeNull();
  });

  test("setFriends updates the friends of the logged in user", () => {
    const loggedIn = reducer(initial, setLogin({ user: { _id: "u1", friends: [] }, token: "t" }));
    const next = reducer(loggedIn, setFriends({ friends: [{ _id: "f1" }] }));
    expect(next.user.friends).toEqual([{ _id: "f1" }]);
  });

  test("setFriends does nothing and logs an error when nobody is logged in", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const next = reducer(initial, setFriends({ friends: [{ _id: "f1" }] }));
    expect(next.user).toBeNull();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("setPosts replaces the list and setPost swaps a single post by id", () => {
    const withPosts = reducer(initial, setPosts({ posts: [{ _id: "1", likes: {} }, { _id: "2", likes: {} }] }));
    const updated = reducer(withPosts, setPost({ post: { _id: "2", likes: { u1: true } } }));
    expect(updated.posts[0]).toEqual({ _id: "1", likes: {} });
    expect(updated.posts[1].likes).toEqual({ u1: true });
  });
});
