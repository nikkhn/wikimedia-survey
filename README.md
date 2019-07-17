# Wikimedia Survey
- A survey system allowing users to vote on crucial questions

## Local App Setup

- Run `npm install` to get necessary packages
- Ensure you have MySQL (version 8+) installed
	- For Macs, you can run `brew install mysql`
- Run `brew services start mysql` to start up the database
- Execute all the SQL queries included in the file `SqlQueries.SQL` to initialize database tables
	- You can install and use a handy tool like `SequelPro` or `MySQL Workbench` to do so easily
	- Username is `root` and password is `wikipass`
- Naviage to home directory of project
- Run `npm run wiki-wiki` to start application
- In your browser naviagate to `localhost:3000`;

### Happy Survey-ing!
