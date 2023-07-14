import axios from "axios";

async function checkAuth() {
  const result = await axios
    .get(`${process.env.REACT_APP_API_URL}/users/auth/check-login`, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return result;
}

export { checkAuth };
