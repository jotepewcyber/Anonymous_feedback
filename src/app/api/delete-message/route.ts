// setMessages(messages.filter((message)=>String(message._id)!==messageId))

import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/Usermodel";
import {getServerSession} from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options";
import {User} from "next-auth";


export async function DELETE(req:Request){

await dbConnect();
const session=await getServerSession(authOptions)
const user=session?.user

if(!session || !user){
    return Response.json({
        success:false,
        message:"You must be logged in to delete messages"
    },{status:401})
}

    try{
    const {messageId}=await req.json()
    const userId=user._id
    const userData=await UserModel.findById(userId)

    if(!userData){
        return Response.json({
            success:false,
            message:"User not found"
        },{status:404})
    }
    //filter out the message to be deleted
    userData.message=userData.message.filter((x:any)=>String(x._id)!==messageId)

    await userData.save()
    return Response.json({
        success:true,
        message:"Message deleted successfully"

    })   
 }
    catch(error){
        console.error('Unexpected error occurred:', error);
        return Response.json({success:false,message:'An unexpected error occurred while deleting the message'}, {status:500})
    }

}
   