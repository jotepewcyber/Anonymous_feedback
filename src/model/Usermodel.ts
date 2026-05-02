import mongoose,{Document} from "mongoose";


export interface Message extends Document {
    content:string,
    createdAt:Date
}

//this is of type mongoose.schema and type defined as Message 
const MessageSchema:mongoose.Schema<Message>=new mongoose.Schema(
    {
content:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now,
    required:true
}
    }
)

export interface User extends Document {
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMsg:boolean,
    message:Message[]
}

const UserSchema:mongoose.Schema<User>=new mongoose.Schema(
    {
username:{
    type:String,
    required:[true, "Username is required"],
    isUnique:true,
    trim:true,
    minLength:[3,'username must be at least 3 characters long'],
    maxLength:[30,'username cannot be more than 30 characters long']
    //this can be done by zod also
},
email:{
    type:String,
    required:[true, "Email is required"],
    isUnique:true,
    match:[ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address']

},
password:{
    type:String,
    required:[true,'Password is required'],
    minLength:[6,'Password must be at least 1 characters long']
},
verifyCode:{
    type:String,
    required:[true, "Verification code is required"]
},
verifyCodeExpiry:{
    type:Date,
    default:Date.now,
    required:[true, "Verification code expiry is required"]
},
isVerified:{
    type:Boolean,
    default:false,
},
isAcceptingMsg:{
    type:Boolean,
    default:true
},
message:{
    type:[MessageSchema],
}
    }
)

//it runs on edge ie.does not know if it is being caled first time or ot has been called earlier 
//so we need to check if the model already exists or not
//mongoose.models is an object that contains all already created models. If User model exists then take it else create new model
const UserModel=mongoose.models.User || mongoose.model<User>('User',UserSchema)

export default UserModel;

//it defines how the data will be stored in database.