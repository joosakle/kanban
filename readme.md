What: A simple Kanban board for managing daily tasks. 
How: PHP API with MySQL database on the back-end, simple webapp on the front-end.
Why: To introduce myself to PHP, and to experiment with various front-end technologies.

Getting started:

Back-end:

1. Install LAMP if not installed.
2. Set up the kanban database, with table name task, and columns id(INT PRIMARY KEY), content(VARCHAR),status(INT).
3. Deploy /api folder, and configure database access at /config/database.php

Front-end:

1. Install Parcel for bundling if not already installed (npm install -g parcel-bundler)
2. Run "npm install"
3. Run "parcel build ./front-end/src/index.html" to create a /dist folder, and deploy its content to the server. 
4. For development server, change relative API path at index.html to full address, and run "parcel ./front-end/src/index.html". 

The back-end code is modified from tutorial: https://www.codeofaninja.com/2017/02/create-simple-rest-api-in-php.html
