import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static"
import { jwt } from "@elysiajs/jwt"
import { bearer } from '@elysiajs/bearer'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { AuthenticationError } from "./exception/AuthenticationError";
import { AuthorizationError } from "./exception/AuthorizationError";
import { DataNotFoundError } from "./exception/DataNotFound";
import { response } from "./controller/reponse";
import { MainRoute } from "./routes";
import { logger } from '@grotto/logysia';
import * as log from './utilities/logger';

export const app = new Elysia()
  .use(swagger())
  .use(bearer())
  .use(cors())
  .use(staticPlugin({
    assets: 'files',
    prefix: '/image'
  }))
  .use(staticPlugin({
    assets: 'assets',
    prefix: '/assets'
  }))
  .use(jwt({
    name: 'jwt',
    secret: Bun.env.JWT_SECRET!,
    exp: '7d'
  }))
  .use(jwt({
    name: 'refreshJwt',
    secret: Bun.env.JWT_REFRESH!,
    exp: '14d'
  }))
  .get("/api/health", () => "OK")
  .error('AUTHENTICATION_ERROR', AuthenticationError)
  .error('AUTHORIZATION_ERROR', AuthorizationError)
  .error('DATANOTFOUND_ERROR', DataNotFoundError)
  .onError(({ code, error, set }) => {
    log.logger.Error(error)
    switch (code) {
      case 'VALIDATION':
        set.status = 422
        return {
          status: 'error',
          message: error.validator
        }
      case 'PARSE':
        set.status = 400
        return {
          status: 'error',
          message: error.body
        }
      case 'AUTHENTICATION_ERROR':
        set.status = 401
        return {
          status: 'error',
          message: error.message.toString().replace('Error: ', '')
        }
      case 'AUTHORIZATION_ERROR':
        set.status = 403
        return {
          status: 'error',
          message: error.message.toString().replace('Error: ', '')
        }
      case 'NOT_FOUND':
        set.status = 404
        return {
          status: 'error',
          message: 'Route not found'
        }
      case 'DATANOTFOUND_ERROR':
        set.status = 404
        return {
          status: 'error',
          message: error.message.toString().replace('Error: ', '')
        }
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500
        return {
          status: 'error',
          message: 'Something went wrong!'
        }
      case 'UNKNOWN':
        set.status = 500
        return {
          status: 'error',
          message: 'Something went wrong!'
        }
      default:
        const errorMessage = response.ErrorResponse(set, error);
        set.status = errorMessage.status
        log.logger.Error(error)
        return {
          status: 'error',
          message: errorMessage.message
        }
    }
  })
  .use(logger({
    logIP: false,
    writer: {
      write(msg: string) {
        console.log(msg + ' | ' + new Date())
      }
    }
  }))
  .get('/api/health', () => 'OK', {
    detail: {
      tags: ['health']
    }
  })
  .group("/api", MainRoute)
