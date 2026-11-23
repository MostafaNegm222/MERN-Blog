import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.js";

process.env.JWT_SECRET = "test-secret";

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const header = (value) => (name) => (name === "Authorization" ? value : undefined);

describe("verifyToken", () => {
  test("403 when there is no Authorization header", async () => {
    const res = makeRes();
    const next = jest.fn();
    await verifyToken({ header: header(undefined) }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("accepts a Bearer token and stores the payload on req.user", async () => {
    const token = jwt.sign({ id: "u1" }, "test-secret");
    const req = { header: header(`Bearer ${token}`) };
    const next = jest.fn();
    await verifyToken(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe("u1");
  });

  test("rejects a token signed with a different secret", async () => {
    const token = jwt.sign({ id: "u1" }, "other-secret");
    const res = makeRes();
    const next = jest.fn();
    await verifyToken({ header: header(`Bearer ${token}`) }, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });
});
