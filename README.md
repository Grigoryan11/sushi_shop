# Library REST API

### How to use it 

---
## Requirements

You will need install `Node.js`, `npm` and `PostgreSQL`  in your environment.
### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v13.12.0

    $ npm --version
    6.14.2

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

### PostgreSQL
Install PostgreSQL [Guide](https://www.postgresql.org/download/)

## Running the project

    $ npm start:dev

## Making requests
### ``By default, the API_HOST is http://localhost:3000``

### ``Add a new user``
request url `API_HOST/auth/register`

request method `POST`

request body
`{`
email: `{String}`, (required)
firstName: `{String}`, (required)
lastName: `{String}`, (required)
password: `{String}`, (required)
confirmPassword: `{String}`, (required)
phone: `{String}`, (required)
`}`

### ``login user``
request url `API_HOST/auth/login`

request method `POST`

request body
`{`
email: `{String}`, (required)
password: `{String}`, (required)
`}`

### ``changeUser password``
request url `API_HOST/auth/changeUserPassword`

request method `POST`

request body
`{`
oldPassword: `{String}`, (required)
newPassword: `{String}`, (required)
confirmPassword: `{String}`, (required)
`}`

### ``user forgot password``
request url `API_HOST/auth/email-forgot-password`

request method `POST`

request body
`{`
email: `{String}`, (required)
`}`

### ``forgot password change``
request url `API_HOST/auth/forgot-password`

request method `POST`

request body
`{`
new_pass: `{String}`, (required)
confirm_pass: `{String}`, (required)
data: `{String}`, (required)
`}`

### ``user activating``
request url `API_HOST/auth/active`

request method `POST`

request body
`{`
data: `{String}`, (required)
`}`
