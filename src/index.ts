import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt"
import { bearer } from '@elysiajs/bearer'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { UserRoute } from "./routes/user_rou";
import { AuthenticationError } from "./exception/AuthenticationError";
import { AuthorizationError } from "./exception/AuthorizationError";
import { DataNotFoundError } from "./exception/DataNotFound";
import { response } from "./controller/reponse";
import { MainRoute } from "./routes";

const app = new Elysia()
  .use(swagger())
  .use(bearer())
  .use(cors())
  .use(jwt({
    name: 'jwt',
    secret: Bun.env.JWT_SECRET!,
    exp: '7d'
  }))
  .use(jwt({
    name: 'refreshJwt',
    secret: Bun.env.JWT_REFRESH!
  }))
  .get("/api/health", () => "OK")
  .error('AUTHENTICATION_ERROR', AuthenticationError)
  .error('AUTHORIZATION_ERROR', AuthorizationError)
  .error('DATANOTFOUND_ERROR', DataNotFoundError)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'AUTHENTICATION_ERROR':
        set.status = 401
        return {
          status: "error",
          message: error.message.toString().replace("Error: ", "")
        }
      case 'AUTHORIZATION_ERROR':
        set.status = 403
        return {
          status: "error",
          message: error.message.toString().replace("Error: ", "")
        }
      case 'NOT_FOUND':
        set.status = 404
        return {
          status: "error",
          message: "Route not found"
        }
      case 'DATANOTFOUND_ERROR':
        set.status = 404
        return {
          status: "error",
          message: error.message.toString().replace("Error: ", "")
        }
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500
        return {
          status: "error",
          message: "Something went wrong!"
        }
      default:
        const errorMessage = response.ErrorResponse(set, error);
        set.status = errorMessage.status
        return {
          status: "error",
          message: errorMessage.message
        }
    }
  })

  .group("/api", MainRoute)

  .listen(Bun.env.PORT!);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
