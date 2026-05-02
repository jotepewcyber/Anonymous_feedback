import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/Usermodel";
import {getServerSession} from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options";
import {User} from "next-auth";
import mongoose from "mongoose";

export async function GET(req:Request){
    await dbConnect();
    const session=await getServerSession(authOptions)
    const user=session?.user 

    if(!session || !user){
        return Response.json({

            success:false,
            message:"You must be logged in to accept messages"
        },{status:401})
    }
    const userId=new mongoose.Types.ObjectId(user._id)  //bcz User._id is of type string (in auth--nextAuth--options.ts) but in DB its ObjectId



   try {
   //AGGREGATION PIPELINES

   const user=await UserModel.aggregate([
    {$match:{_id:userId}},
    {$unwind:'$message'},
    {$sort:{'message.createdAt':-1}},
    {$group:{_id:'$_id',message:{$push:'$message'}}}
   ])
   //Only 1 object is created having multiple messages

   if(!user ){
    return Response.json({
            success:false,
            message:"User not found"
        },{status:401} )
   }
  
 return Response.json({
            success:true,
            messages:user[0]?.message || []
            //user is an array having 1 object ie. user model with id as userId having multiple messages so just grab all messages
        },{status:201})

   } catch (error) {
     console.error('Unexpected error occured:', error);  
     return Response.json({success:false,message:'An unexpected error occurred while retrieving messages'}, {status:500}) 
   }

}
