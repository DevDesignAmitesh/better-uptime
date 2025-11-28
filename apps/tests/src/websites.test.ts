import { describe, it, expect } from "vitest";
import axios from "axios";
import { BASE_URL } from "./utils"

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNCIsImlhdCI6MTc2NDIzMzU2NH0.3rKW07Gc-hEuBau2tPHymqRxZT1Q7fVJx1CP_HyRVzE";

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
    await expect(axios.get(`${BASE_URL}/status/1`, {
      headers: {
        Authorization: token
      }
    })).resolves.toHaveProperty("status", 200)

  });

  it("this should fail as of no auth header", async () => {
    await expect(axios.get(`${BASE_URL}/status/1`, {
    })).rejects.toMatchObject({
      response: {
        status: 401
      }
    })
  });

  it("this should fail as of website not found", async () => {
    await expect(axios.get(`${BASE_URL}/status/100000`, {
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
