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
import {signInVerificationSchema} from "@/schemas/signinSchema"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Field, FieldDescription, FieldError, FieldLabel,FieldGroup } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import email from "next-auth/providers/email"
import { signIn } from "next-auth/react"
export default function page(){
 
  const [isSubmitting,setisSubmitting]=useState(false)
 
const router=useRouter()

//zod implementation
const form=useForm<z.infer<typeof signInVerificationSchema>>({
  resolver:zodResolver(signInVerificationSchema),
  defaultValues:{
    identifier:'',
    password:'',
    
  }
})

const onSubmit=async(data:z.infer<typeof signInVerificationSchema>)=>{
  //using by nextAuth signIn function
const result= await signIn('credentials',{
    identifier:data.identifier,
    password:data.password,
     redirect:false
  })
  if(result?.error){
    toast.warning('Invalid email or password',{
      description:'Please check your credentials and try again'
    })
  }
if(result?.url){
  toast.success('Login successful',{
       description:'You have successfully logged in'
      })
  router.replace('/dashboard')
}
  // else{
  //   toast.success('Login successful',{
  //     description:'You have successfully logged in'
  //   })
  //   router.push('/')
  // }
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
  name="identifier"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Email or Username</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      
    </Field>
  )}
 />
           
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

</FieldGroup>

<Button type='submit' >
 Submit
  </Button>
</form>
<div className="text-center mt-4">
  <p>
    Already a member?{' '}
    <Link href='/sign-up' className="text-blue-500 hover:underline hover:text-blue-900">
      Register your account
    </Link>
  </p>

</div>
    </div>
  </div>
 )
}




