'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from "sonner"
import { signupSchema } from '@/schemas/signUpSchema'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js'
import { verifySchema } from '@/schemas/verifySchema'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import {Field,FieldDescription,FieldError,FieldGroup,FieldLabel} from "@/components/ui/field"
function verifyAccount() {
    const router=useRouter()
    const params=useParams<{username:string}>()

    const form=useForm<z.infer<typeof verifySchema>>({
      resolver:zodResolver(verifySchema),
         })

         const onSubmit=async(data:z.infer<typeof verifySchema>)=>{   //the values in data come from Controller name='code' so value sent in that code field by user assigned to data.code 
            try {
              const response= await axios.post('/api/verify-code',{
                    username:params.username,
                    code:data.code
                })

                toast("Success", {
          description: response.data.message,
             })
             router.replace('/sign-in')
            } catch (error) {
                console.log('Error in user verification',error)
                const axiosError=error as AxiosError<ApiResponse>
                let errormsg=axiosError.response?.data.message
                 toast.error("Error in verification!! Signup failed", {
                      description: errormsg,
                    })
              }

         }
  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
     <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
Verify your account
        </h1>
        <p className="mb-4">Please enter the verification code sent to your email.</p>
    </div>


       <form id="verification-form-otp" onSubmit={form.handleSubmit(onSubmit)}>  
        {/* onSubmit is called at time of submit --> till then values in data are assigned.Its equivalent of writing <Input name={field.name} value={field.value}
  onChange={field.onChange}  onBlur={field.onBlur} ref={field.ref} />*/}
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              defaultValue=''
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-code">
                    Verification Code
                  </FieldLabel>
                  <Input
                    {...field}   //CORE LINE --> It connects this i/p to react-hook-form
                    id="form-rhf-input-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your verification code"
                    autoComplete="one-time-code"
                  />
                 
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

            <Button type="submit" >
           Submit
          </Button>
        </form>
      </div>

    </div> 
  )
}

export default verifyAccount
