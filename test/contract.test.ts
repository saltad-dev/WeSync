import { getUser, setUpContract, save, setUp } from "../src/chain";
import { describe, expect, it } from "vitest";

describe("contract suite", () => {
  it("setup contract", async () => {
    try {
      const c = await setUpContract();
      expect(c).not.toBeNull();
    } catch (e) {
      console.log(e.message);
    }
  });

  it("get user", async () => {
    const user = getUser();
    expect(user.startsWith("0x")).toBe(true);
    expect(user.length).toBe(42);
  });

  it("general setup", async () => {
    // if already has primary character, return true
    // else, return false and create one
    const res = await setUp();
    expect(res).toBe(true);
  });

  it("save on chain", async () => {
    await save("xxx");
  });
});
