import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/Usermodel";
import {getServerSession} from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options";
import {User} from "next-auth";

export async function POST(req:Request){
    await dbConnect();
    const session=await getServerSession(authOptions)
    const user=session?.user 

    if(!session || !user){     
        return Response.json({  

            success:false,
            message:"You must be logged in to accept messages",
          
        },{status:401})
    }
    const userId=user._id

   const {acceptMessages} = await req.json()

   try {
   const updatedUser = await UserModel.findByIdAndUpdate(userId,
       { isAcceptingMsg:acceptMessages },
       {new:true}
       //{new:true} --> to return the updated document no need to save again
    )

    if(!updatedUser){
    return Response.json({success:false,message:'failed to update user status to accept messages'}, {status:401})
    }
   return Response.json({
    success:true,
    message:`Successfully updated user status to ${acceptMessages ? 'accept' : 'deny'} messages`,
    updatedUser
},
 {status:200}
) 

   } catch (error) {
     console.error('Failed to update user status to accept messages:', error);  
     return Response.json({success:false,message:'Failed to update user status to accept messages'}, {status:500}) 
   }
}


//This function is just to tell user whether he is accepting messages or not
//SEE LINE 71
export async function GET(req:Request){
     await dbConnect();
    const session=await getServerSession(authOptions)
    const user=session?.user 

    if(!session || !user){
        return Response.json({  

            success:false,
            message:"You must be logged in to accept messages",
          
        },{status:401})
    }
    const userId=user._id
  try {
     const foundUser = await UserModel.findById(userId)
  
     if(!foundUser){
  return Response.json({success:false,message:'failed to find user'}, {status:401})
      }
     return Response.json({
      success:true,
      isAcceptingMsg:foundUser.isAcceptingMsg
   },
   {status:200}
  ) 
  } catch (error) {
     console.error('Error in getting message acceptance status', error);  
     return Response.json({success:false,message:'Error in getting message acceptance status'}, {status:500}) 
    
  }



}