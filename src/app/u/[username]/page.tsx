'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { toast } from "sonner"
import { set } from 'mongoose';

function Page() {
 
  const params = useParams();
  const username=params.username
 const [message,setMessage]=React.useState('')
 const [lengthError,setLengthError]=React.useState('')
 const [suggestedMessages,setSuggestedMessages]=React.useState<string[]>([])
const [options,setOptions]=React.useState<string[]>([
  "What's your favorite movie?",
  "Do you have any pets?",
  "What's your dream travel destination?",
  "What's your favorite food?",
])

let basicOptions=[
  "What's your favorite movie? ",
  "Do you have any pets?",
  "What's your dream travel destination?",
  "What's your favorite food?",
]
let i=0;
let manualMsg=true
async function copyToClipboard(text:string){
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Text copied to clipboard!')
  } catch (error) {
    toast.error('Failed to copy text. Please try again.')
  }
}




 async function check(message:string){
  if(message.length<10){
   setLengthError('Content must be at least 10 characters.');
   return;
  }
  else{
    try {
      const response=await fetch('/api/send-message',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({username,content:message})
      })
      const data=await response.json()
      if(data.success){
        toast.success('Message sent successfully!')
        setMessage('')
        setLengthError('')
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error while sending message:', error)
      toast.error('An error occurred while sending the message. Please try again later.')
    }
  }
}

async function fetchMessages(){
  try {
    const response=await fetch(`/api/suggest-messages?username=${username}`)
    const data=await response.json()

    if(data.success && data.message!=="Failed to generate suggestions"){
      console.log('Suggested Messages:', data.message)
      const msgs=data.message as string
      const splittedMessages=data.message.split("||").map((msg: string) => msg.trim()).filter(Boolean);
      setOptions(splittedMessages)
 
    }
    else{
      toast.error(data.message)
      setOptions(basicOptions) 
     
    }
  } catch (error) {
    console.error('Error while fetching messages:', error)
    toast.error('An error occurred while fetching messages. Please try again later.')
    setOptions(basicOptions)
    
  }
}


  return (
    <div>
       <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      
      {/* Title */}
      <h1 className="text-4xl font-bold mb-6">Public Profile Link</h1>

      {/* Input Section */}
      <div className="w-full max-w-2xl">
        <p className="text-black font-semibold mb-2">
          Send Anonymous Message to { username }
        </p>

        <textarea
          placeholder="Type your anonymous message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-400 rounded-lg p-4 h-28 outline-none focus:ring-2 focus:ring-blue-400"
        />

      {lengthError && (
          <p className="text-red-500 text-sm mt-1">
            {lengthError}
          </p>
        )}

        {/* Button */}
        <div className="flex justify-center mt-4">
          <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700" onClick={()=>{
            check(message)
          }}>
            Send it
          </button>
        </div>
      </div>

  

      {/* Suggest Messages */}
      <div className="w-full max-w-2xl mt-10">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md mb-4" onClick={()=>fetchMessages()}>
          Suggest Messages
        </button>

        <p className="mb-3 text-gray-700">
          Click on any message below to select it.
        </p>
</div>
       
        <div className="bg-white   rounded-lg shadow p-4 space-y-3">





          { options.map((option,index)=>(
            <div key={index} className="border p-3 rounded-md cursor-pointer hover:bg-gray-100" onClick={() => copyToClipboard(option)}>
              {option}
            </div>
          ))}


        </div>  
    </div>
    </div>
  )
}


export default Page

  {/* //click on this to slect */}
  //ai integrate
  //oauth