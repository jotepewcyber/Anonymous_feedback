'use client'
//a folder in (folder_name) is not counted in route path
import React from 'react'
import {useState,useEffect} from 'react'
import { Message } from '@/model/Usermodel'
import {toast} from 'sonner'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptingMsgVerificationSchema } from '@/schemas/acceptMessageSchema'
import { useCallback } from 'react'
import axios from 'axios'
import { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { User } from 'next-auth'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/messageCard'




function userDashboard() {
  const [messages,setMessages]=useState<Message[]>([])
  const [isloading,setisloading]=useState(false)
  const [isSwitchLoading,setisSwitchLoading]=useState(false)
  
  
  const handleDeleteMsg=(messageId:string)=>{
    setMessages(messages.filter((message)=>String(message._id)!==messageId))
  }

  const {data:session}=useSession()

  const form=useForm({
    resolver:zodResolver(acceptingMsgVerificationSchema)
  })

  const {register,watch,setValue}=form

  const acceptMessages=watch('isAcceptingMsg') 

  const fetchAcceptMessages=useCallback(async()=>{
    setisSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`)
      setValue('isAcceptingMsg', response.data.success)
    } catch (error) { 
      const axiosError=error as AxiosError<ApiResponse>
      toast.error('Error',{description:axiosError.response?.data.message || 'Failed to fetch message settings'})
    }
    finally{
      setisSwitchLoading(false)
        }
  },[setValue])

  const fetchMessages=useCallback(async (refresh:boolean=false)=>{
    setisloading(true)
    setisSwitchLoading(false)
    try {
      const response=await axios.get<ApiResponse>(`/api/get-messages`)
      setMessages(response.data.messages || [])

      if(refresh){
        toast.error('Refreshed Messages',{description: 'Showing latest messages'})
      }
    } catch (error) { 
      const axiosError=error as AxiosError<ApiResponse>
      toast.error('Error',{description:axiosError.response?.data.message || 'Failed to fetch message settings'})
    }
     finally{
      setisSwitchLoading(false)
      setisloading(false)
    }
  },[setisloading,setMessages])

  useEffect(()=>{
if(!session || !session.user) return
fetchMessages()
fetchAcceptMessages()
  },[
    session,setValue,fetchAcceptMessages,fetchMessages
  ])


  //handle switch change
const handleSwitchChange=async()=>{
  try {
   const response= await axios.post<ApiResponse>(`/api/accept-messages`,{
      acceptMessages: !acceptMessages
    })
    setValue('isAcceptingMsg',!acceptMessages)
    toast(response.data.message)
  } catch (error) {
    console.log(error)
    toast.error('Error updating message settings')
  }
}


const username=session?.user?.username 
//TODO: DO MORE RESEARCH
const baseUrl=`${window.location.protocol}//${window.location.host}`
const profileUrl=`${baseUrl}/u/${username}`


const coptToClipboard=()=>{
  navigator.clipboard.writeText(profileUrl)
  toast.success('URL copied ',{description:'Profile URL has been copied to clipboard'})
}

if(!session || !session.user){
  return <div>Please login first!!!</div>
}

 return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center ">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 bg-gray-200 rounded"
          />
          <Button onClick={coptToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('isAcceptingMsg')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMsg}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}


export default userDashboard
