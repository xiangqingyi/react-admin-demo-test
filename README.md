
# Usage

## Environment required

- [nodejs](https://nodejs.org/) >= 5.5.0  
- [mongodb](https://www.mongodb.org/) >= 3.4


## Install dependencies

server
````
$ npm install
````

client
````
$ cd client
$ npm install
````

## Start Service

### PM2 start

````
$ pm2 start pm2Process
or
$ pm2 start pm2Process --env dev or production
````

### local

server
````
$ npm start
````

client
````
$ cd client
$ npm start
````

### Development

client
````
$ cd client
$ npm run build
$ vi ./build/index.html //static路徑從絕對改相對 /static/ -> ./static/
$ mv ./build/index.html ./build/app.html
````

server
````
$ npm run dev
````

### Production

client
````
same Development
````

server
````
$ npm run server
````

or

````
$ NODE_ENV=production Port=8000 node app
````

## Start View
local先運行server後，在client執行npm start 會自動開啟chrome，網址：http://localhost:3000

其餘的皆為open http://localhost:5000/timesheet

