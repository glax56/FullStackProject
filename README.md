# cs6400-2023-02-Team08

CS6400 - Summer 2023

Team Members:

- Yadhap Dahal
- Thomas Gracie
- Sheldon Greiling
- Garrison Winter

## Application setup (Development)

<details>
<summary><strong>Prerequisite for development set up</strong></summary>

- **Install Node**
  If you do not have Node installed on your system, please follow this [link](https://nodejs.dev/en/) to download and install it. Node comes with npm, the package manager for Node applications.

- **Install MySQL**
  Ensure that MySQL is installed. You can refer to the [MySQL installation guide](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/) for instructions.

- **Install IDE**
A good IDE can greatly simplify your development process. Try VSCode. You can find the installation guide [here](https://code.visualstudio.com/docs/setup/setup-overview).
</details>

<details>
<summary><strong>Development setup Instructions</strong></summary>

1. **Clone Repo**

2. **Set up environment variables**

   - Set up environment variables for the server:

     - CD into `/web-app`
     - Create a new file called `.env`
     - Copy and paste the content from `.env.sample` to the `.env` file, and update the variables if necessary.

   - Set up environment variables for the client:
     - CD into `/web-app/client`
     - Create a new file called `.env`
     - Copy and paste the content from `/client/.env.sample` to the `.env` file you just created, and update the variables if necessary.

3. **Install Dependencies**

   - Install server dependencies:

     - CD into `/web-app/server`
     - Run `npm install`

   - Install client dependencies:
     - CD into `/web-app/client`
     - Run `npm install`

4. **Run Migration**

   - Ensure that the MySQL service is running.
   - Execute the following command to run migration scripts. The script assumes that the MySQL username is "root," which is the default username.
     - CD into `/web-app/server/migrations`
     - Run `mysql -u root -p < migration_queries.sql`

5. **Run App**

   - Run the server:

     - CD into `/web-app/server`
     - Run `nodemon app.js`
     - You should see "connected to database, server running at port 3001" logged in the terminal.

   - Run the client: - CD into `/web-app/client` - Run `npm start` - You should see "webpack compiled successfully" logged in the terminal, and the app should automatically open in your default browser. - If the browser fails to open, navigate to http://localhost:3000. - You can check the app's health by navigating to http://localhost:3000/health.
   </details>

## Application setup (Docker)

**Note:** This app is designed to be containerized using Docker and deployed in a virtual machine (VM). Make sure Docker is installed and the daemon is running.

<details>
<summary><strong>Setup Instructions</strong></summary>

1. **Clone Repo**

2. **Set up environment variables**

   - Set up environment variables for the server:

     - CD into `/web-app`
     - Create a new file called `.env`
     - Copy and paste the content from `.env.sample` to the `.env` file, and update the variables if necessary.

   - Set up environment variables for the client:
     - CD into `/web-app/client`
     - Create a new file called `.env`
     - Copy and paste the content from `/client/.env.sample` to the `.env` file you just created, and update the variables if necessary.

3. Navigate to /web-app/
4. Run `docker-compose up -d --build` to build the Docker image and spin the contianers
5. The app should be available at http://localhost:3003/
6. To bring the container down, run `docker-compose down`
7. Run `docker ps -a` to view running containers
**Note:** If any container fails to start, run `docker run <container_id>`
</details>
