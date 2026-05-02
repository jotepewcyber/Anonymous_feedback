//taken from documentation
'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm,SubmitHandler,Controller } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import {useState,useEffect} from 'react'
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {signupSchema} from "@/schemas/signUpSchema"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Field, FieldDescription, FieldError, FieldLabel,FieldGroup } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
export default function page(){
  const [username,setUsername]=useState('')
  const [usernameMsg,setUsernameMsg]=useState('')
  const [isCheckingUsername,setIsCheckingUsername]=useState(false)
  const [isSubmitting,setisSubmitting]=useState(false)
  const debouncedUsername = useDebounce(username, 300);  //apply on username and wait for 300ms after user stops typing
//V. GOOD -->optimization technique to avoid making API calls on every keystroke

const router=useRouter()

//zod implementation
const form=useForm({
  resolver:zodResolver(signupSchema),
  defaultValues:{
    username:'',
    email:'',
    password:''
  }
})

 useEffect(()=>{
const checkUsernameUnique=async()=>{
  if(debouncedUsername){
    setIsCheckingUsername(true)
    setUsernameMsg('')  //remove if last time some errors were set
    try{
     const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
    setIsCheckingUsername(false)
    setUsernameMsg(response.data.message)
     return response.data.message


    }
    catch(error){
      const axiosError=error as AxiosError<ApiResponse>
      setUsernameMsg(axiosError.response?.data.message || 'Error checking username')
      setIsCheckingUsername(false)

    }
  }
}
checkUsernameUnique() 
 },[debouncedUsername])   

 const onSubmit=async(data:z.infer<typeof signupSchema>)=>{
  setIsCheckingUsername(true)
  try {
    const response=await  axios.post('/api/signup',data)
   toast("Success", {
          description: response.data.message,
        })
      router.replace(`/verify/${username}`)
      setisSubmitting(false) 
  } catch (error) {
    console.log('Error in signup of user',error)
    const axiosError=error as AxiosError<ApiResponse>
    let errormsg=axiosError.response?.data.message
     toast.error("Error in Signup", {
          description: errormsg,
        })
  }

 }


 return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join mystery message
        </h1>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
 <FieldGroup>


    <Controller
  name="username"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
      <Input {...field} 
       onChange={(e)=>{
                        field.onChange(e)
                        setUsername(e.target.value)
                      }}
        id={field.name} aria-invalid={fieldState.invalid} />
         {isCheckingUsername && <Loader2 className="animate-spin" />}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
       {!isCheckingUsername && usernameMsg && (
                    <p
                      className={`text-sm ${
                        usernameMsg === 'Username is available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                     {usernameMsg}
                    </p>
                  )}
    </Field>
  )}
/>

            

    <Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      
    </Field>
  )}
 />
    {/*
              <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>
                  <InputGroup>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                    //   rows={1}
                     // className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                 
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>

              )}
              ></Controller> */}

         
    <Controller
  name="password"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>     
{/* 

                 <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <Input 
                      {...field}
                    
                      id="password"
                      placeholder="Enter your password"
                     // rows={1}
                    //   className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                 
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>

              )}
              ></Controller> */}
</FieldGroup>

<Button type='submit' disabled={isSubmitting} >
  {
    isSubmitting ? (<Loader2 className="mr-2 h-4 w-4 animate-spin">Please wait...</Loader2>):'Signup'
  }
  </Button>
</form>
<div className="text-center mt-4">
  <p>
    Already a member?{' '}
    <Link href='/sign-in' className="text-blue-500 hover:underline hover:text-blue-900">
      Sign in
    </Link>
  </p>

</div>
    </div>
  </div>
 )
}




