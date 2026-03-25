import axios from "axios";

const app = axios.create({
  baseURL: "https://perplexity-useo.onrender.com",
  withCredentials: true,
});

export async function register({ email, username, password }) {
  const res = await app.post("/api/auth/register", {
    email,
    username,
    password,
  });
  return res.data;
}
export async function login({ email, password }) {
  const res = await app.post("/api/auth/login", {
    email,
    password,
  });
  return res.data;
}
export async function getMe() {
  const res = await app.get("/api/auth/getme");
  return res.data;
}

export async function logout() {
  const res = await app.post("/api/auth/logout");
  return res.data;
}
