'use client';

import Link from 'next/link';

import { useUIStore } from '@/store';
import { Bell, CarTaxiFront, Menu, Search } from 'lucide-react';
import Sign from '@/auth/components/Sign';
import { Button } from './button';
import { ToggleTheme } from './toggleTheme';
import { Badge } from './badge';
import NotificationBell from '../notification';



export const TopMenu = () => {

    const openSideMenu = useUIStore(state => state.openSideMenu);

    return (
        <nav className="flex px-5 justify-between items-center w-full">

            {/* Logo */}
            <div className='hidden sm:block'>
                {/* <ToggleTheme /> */}
            </div>

            {/* Center Menu */}

            <Link href="/">
                <img width={150} height={200} src="/kayser.svg" alt="kayser logo" />
            </Link>


            {/* Search, Cart, Menu */}
            <div className="flex items-center gap-4">

                {/* Más adelante se agregará el componente para un sistema de notificaciones */}
                {/* <NotificationBell /> */}

                <Button
                    onClick={openSideMenu}
                    size={'icon'}
                    className="group m-2 p-2 rounded-full border border-blue-700 bg-white transition-all hover:bg-blue-500">
                    <Menu className='text-blue-600 transition-colors group-hover:text-white' />
                </Button>

            </div>


        </nav>
    );
};