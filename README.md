## UDT-BACKEND-NODEJS-TESTSHEET
### Installation
### Run with docker
> - download docker-compose.yml file from this repository 
> - run command: docker compose up
### Clone repository
> - git clone https://github.com/manhcuongno3/UDT-BACKEND-NODEJS-TESTSHEET.git
> - cd UDT-BACKEND-NODEJS-TESTSHEET


### Question 1
> - cd question1
> - node rent-container-algorithm.js

### Question 2
> Diagram for ecosystem:
> ![Ecommerce Diagram](question2/ecommerce.diagram.png)

### Question 3

1. Database use: PostgreSQL
> use Redis cache to optimize frequently used tasks.

2. Reason for choosing PostgreSQL: 
> Because PostgreSQL is a relational database, supports foreign keys, relationships, indexing and transactions. If using NoSQL, 
> need to change schemas to be compatible.

> Strengths:
> - Data integrity: Reference foreign keys to handle complex relationships.
> - Use SQL to query and update data quickly. Help optimize agency and admin reporting tasks.
> - Follow ACID (Atomicity, Consistency, Isolation, Durability), ensuring high reliability for transactions.
> - Data consistency: Avoid duplicate or missing data in schemas when saving to the database.
> - Security: Provides data control based on permissions.

> Weaknesses: 
> - Learning Curve: For s imple CRUD tasks, it's not difficult to do, but for advanced features, complex optimizations based on query design require a deep understanding and experience.
> - Complex configuration, requiring setup to deploy and maintain.
> - Limitation of scalability: If the e-commerce system is large with millions of records, PostgreSQL does not have automatic sharding to distribute data across multiple servers (horizontal scaling). Manual installation or external solutions are required.
> - Performance: PostgreSQL uses MVCC (Multi-Version Concurrency Control) to manage concurrency. When a record is updated, PostgreSQL creates a new record and retains the old one. This leads to rapid growth in size. These data need to be processed regularly.

3. docker-compose.yml file to run database locally:
> - default username and password is admin
> - default database name is ecommerce
> - Start by steps:
> - Run docker desktop
> - cd question3
> - docker compose up __or__ docker compose up -d POSTGRES_USER=your username POSTGRES_PASSWORD=your password POSTGRES_DB=your database name

4. Set up Loopback 4
> - git checkout feature/setup-loopback
> - cd ecommerce
> - npm install
> - npm start

5. Write API for feature for diagram
> - git checkout feature/ecommerce-api
> - cd ecommerce
> - start database in docker
> - migrate application with database by command: npm run migrate
> - npm install
> - npm start 

6. Test API
> - access to http://localhost:3000/explorer

### Question 4
1. Diagram for authentication and authorize:
#### Customer Sequence Diagram
![Customer Sequence Diagram](question4/part1/customer.sequence.diagram.png)

#### Agency Sequence Diagram
  ![Agency Sequence Diagram](question4/part1/agency.sequence.diagram.png)

#### Admin Sequence Diagram
![Admin Sequence Diagram](question4/part1/admin.sequence.diagram.png)

#### Persistent Authentication Sequence Diagram
![Persistent Authentication Sequence Diagram](question4/part1/persistent-authentication.sequence.diagram.png)

2. Implement API for diagram
> - git checkout feature/authenticate-authorize
> - cd ecommerce
> - npm install
> - npm start

3. Strong and weak points
> - ### Strong points:
> - JWT token-based authentication
> - Token storage in local storage
> - Authorization based on roles
> - Token verification on each request
> - Good microservices architecture approach
> - Clear separation of responsibilities between different repositories
> - Well-defined actors (Admin, Agency, Customer)
> - ### Weak points:
> - Storing JWT in local storage is vulnerable to XSS attack
> - No refresh token mechanism shown
> - No caching strategy visible