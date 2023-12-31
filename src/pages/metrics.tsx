import { withSSRAuth } from "../utils/withSSRAuth";
import { setupAPIClient } from "./api/api";

export default function Metrics() {
  return (
    <>
      <h1>Metricas</h1>
    </>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");

    //console.log(response.data);

    return {
      props: {},
    };
  },
  {
    permissions: ["metrics.list"],
    roles: ["administrator"],
  }
);
