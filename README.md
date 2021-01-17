# chitchat-js
Run-Time multiuser chat application
(with gmail/facebook authentication,uses mongodb database to store user details and webSockets are use for real time chatting without page reload and redis is use to communcate between different servers) 

Go to the master branch for Code of multiroom realtime chat application

To start the application after cloning(i am considering that you have node.js installed in your sysytems)


1.Do npm init where you clone the repo in your terminal

2.Download all the packages, npm all of them you can see all the dependencies in package.json  

3.Make a development.json file in config folder

Code for development.json
{

  "host": "http://localhost:3000",
  
  "dbURI": "",  //URI of your mongodb online database
  
  "sessionSecret": "catscanfly",
  
  "fb": {
    
    "clientID": "",  //Make a development account of facebook if you don't have and add cridentials
    
    "clientSecret": "",
    
    "callbackURL": "/auth/facebook/callback",
    
    "profileFields": ["id", "displayName", "photos"]
  
  },
  
  "google":{
    
    "clientID":"",  //add google app cridentials
    
    "clientSecret": "",
    
    "callbackURL": "http://localhost:3000/auth/google/callback",
    
    "profileFields": ["id", "displayName", "photos"]
  },
  "redis":{
    
    "host" : "127.0.0.1",
    
    "port" : "6370",
    
    "password" : ""

  }
}

4.For using facebook authorization we need https:// server so for it download ngrok and follow the steps written in following link
https://drive.google.com/file/d/1jzKYHoErFFtFMcgcDJfShBhSL-eert8o/view?usp=sharing

5.Your realtime chat application is deployed
