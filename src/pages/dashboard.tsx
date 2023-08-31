import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { withSSRAuth } from "../utils/withSSRAuth";
import { api } from "./api/apiClient";
import { setupAPIClient } from "./api/api";

export default function Dasboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <h1>Dash</h1>
      <p>Usuario Logado: {user?.email}</p>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/me");

  console.log(response.data);

  return {
    props: {},
  };
});
