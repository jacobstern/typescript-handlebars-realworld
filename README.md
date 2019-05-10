# ![RealWorld Example App](logo.png)

> ### TypeScript + Express + Handlebars codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec.

### [Demo](https://handlebars-realworld.herokuapp.com/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to community styleguides & best practices.

For more information head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

## About

Unlike most RealWorld implementations, which separate the backend and the
frontend, this one is a "full stack" server-rendered app with minimal
client-side JavaScript. I made this mostly to acquaint myself with
server-rendered app development, specifically using Handlebars.js, as research
for other projects.

There are some incidental UX benefits from server rendering compared to, for
example, the reference implementation at https://demo.realworld.io/#/. There are
no loading spinners, and shareable URLs are used to represent page state where
applicable. You can try out the application at
https://handlebars-realworld.herokuapp.com/.

I've also implemented [Turbolinks](https://github.com/turbolinks/turbolinks) to
improve perceived performance for server-rendered page loads.

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
