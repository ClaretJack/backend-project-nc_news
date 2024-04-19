## Northcoders News API

## Project Description
The NC News is a back-end API project designed to be similar to reddit. This project has been built using Javascript, Node.js, Express, PorstgresSQL. It has been built up using TDD method with Jest.

The applications is being hosted through render here is the link: https://backend-project-nc-news-k5t8.onrender.com/api/

### Downloads
Make sure you have the following downloaded with the lastest versions:

* Node.js
* Postgres

### Github - Cloning the project onto your device

To have this project work locally follow the instructions below:

* Go to the github page where this repo is stored: https://github.com/ClaretJack/backend-project-nc_news
* Click on the green dropbox labelled "Code" and copy the URL
* Within the terminal in a file where you wish the project to be, type "git clone <paste URL here>"
* Then open this file in your code application (This project was built on Visual Studio Code)

### Installation

Inside the terminal make sure you are in the project file then proceed installing in the terminal the following:

* npm install -- for more information go to: https://docs.npmjs.com/cli/v10/commands/npm-install

### Creating the databases

For access to the databases create two files in the same directory with the information inside below:

* File Name - .env.development ==> "PGDATABASE=nc_news"
* File Name - .env.test ==> "PGDATABASE=nc_news_test"

To then create the databases within the terminal type:

* npm run setup-dbs
  
### Seeding Database

The database can be seeded by typing the following into the terminal:

* npm run seed

### Listening

To activate the listening app enter the following into the terminal:

* node listen.js
