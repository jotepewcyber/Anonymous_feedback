// all providers come here

import { NextAuthOptions } from "next-auth";
//options from nextAuth. Some of which are modified in next-auth.d.ts
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/Usermodel";

export const authOptions: NextAuthOptions = {
  //providers means ways user can login ie. OAuth, Google, Credentials   

  providers: [
    //by credentials login
    CredentialsProvider({
      id: "credentials",
      name: "credentials",

      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      
      //entire code to get user and check it exists or not
      async authorize(credentials:any) {
       
        await dbConnect();
        
        try {
        const user = await UserModel.findOne({$or:[
            {email:credentials.identifier},
            {username:credentials.identifier}
         ]})

         if(!user){
            throw new Error('No user found with the given credentials');
         }

         if(!user.isVerified){
            throw new Error('Please verify your account first before logging in');
         }
        const isPasswordCorrect= await bcrypt.compare(credentials.password, user.password)
        if(isPasswordCorrect){return user;}
        throw new Error('Incorrect password')

          }
         catch (error: any) {
          throw new Error(error.message);
        }
      },


    }),

    //By google OAuth
    GoogleProvider({
clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    //Github OAuth
     GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
      
  callbacks: {

async signIn({user,account}){
if(account?.provider==='google' ||account?.provider==='github'){
  await dbConnect()

let existingUser=await UserModel.findOne({email:user.email});

if(!existingUser){
  existingUser=await UserModel.create({
    email:user.email,
    username: user.name?.replace(/\s+/g, ""),
    isVerified: true,
  password: "",
});
}
//attach DB fields to user
user._id=existingUser._id.toString();
user.isVerified=existingUser.isVerified;
user.username=existingUser.username;
user.isAcceptingMessages=existingUser.isAcceptingMessages;
}
return true;

},


      async jwt({ token, user }) {  
        //this runs at every sign in
        //this user came from if isPasswordCorrect
        
        if(user){
            token._id=user._id?.toString();
            token.isVerified=user.isVerified;
            token.isAcceptingMessages=user.isAcceptingMessages;
            token.username=user.username;
        }
      return token
    },

 async session({ session, token }) {   
  // Session = data sent to frontend
  //this runs whenever session is checked done by useSession()
    //we want to embed more data into token so instead of making db queries we take it directly from token
    
    //This will not be taken as session.user._id
    //bcz this data goes in User type of next auth

    //This session goes to User
    if(token){
        session.user._id=token._id;
        session.user.isVerified=token.isVerified;
        session.user.isAcceptingMessages=token.isAcceptingMessages;
        session.user.username=token.username;
     } return session
    },
   
  },
               
  pages:{
    signIn:'/sign-in'  //Instead of default NextAuth page use your custom page /sign-in 
  },
  session:{
    strategy:'jwt'
  },
  secret:process.env.NEXTAUTH_SECRET,
};
