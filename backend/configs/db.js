import mongoose, { connect } from "mongoose";

const  connectDB = async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log('Database connected'));
        // console.log(process.env.MONGODB_URI);
        await mongoose.connect(`${process.env.MONGODB_URI}/unlmtdmovies`)
    }catch(error){
        console.log("DBConnection Failed");
    }
}

export default connectDB;