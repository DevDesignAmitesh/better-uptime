import axios from "axios";

export const BASE_URL = "http://localhost:3000";

export const createUser = async () => {
  const username = Math.random().toString();
  const password = "helloji";
  await axios.post(`${BASE_URL}/signup`, {
    email: username,
    password,
  });

  return { username, password };
};
