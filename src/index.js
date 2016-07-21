import {createAction} from 'redux-actions'
import {BOOT} from 'redux-boot'

// This is just for the example.
import http from 'http'

import {
  HTTP_BOOT,
  HTTP_AFTER_BOOT,
  HTTP_REQUEST
} from './constants'

export default {

  reducer: {},

  middleware: {

    [BOOT]: store => next => async action => {
      let nextResult = next(action)

      const server = http.createServer((request, response) => {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/plain')
        
        response.end('Hello World!')
      })

      const port = store.getState().variables.port

      const app = await new Promise((resolve, reject) => {
        server.listen(port, () => {
          console.info(`Server running at por ${port}`)
          resolve(server)
        })
      })

      store.dispatch(httpAfterBoot(app))

      return nextResult
    }

  }

}

// Http server bootstrap Action.
export const httpBoot = createAction(HTTP_BOOT, (httpServer) => ({ httpServer }))

// Http after server bootstrap Action.
export const httpAfterBoot = createAction(HTTP_AFTER_BOOT, (httpServer) => ({ httpServer }))
