import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/Usermodel";

export async function POST(req:Request){
    await dbConnect()

try {
   const {username,code} = await req.json()

   //decode
const decodedUsername=decodeURIComponent(username);
const user=await UserModel.findOne({
    username:decodedUsername
})
if(!user){
 return Response.json({success:false,message:'No user found'},{status:500})
}


const isCodeValid= user.verifyCode === code
const isCodeNotExpired= new Date(user.verifyCodeExpiry) > new Date()

if(isCodeValid && isCodeNotExpired){
user.isVerified=true
await user.save()
return Response.json({success:true,message:'User verified successfully'},{status:200})
}


if(!isCodeValid && isCodeNotExpired){
return Response.json({success:false,message:'Invalid verification code'},{status:400})
}

if(isCodeValid && !isCodeNotExpired){
return Response.json({success:false,message:'Verification Code expired.Signin again !!'},{status:400})
}

} catch (error) {
     console.error('Error verifying user:', error);
        return Response.json({success:false,message:'Error verifying user'},{status:500})
}
}