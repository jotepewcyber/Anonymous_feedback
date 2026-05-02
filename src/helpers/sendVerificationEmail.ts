import {resend} from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";
import {ApiResponse} from "@/types/ApiResponse";

export async function sendVerificationEmail(
email:string,
username:string,
verifyCode:string
):Promise<ApiResponse>{   //every async returns a promise
    //ApiResponse is given thus all returns will be of type ApiResponse
    try{
        //from documentation resend.com/onboarding
       await resend.emails.send({
  from: 'Anonymous Feedback <noreply@projectallocate.me>',
  to: email,
  subject: 'Verification Code',
  react: VerificationEmail({username,otp:verifyCode}),
});
return {
    success:true,
    message:'verification email sent successfully'
}
}
catch(err){
console.error('Error sending verification email:', err);
return {
    success:false,
    message:'failed to send verification email'
}
}
}