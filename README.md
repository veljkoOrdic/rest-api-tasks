## 🚀 REST API for User & Task Management

This project implements a REST API using **Node.js** and the **Express** framework, with **Sequelize ORM** and an **SQL database (SQLite)** for data storage.  
The API supports user and task management with role-based access (**basic** or **admin**).

### 📋 Prerequisites

Before running the application, make sure you have installed:

* **Node.js** (recommended LTS version)
* **npm** (comes with Node.js)
* **Postman Desktop** (for testing the API)

### 🛠️ Project Setup

1. **Clone the Repository:**
    ```bash
    git clone [YOUR_GITHUB_REPOSITORY_LINK]
    cd [YOUR_PROJECT_NAME]
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Environment Configuration:**

    * Create a `.env` file in the root directory.
    * Add the required environment variables. Example:
      ```env
      PORT=3000
      NODE_ENV=development
      ```
      *SQLite is used by default, so no external DB configuration is required.*

### ▶️ Running the Application

Start the server using the following command:

```bash
npm start
```

Or for development (using nodemon):
```bash
npm run dev
```

The API will be available at:
```bash
http://localhost:3000
```

Run 2e2 test
```bash
npm test
```

Docker build and run
```bash
docker build -t tasks-api .

# run with .env file (that already exist)
docker run --env-file .env -p 3000:3000 tasks-api
```