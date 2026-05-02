import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/Usermodel";
//import { Toaster } from "./ui/sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


type messageCardProp={
    message:Message;
    onMessageDelete:(messageId:string)=>void;
}
const messageCard=({message,onMessageDelete}:messageCardProp) => {
const router = useRouter();



const handleDeleteConfirm=async ()=>{
   const response=await axios.delete<ApiResponse>(`/api/delete-message/`,{
      data:{messageId:message._id}
   })
   toast.message(response.data.message)
    onMessageDelete(String(message._id) );
}
    return (
   <Card>
  <CardHeader className="relative">
    <CardTitle className="text-2xl font-semibold">{message.content}</CardTitle>

  

    <AlertDialog>
  <AlertDialogTrigger asChild>
   
    <Button variant="destructive"
    size="icon"
    className='absolute top-2 right-2 h-8 w-19 '
    >
     <X className="h-4 w-4" />
     </Button>
 
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => handleDeleteConfirm()}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>



    <CardDescription>{new Date(message.createdAt).toLocaleString()}</CardDescription>
   
  </CardHeader>

</Card>
  )
}

export default messageCard
