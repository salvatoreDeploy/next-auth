import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from 'nookies'
import { signOut } from "../../context/AuthContext";
import { GetServerSidePropsContext } from "next";



let isRefreshing = false
let failedRequestQueue: { onSuccess: (token: string) => void; onFailure: (err: AxiosError<unknown, any>) => void; }[] = []

export function setupAPIClient(ctx?: GetServerSidePropsContext) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:3333', headers: {
      Authorization: `Bearer ${cookies['nextAuth.token']}`
    }
  })

  const isBrowser = typeof window !== 'undefined';

  api.interceptors.response.use(sucsses => { return sucsses }, (error) => {
    if (error.response?.status === 401) {
      if (error.response.data.code === 'token.expired') {

        cookies = parseCookies(ctx)

        const { 'nextAuth.refreshToken': refreshToken } = cookies
        const originalConfig = error.config

        if (!isRefreshing) {
          isRefreshing = true

          api.post('/refresh', {
            refreshToken
          }).then(response => {
            const { token } = response.data

            setCookie(ctx, "nextAuth.token", token, {
              maxAge: 60 * 60 * 24 * 30, // 30 Days
              path: "/",
            });
            setCookie(ctx, "nextAuth.refreshToken", response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, // 30 Days
              path: "/",
            })

            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            failedRequestQueue.forEach(request => request.onSuccess(token))
            failedRequestQueue = []
          }).catch(err => {
            failedRequestQueue.forEach(request => request.onFailure(err))
            failedRequestQueue = []

            if (isBrowser) {
              signOut()
            }

          }).finally(() => {
            isRefreshing = false
          })
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`

              resolve(api(originalConfig))
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        })

      } else {
        if (isBrowser) {
          signOut()
        }
      }
    }

    return Promise.reject(error)
  })

  return api
}