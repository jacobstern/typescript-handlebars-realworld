# typescript-handlebars-realworld

## About

This is an implementation of the https://github.com/gothinkster/realworld application. Unlike most of the RealWorld apps, which
separate the backend and the frontend, this one is a server-rendered app with minimal client-side JavaScript. I made this mostly to
acquaint myself with server-rendered app development, specifically using Handlebars.js, as research for other projects.

There are some incidental UX benefits from server rendering compared to, for example, the reference implementation at
https://demo.realworld.io/#/. There are no loading spinners, and shareable URLs are used where applicable. You can try out the
application at https://handlebars-realworld.herokuapp.com/.

I've also added [Turbolinks](https://github.com/turbolinks/turbolinks) to
improve performance for server-rendered page loads. This feature was hacked
together pretty fast and there may be some problems but it seems to be working
fine so far.

## Running the app locally

This project requires a global https://yarnpkg.com/en/ installation for
development. You will also need a local Postgres instance with user `postgres`
and password `postgres` by default, with a database called
`typescript_handlebars_realworld_dev` (and
`typescript_handlebars_realworld_test` if you're running the tests).

- Get started/install: `yarn`
- Run the app in watch mode: `yarn dev`
- Run integration tests: `yarn test`

## Technology notes

### The stack

- TypeScript: https://www.typescriptlang.org/
- Web framework: https://expressjs.com/
- ORM: https://github.com/typeorm/typeorm
- Templating: https://handlebarsjs.com/
- Validation: https://github.com/typestack/class-validator
- JavaScript transpiler: https://babeljs.io/
- Asset bundler: https://parceljs.org/
- Frontend performance boost: https://github.com/turbolinks/turbolinks

### Frontend assets

Frontend scripts are written in ESNext and compiled down to the target ES5. This is probably an overengineered solution generally
speaking but I wanted to potentially enable code sharing between frontend and backend in future updates.
