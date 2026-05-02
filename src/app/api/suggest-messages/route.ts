// // import OpenAI from 'openai';
// // import { StreamingTextResponse } from 'ai';
// // import { NextResponse } from 'next/server';

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY,
// // });

// // export const runtime = 'edge';

// // export async function POST(req: Request) {
// //   try {
// //     const prompt =
// //       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

// //     const response = await openai.completions.create({
// //       model: 'gpt-3.5-turbo-instruct',
// //       max_tokens: 400,
// //       stream: true,
// //       prompt,
// //     });

// //     const stream = response.toReadableStream();
    
    
// //     return new StreamingTextResponse(stream);
// //   } catch (error) {
// //     if (error instanceof OpenAI.APIError) {
// //       // OpenAI API error handling
// //       const { name, status, headers, message } = error;
// //       return NextResponse.json({ name, status, headers, message }, { status });
// //     } else {
// //       // General error handling
// //       console.error('An unexpected error occurred:', error);
// //       throw error;
// //     }
// //   }
// // }

// import OpenAI from "openai";
// import { streamText,convertToModelMessages } from "ai";
// import { NextResponse } from "next/server";

// //Its difficult to integrate ai in next bcz it reloads on every request
// //so this line--> instead of running on a full Node.js environment, your code runs on a lightweight V8-based runtime deployed close to users (CDN-style).
// export const runtime = "edge";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function POST(req: Request) {
//    // const {messages}=await req.json()
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

// //this creates a live stream of data from openai
// //instead of waiting for full response it sends data one by one
//     const result =  streamText({
//         //result is an object that contains:
// //1.a live token stream
// //2.metadata
// //3.helpers to convert it into HTTP responses

// //result.toDataStreamResponse()  // for Edge API routes
// //result.text --> final full text (after stream ends)
//       model: "gpt-4o-mini",
//       // prompt:prompt,
//     //   messages: [{ role: "user", content: "Generate questions for an anonymous messaging platform." }],
//       // maxTokens: 200,
//        prompt,
//       //  maxTokens: 200,
//       //maxTokens tell how long a response can be ---> 1 token=4 characters
//        //messages: await convertToModelMessages(prompt),
//     });

//    return result.toTextStreamResponse();

//   } catch (error) {
//     if(error instanceof OpenAI.APIError){
//          const {name,status,headers,message}=error;
//          return NextResponse.json({
//             name,status,headers,message},{status})
//          }
//     else{
//     console.error("Error:", error);
//    throw error;
//     }
//   }
// }

import { NextResponse } from "next/server";
export async function POST(req:Request){

  try{
    const prompt= "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    const res=await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({

           contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
          generationConfig: {
        responseMimeType: "text/plain",
        maxOutputTokens: 150,
        temperature: 0.6,
      },
      })
  })

const data=await res.json();

//extract text safwly
const text=data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate suggestions";

return NextResponse.json({success:true,suggestions:text})

}
catch(error:any){
return NextResponse.json({success:false,message:error.message })
}

}