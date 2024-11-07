'use client';

import React, { ReactNode } from 'react';

import Link from 'next/link';
import clsx from 'clsx';

import { useUIStore } from '@/store';
import { Car, Clock12, FileText, Package, ScanEye, Search } from 'lucide-react';
import { Button } from './button';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ToggleTheme } from './toggleTheme';



export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeMenu = useUIStore(state => state.closeSideMenu);

    const rutasATC = [
        // {
        //     nombre: 'ordenes',
        //     icon: <Search />,
        //     ruta: '/pedido'
        // },
        // {
        //     nombre: 'Boletas',
        //     icon: <FileText />,
        //     ruta: '/comprobante'
        // },
        {
            nombre: 'Transferencias',
            icon: <FileText />,
            ruta: '/transferencias'
        }
    ]

    const rutasServicios = [
        {
            nombre: 'Etiquetas',
            icon: <Package />,
            ruta: '/etiquetas'
        },
        {
            nombre: 'Envios',
            icon: <Car />,
            ruta: '/envio'
        }
    ]

    const sesion = useSession()

    const usuarioInfo = {
        nombre: sesion.data?.user?.name || 'No Conectado',
        image: sesion.data?.user?.image || '/personIcon.png',
    }


    // console.log(usuarioInfo)
    const pathname = usePathname()

    return (
        <div>

            {/* Background black */}
            {
                isSideMenuOpen && (
                    <div
                        className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"
                    />

                )
            }


            {/* Blur */}
            {
                isSideMenuOpen && (
                    <div
                        onClick={closeMenu}
                        className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
                    />

                )
            }

            {/* Sidemenu */}
            <nav
                className={
                    clsx(
                        "fixed p-5 right-0 top-0 w-[400px] h-screen rounded-bl-3xl rounded-tl-3xl z-[25] bg-white dark:bg-black dark:text-white shadow-2xl transform transition-all duration-300",
                        {
                            "translate-x-full": !isSideMenuOpen
                        }
                    )
                }>

                {/* Menú */}

                <div>
                    <div className='flex items-center '>

                        {
                            usuarioInfo.nombre !== 'No Conectado' &&<div className='bg-black text-white rounded-full p-1 w-10 h-10 flex items-center justify-center'>JA</div>
                            // <img className='rounded-lg' src={usuarioInfo.image} width={50} height={50} alt="" />
                        }
                        <div className='flex-grow text-center'>
                            <h2 className='text-base font-bold'>{usuarioInfo.nombre}</h2>
                            <span className='text-xs text-gray-300'>Registrado en sistema ATC</span>
                        </div>
                        <Link onClick={() => closeMenu()} href={usuarioInfo.nombre !== 'No Conectado' ? '/' : '/api/auth/signin'} className='bg-blue-500 p-3 rounded-lg'>
                            {
                                usuarioInfo.nombre !== 'No Conectado' ? <Clock12 className='w-auto h-[15px] text-white ' />
                                    : <ScanEye href='/api/auth/signin' />
                            }

                        </Link>
                    </div>

                    <div className='m-4  bg-gray-100 h-[1px]' />
                </div>

                <div className='flex flex-col gap-3'>
                    <div>
                        <span className='text-xs text-gray-400 my-2'>Atencion al Cliente</span>
                        <div className='flex flex-col gap-8 my-2'>
                            {
                                rutasATC.map(ruta => (
                                    <Link
                                        onClick={() => closeMenu()}
                                        href={ruta.ruta}
                                        key={ruta.ruta}
                                        className={clsx('hover:bg-gray-100 dark:hover:text-black p-4 rounded-xl  transition-all',
                                            {
                                                'text-blue-500 border': pathname === ruta.ruta
                                            }
                                        )}>
                                        <div className='flex flex-wrap gap-3'>
                                            {ruta.icon}
                                            {ruta.nombre}
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                        <div className='m-4  bg-gray-100 h-[1px]' />
                        <span className='text-xs text-gray-400 my-2'>Servicios Externos</span>
                        <div className='flex flex-col gap-8 my-5'>
                            {
                                rutasServicios.map(ruta => (
                                    <Link
                                        onClick={() => closeMenu()}
                                        href={ruta.ruta}
                                        key={ruta.ruta}
                                        className={clsx('hover:bg-gray-100 dark:hover:text-black  p-4 rounded-xl  transition-all',
                                            {
                                                'text-blue-500 border': pathname === ruta.ruta
                                            }
                                        )}>
                                        <div className='flex flex-wrap gap-3'>
                                            {ruta.icon}
                                            {ruta.nombre}
                                        </div>
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