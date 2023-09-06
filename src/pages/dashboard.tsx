import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { withSSRAuth } from "../utils/withSSRAuth";
import { api } from "./api/apiClient";
import { setupAPIClient } from "./api/api";
import { useCan } from "../hooks/useCan";
import { Can } from "../components/Can";

export default function Dasboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get("/me").then().catch();
  }, []);

  return (
    <>
      <h1>Dash</h1>
      <p>Usuario Logado: {user?.email}</p>

      <Can permissions={["metrics.list"]}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  await apiClient.get("/me");

  // console.log(response.data);

  return {
    props: {},
  };
});
