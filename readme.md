# Minesweeper Application.
## Requirements

This application was built using docker's containers and docker-compose to bootstrap it, for that rason, in  order to run the application you will need

 - Docker (https://docs.docker.com/get-docker/)
 - Docker compose https://docs.docker.com/compose/install/

Once You have everything up and running you will be able to run the command 

```bash
docker-compose up
```
 This command will donwload all requirements you may need to run the application (nodejs, mongodb, etc)
 once the message ` starting node run index.js`  appear in your terminal, you can go yo your web browser and go to `http://localhost:3000/api-docs` 
 

To Run the tests just execute 

```bash
docker-compose run web npm test
```


** Improvements

- Security
- More Testing
- Users System with relational database
- Timer;




If you have any issue running this app, please, do not hesitate on reach me out at `carlosviii@gmail.com`
 

 
 