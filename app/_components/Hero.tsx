import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Globe, Globe2, Globe2Icon, Landmark, Plane, PlayCircleIcon, Send } from 'lucide-react'
import React from 'react'

const suggestions = [
    {
        title:'Create New Trip',
        icon:<Globe2 className='text-blue-400 h-5 w-5'/>
    },
    {
        title:'Inspire me where to go',
        icon:<Plane className='text-green-400 h-5 w-5'/>
    },
    {
        title:'Discover new places',
        icon:<Landmark className='text-yellow-400 h-5 w-5'/>
    },
    {
        title:'Adventure Destination',
        icon:<Globe2Icon className='text-red-400 h-5 w-5'/>
    }
]

function Hero() {
  return (
    <div className='mt-24 w-full flex justify-center'>
        {/* content */}
        <div className='max-w-3xl w-full text-center space-y-6'>
            <h1 className='text-xl md:text-5xl font-bold '>Би таны хувийн <span className='text-primary'> аялал төлөвлөгч </span> байна </h1>
            <p className='text-lg'>Та хаашаа аялахыг хүсч байгаагаа бичээрэй, би үлдсэнийг нь хийх болно!</p>
            {/* input box */}
            <div>
                <div className='border rounded-2xl p-4 shadow border-primary focus-within:ring-0 focus-within:shadow-none focus-within:outline-none relative'>
                    <Textarea
                      placeholder='Create a trip to China'
                      className='w-full h-28 bg-transparent border-none shadow-none focus:ring-0 focus-visible:ring-0 focus:shadow-none focus-visible:shadow-none resize-none'
                    />
                    <Button size={'icon'} className='absolute bottom-6 right-6'>
                        <Send className='h-4 w-4' />

                    </Button>
                </div>
                
            </div>

            {/* suggestion list */}
            <div className='flex gap-5'>
                {suggestions.map((suggestions, index) => (
                    <div key={index} className='flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-primary/45 transition'>
                        {suggestions.icon}
                        <h2 className='text-xs'>{suggestions.title}</h2>
                    </div>
                ))}
            </div>

            {/* video */}

        </div>
    </div>
  )
}

export default Hero