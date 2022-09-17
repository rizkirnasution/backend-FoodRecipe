![backend-FoodRecipe](https://socialify.git.ci/rizkirnasution/backend-FoodRecipe/image?description=1&font=KoHo&forks=1&issues=1&language=1&name=1&owner=1&pattern=Signal&pulls=1&stargazers=1&theme=Light)


> Simplified backend for recipes apps

### 🏠 [Homepage](https://github.com/rizkirnasution/backend-FoodRecipe)

### ✨ [Demo](https://food-recipe-production.up.railway.app/api/v1)

---

# FEATURES
- ROBUST ROUTES (Validation & Sanitizer)
- AUTHENTICATION & AUTHORIZATION
- JWT (Token & Refresh Token)
- HASH (Password with Argon2 Winner of PHC)
- ENCRYPTION (Some data)
- COOKIE (HTTP Only Cookie)
- HANDLER (Error & Form Data)
- STANDARIZE (Error & Code)
- CACHE (Redis)
- LINTER (Code)
- MANY MORE....

---

# TECH USED
 ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

* JavaScript
* NodeJS
* ExpressJS
* PostgreSQL
* Redis
* Cloudinary
* Argon2

---

# DETAILS

## Dependencies

- [argon2](https://ghub.io/argon2): An Argon2 library for Node
- [cloudinary](https://ghub.io/cloudinary): Cloudinary NPM for node.js integration
- [cookie-parser](https://ghub.io/cookie-parser): Parse HTTP request cookies
- [cors](https://ghub.io/cors): Node.js CORS middleware
- [cross-env](https://ghub.io/cross-env): Run scripts that set and use environment variables across platforms
- [cross-fetch](https://ghub.io/cross-fetch): Universal WHATWG Fetch API for Node, Browsers and React Native
- [dotenv](https://ghub.io/dotenv): Loads environment variables from .env file
- [duration-js](https://ghub.io/duration-js): small simple library for dealing with durations
- [express](https://ghub.io/express): Fast, unopinionated, minimalist web framework


## Dev Dependencies

- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-standard](https://ghub.io/eslint-config-standard): JavaScript Standard Style - ESLint Shareable Config
- [eslint-plugin-import](https://ghub.io/eslint-plugin-import): Import with sanity.
- [eslint-plugin-n](https://ghub.io/eslint-plugin-n): Additional ESLint&#39;s rules for Node.js
- [eslint-plugin-promise](https://ghub.io/eslint-plugin-promise): Enforce best practices for JavaScript promises


## Environment

| Environment | Value | Description |
| :--------- | :--- | :--------- |
|      PORT      | `5000` | Port |
|      PGHOST      | `localhost` | Database host |
|      PGPORT      | `8080` | Database port |
|      PGDATABASE      | `postgres` | Database name |
|      PGUSER      | `postgres` | Database username |
|      PGPASSWORD      | - | Database password |
|      FRONTEND_URL      | `your_frontend_url` | Frontend url without slash in the end for Cross Origin (CORS) |
|      CLOUDINARY_URL   | `cloudinary://` | Cloudinary URL |
|      SMTP_HOST      | - | SMTP host |
|      SMTP_PORT      | - | SMTP port |
|      SMTP_USERNAME      | - | SMTP username |
|      SMTP_PASSWORD      | - | SMTP password |
|      REDIS_URL      | `rediss://default:password@host:port` | Redis url cluster for production |
|      REDIS_CACHE_LIFE      | `3m` | Redis cache expiration (3 minutes or more) |
|      JWT_SECRET_KEY      | - | JWT Secret Key |
|      JWT_REFRESH_SECRET_KEY      | - | JWT Secret Key (Refresh token) |
|      JWT_TOKEN_LIFE      | `4h` | JWT Life (4 hours or more) |
|      JWT_REFRESH_TOKEN_LIFE      | `1d` | JWT Life (Refresh token 1 day or more) |
|      JWT_ALGORITHM      | `HS256` | JWT Algorithm (see on wikipedia algorithm programming) |
|      ENCRYPTION_PASSWORD      | - | Encryption password (your password) |
|      ENCRYPTION_SALT      | - | Encryption salt (your salt) |
|      ENCRYPTION_DIGEST      | `sha512` | Encryption digest (see on wikipedia algorithm digest) |
|      SITE_NAME      | `site_name` | Site name |
|      MAX_FILE_SIZE      | `5` | File size number (5mb or more) |
|      COOKIE_SECRET_KEY      | - | Cookie secret key (random) |
|      EMAIL_SERVICE      | `support@example.com` | Email service's (Customer Care) |


## API Reference

| Endpoint Development | Endpoint Production |
| :------: | :------: |
| `https://localhost:8080/api/v1` | `https://food-recipe-production.up.railway.app/api/v1` |


### AUTHENTICATION
#### Post registration

```http
  POST /api/v1/auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Name of new user to insert |
| `email` | `string` | **Required**. Email of new user to verification |
| `password` | `string` | **Required**. Password of new user to sign in |
| `picture` | `file` | **Optional**. Picture of new user |
| `role` | `string` | **Optional**. Role of new user to authorization, default is (User) |

#### Get verification account by code

```http
  GET /api/v1/auth/verification/:code
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `code` | `string` | **Required**. Long text of code to verification |

#### Post login

```http
  POST /api/v1/auth/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required**. Email of existing user to sign in |
| `password` | `string` | **Required**. Password of existing user to sign in |

#### Get refresh token of logged user

```http
  GET /api/v1/auth/refresh-token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `-` | `-` | - |

#### Get logout of logged user

```http
  GET /api/v1/auth/logout
```

****INCLUDE BEARER TOKEN!****

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `-` | `-` | - |


### Profile
#### Edit existing user profiles

```http
  PUT /api/v1/profile
```

****INCLUDE BEARER TOKEN!****

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of user to update |
| `name` | `string` | **Optional**. New name of existing user to update |
| `email` | `string` | **Optional**. New email of existing user to update |
| `password` | `string` | **Optional**. New password of existing user to update |
| `picture` | `file` | **Optional**. New picture of existing user to update |
| `role` | `string` | **Optional**. New role of existing user to update |

### CATEGORIES
#### Get all categories

```http
  GET /api/v1/categories
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| - | - | - |

### RECIPES
#### Get all recipes

```http
  GET /api/v1/recipe
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `search` | `string` | **Optional**. Keyword to search products |
| `page` | `integer` | **Optional**. Current page of products |
| `limit` | `integer` | **Optional**. Limit data of products to show |
| `orderBy` | `string` | **Optional**. Ordering data by key name |
| `sortBy` | `string` | **Optional**. Sorting data by ASCENDING or DESCENDING (ASC / DESC) |

#### Get recipe by id

```http
  GET /api/v1/recipe/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `integer` | **Required**. Id of recipe to fetch |

#### Post new recipe data

```http
  POST /api/v1/recipe
```

****INCLUDE BEARER TOKEN!****

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title` | `string` | **Required**. Title of new recipe to insert |
| `ingredient` | `string` | **Required**. Ingredient of new recipe to insert |
| `category` | `string` | **Required**. Category of new recipe to insert |
| `picture` | `file` | **Required**. Thumbnail of new recipe |
| `video` | `file` OR `[arr of files]` | **Required**. Videos of new recipe |

#### Put existing recipe data

```http
  PUT /api/v1/recipe/:id
```

****INCLUDE BEARER TOKEN!****

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `integer` | **Required**. Id of recipe to update |
| `title` | `string` | **Optional**. New title of existing recipe to update |
| `ingredient` | `string` | **Optional**. New ingredient of existing recipe to update |
| `category` | `string` | **Optional**. New category of existing recipe to update |
| `picture` | `file` | **Optional**. New thumbnail of existing recipe to update |
| `video` | `file` OR `[arr of files]` | **Optional**. New videos of existing recipe to update |

#### Delete existing recipe data

```http
  DELETE /api/v1/recipe/:id
```

****INCLUDE BEARER TOKEN!****

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `integer` | **Required**. Id of recipe to delete |

### VIDEOS

#### Post new videos data

```http
  POST /api/v1/video
```

****INCLUDE BEARER TOKEN!****

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title` | `string` | **Required**. Title of new video to insert |
| `picture` | `file` | **Required**. Thumbnail of new video |
| `video` | `file` | **Required**. URL of new video |
| `recipe_id` | `number` | **Required**. Recipe ID of new video |

#### Put existing video data

```http
  PUT /api/v1/video/:id
```

****INCLUDE BEARER TOKEN!****

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `integer` | **Required**. Id of video to update |
| `title` | `string` | **Optional**. New title of existing video to update |
| `picture` | `file` | **Optional**. New thumbnail of existing video to update |
| `video` | `file` | **Optional**. New URL of existing video to update |
| `recipe_id` | `number` | **Optional**. New Recipe ID of existing video to update |

#### Delete existing video data

```http
  DELETE /api/v1/video/:id
```

****INCLUDE BEARER TOKEN!****

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `integer` | **Required**. Id of video to delete |

---

# Installation

This is a [Node.js](https://nodejs.org/) module available through the 
[npm registry](https://www.npmjs.com/). It can be installed using the 
[`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
or 
[`yarn`](https://yarnpkg.com/en/)
command line tools.

## Development

Clone the project

```bash
  git clone https://github.com/rizkirnasution/backend-FoodRecipe backend-foodrecipe
```

Go to the project directory

```bash
  cd backend-foodrecipe
```

Rename environment files `.env.example` to `.env` and filled up the environment variables

```bash
mv .env.example .env
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```


## Production

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/uNIpBg?referralCode=86bdt1)

---

# Acknowledgements

 - Our's mentor [Zaki Maliki](https://github.com/zakimaliki)
 - Best search engine's [Google](https://www.google.com/)
 - Most helped forum [Stack Overflow](https://stackoverflow.com/)
 
 ---
 
# Show your support

Give a ⭐️ if this project helped you!
 
 ---
 
# 📝 License

Copyright © 2022.

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
