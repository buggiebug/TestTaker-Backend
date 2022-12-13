const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

const connectDatabase = () =>{
    mongoose
    .connect(process.env.MONGODB_URL)
    .then((res)=>{
        console.log(`Database connection established : ${res.connection.host}`)
    });
}

module.exports = connectDatabase;
