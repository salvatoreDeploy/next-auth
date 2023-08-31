import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../pages/api/errors/AuthTokenError";

export function withSSRAuth<P extends { [key: string]: any; }>(fn: GetServerSideProps<P>) {

  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    // console.log(ctx.req.cookies);

    const cookies = parseCookies(ctx);

    if (!cookies["nextAuth.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx)
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, "nextAuth.token");
        destroyCookie(ctx, "nextAuth.refreshToken");
      }

      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }


  }
}