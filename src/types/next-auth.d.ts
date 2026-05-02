
//we modify existing data types here for next auth pre declared modules/data types

import 'next-auth'
import {DefaultSession} from 'next-auth'
declare module 'next-auth'{
    interface User{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }

    interface Session{
        user:{
            _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string
        } & DefaultSession['user']  //this means user property will be merged with default session 
    }
}


declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string
    }
}