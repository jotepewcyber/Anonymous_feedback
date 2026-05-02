//we do connection here to mongodb using mongoose

import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:Number
}

const connection:ConnectionObject={}
 
    async function dbConnect():Promise<void>{
if(connection.isConnected){
    console.log('Already connected to database');
    return
}
try{
const db=await mongoose.connect(process.env.MONGO_DB_URI!)
//assignment-- console db and db.connections
connection.isConnected=db.connections[0].readyState
console.log('DB connected successfully');
}
catch(error){
    console.error('Error connecting to the database:', error);
    process.exit(1)
}
    }

    export default dbConnect;