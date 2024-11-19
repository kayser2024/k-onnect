'use client';

import React, { ReactNode } from 'react';

import Link from 'next/link';
import clsx from 'clsx';

import { useUIStore } from '@/store';
import { BaggageClaim, Car, FileText, Package, Power, ScanEye, Search, Settings, UserCog } from 'lucide-react';


import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { logout } from '@/actions/auth/logout';



export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeMenu = useUIStore(state => state.closeSideMenu);

    const rutas = [
        {
            nombre: 'Inicio',
            icon: <Search />,
            ruta: '/',
            // roles: ['admin', 'atc', 'web_master', 'almacen', 'soporte']
            roles: [1, 2, 3, 4, 5]
        },
        // {
        //     nombre: 'Transferencias',
        //     icon: <FileText />,
        //     ruta: '/transferencias',
        //     roles: ['admin']
        // },
        // {
        //     nombre: 'Etiquetas',
        //     icon: <Package />,
        //     ruta: '/etiquetas',
        //     roles: ['admin']

        // },
        {
            nombre: 'Cargar Ordenes',
            icon: <BaggageClaim />,
            ruta: '/envio',
            // roles: ['admin', 'web_master', 'almacen', 'soporte']
            roles: [1, 3, 4, 5]

        },
        {
            nombre: 'Mantenimiento',
            icon: <UserCog />,
            ruta: '/mantenimiento_user',
            roles: [1, 6]

        },
        // {
        //     nombre: 'Configuración',
        //     icon: <Settings />,
        //     ruta: '/configuration',
        //     // roles: ['admin', 'soporte', 'atc', 'almacen', 'tienda', 'web_master']
        //     roles: [1, 2, 3, 4, 5, 6]

        // },

    ]

    const sesion = useSession()
    const userRole = sesion.data?.user.rolId;
    console.log(sesion.data?.user.rolId)

    const usuarioInfo = { nombre: sesion.data?.user?.name || 'No Conectado', image: sesion.data?.user?.image || '/personIcon.png' }


    // Filtrar rutas según el rol del usuario
    // const rutasFiltradas = rutas.filter((ruta) => ruta.roles.includes(userRole));//-
    const rutasFiltradas = rutas.filter((ruta) => {
        if (typeof userRole === 'number') {
            return ruta.roles.includes(userRole);
        }
        return false;
    });


    // console.log(usuarioInfo)
    const pathname = usePathname()

    return (
        <div>

            {/* Background black */}
            {isSideMenuOpen && (<div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />)}

            {/* Blur */}
            {isSideMenuOpen && (<div onClick={closeMenu} className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm" />)}

            {/* Sidemenu */}
            <nav
                className={clsx("fixed p-5 right-0 top-0 w-[400px] h-screen rounded-bl-3xl rounded-tl-3xl z-[25] bg-white dark:bg-black dark:text-white shadow-2xl transform transition-all duration-300", { "translate-x-full": !isSideMenuOpen })}>

                {/* Menú */}
                <div>
                    <div className='flex items-center '>

                        {usuarioInfo.nombre !== 'No Conectado' && <div className='bg-black text-white rounded-full p-1 w-10 h-10 flex items-center justify-center'>{usuarioInfo.nombre.slice(0, 2).toUpperCase()}</div>}

                        <div className='flex-grow text-center'>
                            <h2 className='text-base font-bold'>{usuarioInfo.nombre}</h2>
                            <span className='text-xs text-gray-300'>Registrado en sistema ATC</span>
                        </div>
                        <div onClick={() => logout()} className='bg-red-500 p-3 rounded-lg cursor-pointer'>
                            {
                                usuarioInfo.nombre !== 'No Conectado'
                                    ? <Power className='w-auto h-[15px] text-white ' />
                                    : <ScanEye href='/api/auth/signin' />
                            }
                        </div>
                    </div>

                    <div className='m-4  bg-gray-100 h-[1px]' />
                </div>

                <div className='flex flex-col gap-3'>
                    <div>
                        <div className='flex flex-col gap-2 my-2'>
                            {
                                rutasFiltradas.map(ruta => (
                                    <Link
                                        onClick={() => closeMenu()}
                                        href={ruta.ruta}
                                        key={ruta.ruta}
                                        className={clsx('hover:bg-gray-100 dark:hover:text-black p-4 rounded-xl  transition-all', { 'text-blue-500 border': pathname === ruta.ruta })}>
                                        <div className='flex flex-wrap gap-3'>{ruta.icon} {ruta.nombre}</div>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>

                </div>

                <div>

                </div>

            </nav >

        </div >
    );
};