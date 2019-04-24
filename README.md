# DungeonEProcioniAPI

Character tracker backend API built with node

## Getting started

Clone the repo and download dependencies:
```
git clone https://github.com/rickycorte/DungeonEProcioniAPI.git
npm install
```

Now that you installed everything you have to set 4 environment variables

Name | Description
--- | ---
MONGO_URL | MongoDB uri: mongodb+srv://<user>:<psw>@<host>/DungeonEProcioni
JWT_SECRET | Secret token to encrypt JWT tokens
JWT_TOKEN_LIFETIME_SECONDS | JWT token lifetime in seconds; `86400 = 24h`
NODE_ENV | Set this var to "production" only on the production machines

Leave `NODE_ENV` empty to load debug env vars stored in `.env` file.


## Auth
We handle auth with jwt tokens issued by the server! Both register and login methods return jwt token for the user if the operation succeded!

To send the jwt token you have to send it on every request that requires auth as a http header:

```
x-access-token: your-jtw-token  
```

# Methods

Every method accepts and respospon with a json,

Every responce has a basic json format:
```
{
    "result": "ok / error",
    / * data */
}
```

If `result` is set to `error`, a `message` field is set with a error string.


### Register
Register a new user

Request:

Type | Path | Auth
:---: | :---: | :---:
POST | example.com/auth/register | N

Parameters:

Parameter | Required | Type | Description
:---: | :---: | :---: | :---: 
name | Y | string | User Name
email | Y | string  | User Email
password | Y | string | User password (wil be encrypted)

On success this functions return the JWT token for the user! See character methods to see how to use JWT token. For the moment just store it somewhere.

### Login
Login a  user

Request:

Type | Path | Auth
:---: | :---: | :---:
POST | example.com/auth/login | N

Parameters:

Parameter | Required | Type | Description
:---: | :---: | :---: | :---: 
email | Y | string  | User Email
password | Y | string | User password (wil be encrypted)

On success this functions return the JWT token for the user! See character methods to see how to use JWT token. For the moment just store it somewhere.

### Check
Checks if the jwt token is valid (used for test purposes)

Request:

Type | Path | Auth
:---: | :---: | :---:
GET | example.com/auth/check | Y

Parameters:

No

Returns ok if jwt token is valid

### Profile
Return user profile data (name, email, ... there is no more xP)


Request:

Type | Path | Auth
:---: | :---: | :---:
GET | example.com/auth/profile | Y

Parameters:

No

## Characters

### Create
Create a new character

Request:

Type | Path | Auth
:---: | :---: | :---:
POST | example.com/characters/create | Y

Parameters:

Parameter | Required | Type | Description
:---: | :---: | :---: | :---: 
character_name | Y | string  | character name to use

### Delete
Delete a owned character. This function prevent deleting characters you don't own

Request:

Type | Path | Auth
:---: | :---: | :---:
POST | example.com/characters/delete | Y

Parameters:

Parameter | Required | Type | Description
:---: | :---: | :---: | :---: 
character_id | Y | string  | character id to delete


### List All
Retrive owned characters from the database. This functions returns an array (`data`) with the list of owned characters

Request:

Type | Path | Auth
:---: | :---: | :---:
GET | example.com/characters/listall | Y

Parameters:

No