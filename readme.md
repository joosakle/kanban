<b>What:</b> 
A simple Kanban board for managing daily tasks, just for local use and without authentication.

<b>How:</b>  
Keeping things simple for this project with minimum dependencies - just pure PHP REST api for the back-end, vanilla JS for the front-end. Builds using Parcel.

<b>Why:</b> 
To familiarize myself with PHP, and to practice some pure Javascript for a change.

<b>Further development</b> 
No further plans here, since my React and NodeJS based 'Homeboard' project will include a Kanban component among other things.

<b>Getting started:</b>

Back-end:

1. Install LAMP if not installed.
2. Set up the kanban database:
CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(200) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
)
3. Deploy /api folder, and configure database access at /config/database.php

Front-end:

1. Install Parcel for bundling if not already installed (npm install -g parcel-bundler)
2. Run "npm install"
3. Run "parcel build ./front-end/src/index.html" to create a /dist folder, and deploy its content to the server. 
4. For development server, change relative API path at index.html to full address, and run "parcel ./front-end/src/index.html". 

The back-end code is modified from tutorial: https://www.codeofaninja.com/2017/02/create-simple-rest-api-in-php.html
