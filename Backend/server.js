const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./db/Database.js");

//Handling uncaught Exceptions
process.on("uncaughtException",(err) => {
    console.log(`error: ${err.message}`);
    console.log('Shutting down server for handling uncaught exection')
})

//config
dotenv.config({
    path: "Backend/config/.env"
})

// connect /call database
connectDatabase();

// create server
const server = app.listen(process.env.PORT, () =>{
    console.log(`Server is working on https://localhost:${process.env.PORT}`);
})



// Unhandled Promise regection

process.on("unhandledRejection", (err) => {
    console.log(`shutting down the server for ${err.message}`);
    console.log(`shutting down the server due to unhandled Promise rejection`);
    server.close(() =>{
        process.exit(1);
    })
});
