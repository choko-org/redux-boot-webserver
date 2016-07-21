# Redux Boot Web Server module.

[![Build Status](https://travis-ci.org/choko-org/redux-boot-webserver.svg?branch=master)](https://travis-ci.org/choko-org/redux-boot-webserver)

Web server created using Redux Boot as its core.

## Install
```bash
npm install redux-boot-webserver --save
```

## Actions constants

```js
import {
  HTTP_BOOT,
  HTTP_REQUEST,
  HTTP_AFTER_BOOT
} from 'redux-boot-webserver'
```

## Usage

```js
import boot from 'redux-boot'
import webserverModule from 'redux-boot-webserver'

const initialState = {
  variables: { port: 3020 }
}

const backendModule = {
  middleware: {
    [HTTP_REQUEST]: store => next => action => {

      const {response} = action.payload

      response.statusCode = 200
      response.setHeader('Content-Type', 'text/plain')
      response.end('Hello Motherfocas!')

      return next(action)
    }
  }
}

const modules = [
  webserverModule,
  backendModule
]

const app = boot(initialState, modules)
  .then(({store, action}) => {
    console.log('Your server is online!')
  })
```

Go to http://localhost:3020 and you should see the hello message.
