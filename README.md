# Gate Pass System

This is a web application for managing gate passes.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, create a `.env` file and set the `DATABASE_URL` environment variable. For development with SQLite, you can set it as:

```
DATABASE_URL="file:./dev.db"
```

Next, run the database migrations:

```bash
npx prisma migrate dev
```

You can also seed the database with initial data:

```bash
npm run db:seed
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

To deploy this application, you should:

1.  **Use a production-ready database:** It is highly recommended to switch from SQLite to a more robust database like PostgreSQL or MySQL for production.
    *   Update the `provider` in `prisma/schema.prisma` to `postgresql` or `mysql`.
    *   Set the `DATABASE_URL` environment variable in your deployment environment to point to your production database.

2.  **Build the application:**

    ```bash
    npm run build
    ```

3.  **Start the production server:**

    ```bash
    npm start
    ```

Your application should now be ready for deployment. 