'use client';

import { Mail } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@react-email/components';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { routerServerGlobal } from 'next/dist/server/lib/router-utils/router-server-context';


export default function Home() {
  const router = useRouter();
  return (
  
    <div className="flex flex-col h-screen bg-linear-to-b from-gray-900 to-gray-800 text-white">

      {/* MAIN */}
      <main className="grow flex flex-col items-center px-4 md:px-10 py-16">

        {/* HERO */}
        <section className="text-center max-w-2xl mb-12">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Anonymous Feedback, <br />
            <span className="text-blue-400">Honest Conversations</span>
          </h1>

          <p className="mt-4 text-gray-300 text-base md:text-lg">
            Receive real opinions, honest thoughts, and genuine feedback —
            all while staying anonymous.
          </p>
        </section>

        {/* CAROUSEL */}
        <div className="w-full max-w-2xl relative">
          <Carousel
            plugins={[Autoplay({ delay: 2500 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2">
                  <Card className="bg-gray-900 border text-gray-500 text-xl border-gray-700 shadow-lg hover:shadow-xl transition duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {message.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-400 mt-1" />
                      <p className="text-gray-300 text-sm md:text-base">
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controls */}
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
        <div className=" flex items-center justify-center mt-12 h-25 ">
<Button  className="bg-blue-200 text-black text-3xl font-semibold rounded-full px-6 py-2 hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.7)] hover:scale-105 cursor-pointer transition " onClick={() => router.push('/sign-in')}> Get Started </Button>

  </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-6 bg-gray-800 text-gray-200 text-md">
        © {new Date().getFullYear()} True Feedback. Built with ❤️
      </footer>
    </div>
  
  );
}