import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "./api/api";

export default function Dasboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <h1>Dash</h1>
      <p>Usuario Logado: {user?.email}</p>
    </>
  );
}
