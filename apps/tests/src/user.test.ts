import axios from "axios";
import { describe, it, expect } from "vitest";
import { BASE_URL, createUser } from "./utils"

const NEW_USER  = Math.random().toString();
const PASSWORD = "password";

console.log("NEW_USER", NEW_USER)

describe("testing api for /signup", () => {

  it("this should pass", async () => {
    await expect(axios.post(`${BASE_URL}/signup`, {
      email: NEW_USER,
      password: PASSWORD
    })).resolves.toHaveProperty("status", 201)
  })

  it("this should fail as of existing user", async () => {
    const res2 = await createUser()

    await expect(axios.post(`${BASE_URL}/signup`, {
      email: res2.username,
      password: res2.password
    })).rejects.toMatchObject({
      response: { status: 409 }
    })
  })

  it("this should fail as of invalid inputs", async () => {
    await expect (axios.post(`${BASE_URL}/signup`, {
      email: "he",
      password: PASSWORD
    })).rejects.toMatchObject({
      response: { status: 411 }
    })
  })
});

describe('testing api for /signin', () => {
  it("this should pass", async () => {
    const res2 = await createUser();

    await expect(axios.post(`${BASE_URL}/signin`, {
      email: res2.username,
      password: res2.password,
    })).resolves.toHaveProperty("status", 200)
  })

  it("this should fail as of invalid inputs", async () => {
     await expect(axios.post(`${BASE_URL}/signin`, {
      email: "he",
      password: PASSWORD,
    })).rejects.toMatchObject({
      response: {
        status: 411
      }
    })
  })

  it("this should fail as user not found", async () => {
    await expect (axios.post(`${BASE_URL}/signin`, {
      email: "isthis present",
      password: PASSWORD,
    })).rejects.toMatchObject({
      response: {
        status: 404
      }
    })
  })
})
