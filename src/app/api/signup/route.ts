import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import dbconnect from '@/lib/dbConfig';
import UserModel from '@/model/Usermodel';
import bcrypt from 'bcryptjs';


export async function POST(request:Request){
    await dbconnect();
    try {
        const {username,email,password}=await request.json()
        //check if user already exists with email or username and is verified
        const existingUserVerifiedByUsername=await UserModel.findOne({username,isVerified:true})
        if(existingUserVerifiedByUsername){
            return Response.json({success:false,message:'Username already exists'},{status:400})
   }

 const existingUserByEmail=await UserModel.findOne({email})
 const verifyCode=Math.floor(100000+Math.random()*90000).toString();
        if(existingUserByEmail){
      //each user has a property isVerified
      if(existingUserByEmail.isVerified){
        return Response.json({success:false,message:'User already exists with this email'}, {status:400})
   }
   //if email was registered but didnt verify email
   else if(!existingUserByEmail.isVerified){
const hashedPassword=await bcrypt.hash(password,10)  
existingUserByEmail.password=hashedPassword; 
existingUserByEmail.verifyCode=verifyCode;
existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+10*60*1000);
await existingUserByEmail.save();

}
        }
   else{
    //means user is coming first time 
    //then hash password
    const hashedPassword=await bcrypt.hash(password,10)
    //coming first time so verify code expiry
  const expiryDate=new Date(Date.now()+10*60*1000);
  
  const newUser= new UserModel({
          username,
          email,
          password:hashedPassword,
          expiryDate,
          verifyCode:verifyCode,
          verifyCodeExpiry:expiryDate,
          isVerified:false,
            isAcceptingMsg:true,
            message:[]
})

await newUser.save();
   } 

   //send verification email
   const emailResponse=await sendVerificationEmail(email,username,verifyCode)
//resend email send response having fields as .success , .message
   if(!emailResponse.success){
    return Response.json({success:false,message:emailResponse.message},{status:500})
   }
    return Response.json({success:true,message:'User registered successfully. Please verify your email.'},{status:200})
   
        } 
 catch (error) {
     console.error('Error in signup route:', error);  
     return Response.json({success:false,message:'Error registering user'}, {status:500}) 
    }
}
