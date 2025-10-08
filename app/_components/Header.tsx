
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../components/ui/button';

const menuOptions = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'Pricing',
        path: '/pricing'
    },
    {
        name: 'Contact',
        path: '/contact'
    }
]
function Header() {
  return (
    <div className='flex justify-between items-center p-4'>
        {/* logo */}
        <div className='flex gap-2 items-center'>
            <Image src="/logo.svg" alt="logo" width={30} height={30} />
            <h2 className='text-2xl font-bold'>AI Trip Planner</h2>
        </div>

        {/* menu option */}
        <div className='flex gap-8 items-center'>
            {menuOptions.map((menu, index) => (
                <Link key={index} href={menu.path}>
                    <h2 className='text-lg hover:scale-105 transition-all hover:text-primary'>{menu.name}</h2>
                </Link>
            ))}
        </div>
        {/* get started button */}
        <Button className='text-lg'>Эхлэх</Button>

    </div>
  )
}

export default Header