'use client';

import Link from 'next/link';

import { useUIStore } from '@/store';
import { CarTaxiFront, Menu, Search } from 'lucide-react';
import Sign from '@/auth/components/Sign';
import { Button } from './button';
import { ToggleTheme } from './toggleTheme';



export const TopMenu = () => {

    const openSideMenu = useUIStore(state => state.openSideMenu);

    return (
        <nav className="flex px-5 justify-between items-center w-full">

            {/* Logo */}
            <div className='hidden sm:block'>
                <ToggleTheme />
            </div>

            {/* Center Menu */}

            <Link href="/">
                <img width={150} height={200} src="/kayser.svg" alt="" />
            </Link>


            {/* Search, Cart, Menu */}
            <div className="flex items-center">

                <Button
                    onClick={openSideMenu}
                    size={'icon'}
                    className="m-2 p-2 rounded-md transition-all bg-gray-300">
                    <Menu />
                </Button>

            </div>


        </nav>
    );
};