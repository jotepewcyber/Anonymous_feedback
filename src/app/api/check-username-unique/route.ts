import React from 'react'
import dbconnect from '@/lib/dbConfig';
import {z} from 'zod'
import  {usernameValidation} from '@/schemas/signUpSchema';
import UserModel from '@/model/Usermodel';
 

const usernameQuerySchema=z.object({
    username:usernameValidation
})
//username must fulfill usermameValidation criteria

//Instead of API call everytime to check username is available or not 
//check it immediately 


export async function GET(req:Request){

    await dbconnect();
    try {
        const {searchParams}=new URL(req.url)
        //same synatax must be followed for queryParam 
        const queryParam={
            username:searchParams.get('username')
        }

        //Validate with ZOD --> checks if username fulfills usernameValidation criteria
        const result=usernameQuerySchema.safeParse(queryParam)
        //this result has .success , .data , .error
    console.log(result);
    if(!result.success){
        const usernameErrors=result.error.format().username?._errors || []
        return Response.json({
            success:false,
            message:usernameErrors?.length>0 ? usernameErrors.join(', '):'Invalid username'
        },{status:400})
    }

    const {username}=result.data

    const existingVerifieduser= await UserModel.findOne({
        username,
        isVerified:true
    })

    if(existingVerifieduser){
        return Response.json({
            success:false,
            message:'Username is already taken'
        },{status:400})
    }
console.log('Username is available')
    return Response.json({
            success:true,
            message:'Username is available'
           
        },{status:200})

 } catch (error) {
        console.error('Error checking username uniqueness:', error);
        return Response.json({success:false,message:'Error checking username uniqueness'},{status:500})
    }
}