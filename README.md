![FlowKata](./public/logo.png)
# Coding LMS Front-end

A React, Material UI front-end for a coding kata SaaS. The backend Java/Spring Boot repo can be found here: https://github.com/RichardSneyd/coding-kata-platform-backend

# Use authService.parseJwt to get User Info

If you provide a valid Jwt token, it should return a JSON object in this format. `sub` means _subject_, and is the _username_ of the User in the db. The `userId` prop can be used with subsequent API calls for the user:

```json
{
  "sub": "fakestudent",
  "roles": ["USER"],
  "iss": "http://localhost:8080/login",
  "exp": 1667581703,
  "userId": 2
}
```

### What you need to run this code

1. Node (17.4.0)
2. NPM (8.3.1)

> These versions are recommended but not obligitory, but should you have problems running the application you should ensure your versions match these.

### How to run this code

1. Clone this repository to your local machine.
2. Get the appropiate server URL (You must have cloned the code-lms backend, or have a live version of it)
3. Run `cp .env.example .env` and fill in the appropiate server URL
4. Run `npm install` to install the dependencies
5. Run `npm start` to run the application in development
6. Run `npm run build` to build the application
