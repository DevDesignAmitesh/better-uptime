import axios from "axios";

export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MDY2MDgyMi1jOTU3LTQ0YjQtOWVlNy03ZDJkOGY0MWVhYjciLCJpYXQiOjE3NjQzMTYzMTR9.NVmWuDwYEj1r45SWZ3CEPfpY08UXp4iva1WoT79MFLY";



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

export const createWebite = async () => {
  const res =  await axios.post(`${BASE_URL}/website`, {
    url: "https://google.com",
  }, {
    headers: {
      Authorization: token
    }
  });

  console.log(res)

  return res.data.websiteId
};
