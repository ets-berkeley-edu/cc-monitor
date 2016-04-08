# CalCentral Monitor

## Build
Run the NodeJS server with:

```bash
npm start
```
And run the webpack (front end) server with:

```bash
webpack-dev-server
```
After running both servers, the web application can be accessed at [localhost:8080](http://localhost:8080/).
## Screenshot
![CalCentral Monitor Page Screenshot](http://s28.postimg.org/4u4govh7h/Screen_Shot_2016_04_07_at_4_58_21_PM.png)
## Environment Variables
Before running the servers, you must create a `.env` file that contains the usernames, passwords, and other confidential values of the different APIs in the base directory of the application. The `.env_template` file is provided for you in the repository. Replace the x's with the correct values from your `~/.calcentral_config/development.local.yml` file.
