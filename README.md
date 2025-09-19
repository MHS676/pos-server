POS Server

A NestJS + GraphQL + Prisma POS backend with multi-tenant support:

Organizations

Users

Categories

Products

Orders

Includes JWT authentication for secure access.

Table of Contents

Requirements

Installation

Environment Variables

Database Setup

Seed Script

Running the Server

GraphQL Playground

Testing APIs

Notes

Requirements

Node.js >= 18.x

npm >= 9.x

PostgreSQL >= 13.x

Git

Installation
git clone https://github.com/<your-username>/pos-server.git
cd pos-server
npm install

Environment Variables

Create a .env file in the root of the project:

# PostgreSQL connection URL
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?schema=public

# JWT secret for authentication
JWT_SECRET=supersecret


Replace <user>, <password>, <host>, <port>, and <database> with your database credentials.

Database Setup
1. Generate Prisma client
npx prisma generate

2. Push schema to database
npx prisma db push


Or if you are using migrations:

npx prisma migrate dev --name init

3. Inspect database (optional)
npx prisma studio


Opens a web UI to browse and manage your database tables.

Seed Script

The project includes prisma/seed.ts to auto-populate your database:

Creates a default organization

Creates 2 categories

Creates 2 products tied to those categories

Run the seed
npm run db:seed


After running the seed, you can immediately test APIs without manually creating records.

Example records after seeding:

Table	Example Record
Organization	Acme Inc. (id=1)
Category	Electronics, Home Office
Product	Wireless Headphones, Ergonomic Desk Chair
Running the Server

Development mode (auto-reload):

npm run start:dev


Production mode:

npm run build
npm run start:prod


Server runs at: http://localhost:3000/graphql

GraphQL Playground

Open http://localhost:3000/graphql
 to execute queries and mutations.

JWT-protected routes require headers:

{
  "Authorization": "Bearer <your-jwt-token>"
}

Testing APIs
Auth
Register
mutation Register($email:String!, $password:String!, $name:String!, $organizationId:Int!) {
  register(email:$email, password:$password, name:$name, organizationId:$organizationId) {
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
mutation Login($email:String!, $password:String!) {
  login(email:$email, password:$password)
}


Variables:

{
  "email": "jane@acme.com",
  "password": "secret123"
}


Copy the returned JWT token for all guarded queries.

Users
query Users {
  users {
    id
    email
    name
  }
}

Categories
List Categories
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

Create Category
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
Place Order
mutation PlaceOrder($productId:Int!, $quantity:Int!) {
  placeOrder(productId:$productId, quantity:$quantity) {
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

List Orders
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
Sync Users from JSONPlaceholder
mutation SyncUsers {
  syncUsers
}

Sync Categories from JSONPlaceholder
mutation SyncCategories {
  syncCategories
}

Notes

Ensure Organization exists before registering users.

Seed script (seed.ts) is optional but recommended for development/testing.

JWT token is required for all guarded queries/mutations.

Use Prisma Studio to inspect your database anytime:

npx prisma studio
