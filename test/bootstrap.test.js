import test from 'tape'
import boot, {BOOT} from 'redux-boot'
import request from 'supertest'
import webserverModule, {HTTP_AFTER_BOOT, HTTP_REQUEST} from '../src'

test('Web server bootstrap', assert => {
  const getState = () => {
    return {
      variables: { port: 3020 }
    }
  }

  const dispatch = (action) => {

    if (action.type === HTTP_AFTER_BOOT) {
      const { httpServer } = action.payload

      request(httpServer)
        .get('/')
        .expect(200)
        .end((error, response) => {
          if (error) throw error

          assert.ok(!error, 'Ok')
          assert.equal(response.text, 'Hello World!')
          assert.end()

          httpServer.close()
        })
    }

    if (action.type === HTTP_REQUEST) {
      const { response } = action.payload

      response.statusCode = 200
      response.setHeader('Content-Type', 'text/plain')
      response.end('Hello World!')
    }

    return Promise.resolve()
  }

  const next = action => action
  const action = { type: BOOT }

  webserverModule.middleware[BOOT]({getState, dispatch})(next)(action)
})

test('Web server request', assert => {

  const initialState = {
    variables: { port: 3020 }
  }

  const serverModule = {
    middleware: {
      [HTTP_REQUEST]: store => next => action => {

        const {response} = action.payload

        response.statusCode = 200
        response.setHeader('Content-Type', 'text/plain')
        response.end('Hello Motherfocas!')

        return next(action)
      },

      [HTTP_AFTER_BOOT]: store => next => action => {

        const { httpServer } = action.payload

        request(httpServer)
          .get('/')
          .expect(200)
          .end((error, response) => {
            if (error) throw error

            assert.ok(!error, 'Ok')
            assert.equal(response.text, 'Hello Motherfocas!')
            assert.end()

            httpServer.close()
          })

        return next(action)
      }
    }
  }

  const modules = [
    webserverModule,
    serverModule
  ]

  const app = boot(initialState, modules)
})