import test from 'tape'
import {BOOT} from 'redux-boot'
import request from 'supertest'
import boilerplateModule from '../src'
import {HTTP_AFTER_BOOT} from '../src/constants'

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

    return Promise.resolve()
  }

  const next = action => action
  const action = { type: BOOT }

  boilerplateModule.middleware[BOOT]({getState, dispatch})(next)(action)
})
