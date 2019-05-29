# [Full Stack E-Commerce Demo Application](http://turing.sjbroughton.com)  
A storefront for a fictional T-Shirt shop. The front-end is built using VueJS, using SCSS with BEM methodology for responsive styling, and Apollo GraphQL for local state management as well as performing API requests. The back-end is a NodeJS + Express service which acts as a GraphQL wrapper for a REST API supplied by Turing. Where necessary, the GraphQL API uses a Prisma service to communicate with a secondary supplemental database. The application uses an NGINX service as a reverse proxy. All services are containerized with Docker, and Docker-Compose is used for development container orchestration, while TravisCI is used for Continuous Integration and Deployment to several Heroku-hosted applications.  

**Important Note**  
Since the application's services are hosted on free-tier Heroku, if they have been inactive for more than half an hour they will go to sleep, making the first pageload take some time while the services spin back up. Once this has happened the app will operate normally. If this app were in real-world production I would use paid-tier hosting (probably on AWS) and the initial app would load much faster!

## Technologies Used
**Hosting:** Heroku  
**Continuous Integration/Deployment:** TravisCI  
**Containerization:** Docker  
**Proxying/Redirection:** NGINX  
**Front-End Service:** VueJS, NGINX, GraphQL & Apollo, Webpack, SCSS  
**GraphQL API:** NodeJS, Express, GraphQL & Apollo, Prisma, Axios  
**Supplemental Database Layer:** Prisma  

## Key Features
Authentication:
  - Customer can Register
  - Customer can Log in
  - Customer can optionally remain logged in between page reloads for as long as the JWT generated by Turing's API remains valid
  - Due to the supplemental database, the customer is permanently related to a shopping cart so that cart data can be retrieved between sessions (this is not a feature of Turing's API)  

Product Browsing:  The customer can
  - View a paginated list of products
  - Alter the number of products displayed on each page
  - Filter products by department or category
  - Search products for a string appearing in its name or description

Single Product View: The customer can
  - View each product individually
  - Cycle through products
  - Read product reviews
  - Submit a new review and star rating for a product
  - Add a product to the shopping cart, choosing color, size and quantity

Shopping Cart: The customer can
  - View all products currently in the cart
  - See the current total price of the cart's items
  - Remove a product from the cart
  - Change the quantity of any cart item
  - Checkout the cart

Checkout: The customer can
  - Input their delivery options, including shipping
  - See an order summary detailing contents of the order as well as total cost including shipping
  - Input their payment details (currently disabled, only submitting test data so that real payment details aren't submitted)
  - Submit their order, triggering a payment to Stripe through Turing's API (currently not working due to a problem with Turing's API)
  - See a success page if the order submission was successful
  - See that their cart is now empty
