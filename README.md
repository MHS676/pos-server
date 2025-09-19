POS Server

A NestJS + GraphQL + Prisma POS backend with multi-tenant support (organizations, users, categories, products, orders) and JWT authentication.

Table of Contents

Requirements

Installation

Environment Variables

Database Setup

Seed Script

Running the Server

GraphQL Playground

Testing APIs

Requirements

Node.js >= 18.x

npm >= 9.x

PostgreSQL >= 13.x

Git

Installation

Clone the repository:

git clone https://github.com/<your-username>/pos-server.git
cd pos-server


Install dependencies:

npm install

Environment Variables

Create a .env file in the project root:

DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?schema=public
JWT_SECRET=supersecret


Replace <user>, <password>, <host>, <port>, <database> with your Postgres credentials.

Database Setup
1. Generate Prisma client
npx prisma generate

2. Push schema to database
npx prisma db push


or, if using migrations:

npx prisma migrate dev --name init

Seed Script

We include a prisma/seed.ts file to automatically populate your database with minimal data for development/testing:

Creates a default organization.

Creates 2 categories.

Creates 2 products tied to those categories.

How to run the seed
npm run db:seed


Or directly with Prisma:

npx prisma db seed


After running the seed, the database will have:

Table	Example Record
Organization	Acme Inc. (id=1)
Category	Electronics, Home Office
Product	Wireless Headphones, Ergonomic Desk Chair

You can now register users, create orders, and test all APIs without manually adding database records.

Running the Server

Development mode with auto-reload:

npm run start:dev


Production build:

npm run build
npm run start:prod


The server will start on http://localhost:3000/graphql
.

GraphQL Playground

Access GraphQL Playground at:

http://localhost:3000/graphql


Execute queries and mutations.

Include JWT token in HTTP headers for guarded routes:

{
  "Authorization": "Bearer <your-jwt-token>"
}

Testing APIs
Auth
Register
mutation Register($email:String!,$password:String!,$name:String!,$organizationId:Int!){
  register(email:$email,password:$password,name:$name,organizationId:$organizationId){
    id
    email
    name
  }
}


Variables:

{
  "email": "jane@acme.com",
  "password": "secret123",
  "name": "Jane Doe",
  "organizationId": 1
}

Login
mutation Login($email:String!,$password:String!){
  login(email:$email,password:$password)
}


Variables:

{
  "email": "jane@acme.com",
  "password": "secret123"
}


Copy the returned JWT token for guarded queries.

Users
query Users {
  users {
    id
    email
    name
  }
}

Categories
List categories
query Categories {
  categories {
    id
    name
    description
    products {
      id
      name
      price
      stock
    }
  }
}

Create category
mutation CreateCategory($data: CreateCategoryInput!) {
  createCategory(data: $data) {
    id
    name
    description
  }
}


Variables:

{
  "data": {
    "name": "Electronics",
    "description": "Devices & accessories"
  }
}

Orders
Place order
mutation PlaceOrder($productId:Int!,$quantity:Int!){
  placeOrder(productId:$productId,quantity:$quantity){
    id
    userId
    productId
    quantity
    totalPrice
    createdAt
  }
}


Variables:

{
  "productId": 1,
  "quantity": 2
}

List orders
query Orders {
  orders {
    id
    userId
    productId
    quantity
    totalPrice
    createdAt
    user { id email name }
    product { id name price stock }
  }
}

Sync
Sync users from JSONPlaceholder
mutation SyncUsers {
  syncUsers
}

Sync categories from JSONPlaceholder
mutation SyncCategories {
  syncCategories
}

Notes

Ensure Organization exists before registering users (id must match).

Seed script (seed.ts) is optional but recommended for dev/testing.

JWT token is required for all guarded queries/mutations.

Use Prisma Studio to inspect your database anytime:

npx prisma studio