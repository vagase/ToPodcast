NODE_CONFIG_DIR="./src/config"
NODE_ENV="development"
#NODE_ENV="production"

node ./src/app.js "--NODE_CONFIG_DIR=$NODE_CONFIG_DIR" "--NODE_ENV=$NODE_ENV"
#nodemon ./src/app.js "--NODE_CONFIG_DIR=$NODE_CONFIG_DIR" "--NODE_ENV=$NODE_ENV"
