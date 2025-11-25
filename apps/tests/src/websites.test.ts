import { describe, it, expect } from "vitest";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

describe("post request for adding a website", () => {
  it("this should succeeded", async () => {
    await expect(
      axios.post(`${BASE_URL}/website`, {
        url: "https://hello.com",
      })
    ).resolves.toHaveProperty("status", 201);
  });

  it("this should fail as of invalid inputs", async () => {
    await expect(
      axios.post(`${BASE_URL}/website`, {
        url: "hello",
      })
    ).rejects.toMatchObject({
      response: { status: 411 },
    });
  });
});

describe("get request for a website", () => {
  it("this should succeeded", async () => {
    await expect(axios.get(`${BASE_URL}/status/1`)).resolves.toHaveProperty(
      "status",
      200
    );
  });

  it("this should return not found", async () => {
    await expect(axios.get(`${BASE_URL}/status/1000`)).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it("this should fail as of invalid inputs", async () => {
    await expect(
      axios.get(`${BASE_URL}/status/hello`)
    ).rejects.toMatchObject({
      response: { status: 411 },
    });
  });
});
