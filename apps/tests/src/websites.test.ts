import { describe, it, expect } from "vitest";
import axios from "axios";
import { BASE_URL, createWebite, token } from "./utils"

describe("post request for adding a website", () => {
  it("this should succeeded", async () => {
    await expect(axios.post(`${BASE_URL}/website`, 
      {
        url: "https://hello.com",
      }, 
      {
        headers: {
          Authorization: token
        }
      }
    )).resolves.toHaveProperty("status", 201)
  });

  // added tests for adding bad websites too.
  it("this should succeeded", async () => {
    await expect(axios.post(`${BASE_URL}/website`, 
      {
        url: "https://naukriscore.com",
      }, 
      {
        headers: {
          Authorization: token
        }
      }
    )).resolves.toHaveProperty("status", 201)
  });

  it("this should fail as of no auth header", 
    async () => {
    await expect(axios.post(`${BASE_URL}/website`, {
      url: "https://hello.com",
    })).rejects.toMatchObject({
      response: {
        status: 401
      }
    })
  });

  it("this should fail as of invalid inputs", async () => {
    await expect(axios.post(`${BASE_URL}/website`, 
      {
        url: "hello",
      }, 
      {
        headers: {
          Authorization: token
        }
      }
    )).rejects.toMatchObject({
      response: {
        status: 411
      }
    })
  });

});

describe("get request for a website", () => {
  it("this should succeeded", async () => {
    const websiteId = await createWebite();
    await expect(axios.get(`${BASE_URL}/status/${websiteId}`, {
      headers: {
        Authorization: token
      }
    })).resolves.toHaveProperty("status", 200)

  });

  it("this should fail as of no auth header", async () => {
    await expect(axios.get(`${BASE_URL}/status/hello`, {
    })).rejects.toMatchObject({
      response: {
        status: 401
      }
    })
  });

  it("this should fail as of website not found", async () => {
    await expect(axios.get(`${BASE_URL}/status/f151774b-463c-4df6-95fb-b2eb11a00291`, {
      headers: {
        Authorization: token
      }
    })).rejects.toMatchObject({
      response: {
        status: 404
      }
    })
  });
});
