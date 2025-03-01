require("dotenv").config();
// const mongoose = require("mongoose");

// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000,
//   autoIndex: false, 
//   maxPoolSize: 10, 
//   serverSelectionTimeoutMS: 5000, 
//   socketTimeoutMS: 45000, 
//   family: 4 
// }

// const connectDB = async () => {
//   try {
//     await mongoose.connect(global.dbURI, options).catch(err => {
//       if (err){
//          console.error(err);
//          connectDB()
//       } else {
//         console.log("database connection")
//       }
//     })
//   } catch (err) {
//     console.log("mongodb connection failed!", err.message);
//   }
// };

// module.exports = {
//   connectDB,
// };


const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const connectDB = async () => {
    await mongoose.connect(global.dbURI, { useNewURLParser: true, useUnifiedTopology:true }).then((con) => {
        console.log(`Database is connected to the host : ${con.connection.host}`)
    }).catch((err) => {
        console.log(err)
    })
}

module.exports = {
  connectDB,
};
