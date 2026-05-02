import {Message} from '../model/Usermodel';

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessages?:boolean; //this means this fiels is optional
    messages?:Array<Message>

}