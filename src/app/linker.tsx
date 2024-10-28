'use client'
import { usePathname } from 'next/navigation'
import React from 'react'

import { Box, } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';

interface NavLinks {
    href: string,
    value: string,
    enabled: boolean
}

function Linker({ links }: { links: NavLinks[] }) {


    const pathname = usePathname()

    console.log(pathname)
    return (
        <>
            {links.map(link => (
                <div key={link.value} className={` ${pathname === link.href && 'bg-gray-200'} transition-all flex items-center gap-2  p-2 rounded-lg w-full`}>
                    <Link href={link.href} className='flex gap-2'>
                        <Box size={20} />
                        {link.value}
                    </Link>
                </div>
            ))}
            <div className='flex-1' />
        </>
    )
}

export default Linker