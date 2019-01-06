This is a simple kanban board project to help keeping track of daily tasks. 

Getting started:

Back-end:

1. Install LAMP if not installed.
2. Set up the kanban database, with table name task, and columns id(INT PRIMARY KEY), content(VARCHAR),status(INT).
3. Deploy /api folder, and configure database access at /config/database.php

Front-end:

1. Install Parcel for bundling if not already installed (npm install -g parcel-bundler)
2. Run "npm install"
3. Run "parcel build ./front-end/src/index.html" to create a /dist folder, and deploy its content to the server. 
4. For development server, run "parcel ./front-end/src/index.html".

