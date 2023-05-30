import axios from "axios";

async function checkAuth() {
  // const SignIn = await axios
  //   .post(
  //     `${import.meta.env.VITE_API_URL}/users/auth/sign-in`,
  //     {
  //       username: "Loooper06",
  //       password: "Alihdrg9090",
  //     },
  //     { withCredentials: true }
  //   )
  //   .then((res) => res)
  //   .catch((err) => err.response.data.statusCode);
  const result = await axios
    .get(`${process.env.REACT_APP_API_URL}/users/auth/check-login`, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return result;
}

export { checkAuth };
