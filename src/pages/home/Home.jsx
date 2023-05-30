import { useEffect } from "react";
import { checkAuth } from "../../utils/checkAuth";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  async function checkSignin() {
    const signIn = await checkAuth();
    if (signIn?.statusCode !== 200) navigate("/login");
  }

  useEffect(() => {
    checkSignin();
  }, []);

  return (
    <div>
      Ali
      <p>Salam</p>
    </div>
  );
}

export default Home;
