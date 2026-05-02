import UserModel from "@/model/Usermodel";
import dbConnect from "@/lib/dbConfig";
import {Message} from "@/model/Usermodel"


export async function POST(req:Request){
    await dbConnect();
    const {username,content}=await req.json()
    try {
        const  user=await UserModel.findOne({username})
        if(!user){
    return Response.json({success:false,message:"User not found"}, {status:404})
}   

//is user accepting messages
if(!user?.isAcceptingMsg){
return Response.json({success:false,message:"User is not accepting messages at the moment"}, {status:403})
} 
const newMessage={content,createdAt:new Date()}

user.message.push(newMessage as Message)
//to ensure content goes as message type 

await user.save()
//Save the changes to the database

return Response.json({success:true,message:"Message sent successfully"}, {status:200})

    }
catch (error) {
    console.log("Error while sending message:", error);
        return Response.json({success:false,message:"An error occurred while sending the message"}, {status:500})
    }
}

//sending message to be stored in DB as an array of messages