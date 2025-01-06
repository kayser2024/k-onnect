'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import clsx from 'clsx';

import { useUIStore } from '@/store';
import { BaggageClaim, Box, Building, ClipboardCheck, FileBox, ListRestart, Power, ScanEye, Search, FileWarning, TriangleAlert, Truck, UserCog } from 'lucide-react';
import { Monitor } from 'lucide-react';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { logout } from '@/actions/auth/logout';



export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeMenu = useUIStore(state => state.closeSideMenu);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null); // Estado para controlar menús desplegados.


    const rutas = [
        {
            nombre: 'Inicio',
            icon: <Search />,
            ruta: '/',
            // roles: ['admin', 'Soporte', 'web_master', 'Atc','Almacen', 'Tienda']
            roles: [1, 2, 3, 4, 5, 6]
        },
        // {
        //     nombre: 'Transferencias',
        //     icon: <FileText />,
        //     ruta: '/transferencias',
        //     roles: ['admin']
        // },
        {
            nombre: 'Incidencias (ATC)',
            icon: <TriangleAlert />,
            ruta: '/incidencia',
            roles: [1, 2, 4]

        },
        {
            nombre: 'Preparacion (Web Master)',
            icon: <BaggageClaim />,
            ruta: '/preparacion',
            roles: [1, 2, 3]

        },
        {
            nombre: 'Enviar Orden (Almacen)',
            icon: <Truck />,
            ruta: '/envio',
            roles: [1, 2, 5]

        },
        {
            nombre: 'Orden (tienda)',
            icon: <Box />,
            ruta: '/tienda_orden',
            roles: [1, 2, 6],
            children: [
                { nombre: 'Recepción Orden', ruta: 'tienda/recepcion', icon: <Box /> },
                { nombre: 'Entregar Orden (Tienda)', ruta: 'tienda/entrega', icon: <ClipboardCheck /> },
                { nombre: 'Incidencias (Tienda)', ruta: '/tienda/incidencia', icon: <FileWarning /> },
            ]


        },
        {
            nombre: 'Entrega Final (tienda)',
            icon: <ClipboardCheck />,
            ruta: '/entrega',
            // roles: ['admin', 'web_master', 'almacen', 'soporte']
            roles: [1, 2, 6]

        },
        {
            nombre: 'Mantenimiento (Soporte)',
            icon: <Monitor />,
            ruta: '/mantenimiento',
            roles: [1, 2],
            children: [
                { nombre: 'Usuarios', ruta: '/mantenimiento/usuarios', icon: <UserCog /> },
                { nombre: 'Tiendas', ruta: '/mantenimiento/tiendas', icon: <Building /> },
                { nombre: 'Orden', ruta: '/reset', icon: <FileBox /> },
            ],

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
    // console.log(sesion.data?.user.rolId)

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


    const toggleMenu = (menu: string) => {
        setExpandedMenu((prev) => (prev === menu ? null : menu));
    };

    return (
        <div>

            {/* Background black */}
            {isSideMenuOpen && (<div className="fixed top-0 left-0 w-screen h-screen z-20 bg-black opacity-30" />)}

            {/* Blur */}
            {isSideMenuOpen && (<div onClick={closeMenu} className="fade-in fixed top-0 left-0 w-screen h-screen z-20 backdrop-filter backdrop-blur-sm" />)}

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

                <div className='flex flex-col gap-1'>
                    {rutasFiltradas.map((ruta) => (
                        <div key={ruta.nombre}>
                            {ruta.children ? (
                                // Si tiene hijos, se renderiza un contenedor desplegable.
                                <>
                                    <div
                                        className={clsx(
                                            'flex items-center justify-between hover:bg-gray-100 dark:hover:text-black p-4 rounded-xl transition-all',
                                            { 'text-blue-500 border': pathname === ruta.ruta || expandedMenu === ruta.nombre }
                                        )}
                                        onClick={() => toggleMenu(ruta.nombre)}
                                    >
                                        <div className='flex items-center gap-3'>
                                            {ruta.icon} {ruta.nombre}
                                        </div>
                                        <span>{expandedMenu === ruta.nombre ? '-' : '+'}</span>
                                    </div>
                                    {expandedMenu === ruta.nombre && (
                                        <div className='ml-6 flex flex-col gap-2'>
                                            {ruta.children.map((child) => (
                                                <Link
                                                    key={child.ruta}
                                                    href={child.ruta}
                                                    onClick={closeMenu}
                                                    className={clsx(
                                                        'flex gap-2 hover:bg-gray-200 dark:hover:text-black p-3 rounded-lg transition-all',
                                                        { 'text-blue-500': pathname === child.ruta }
                                                    )}
                                                >
                                                    {child.icon} {child.nombre}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Si no tiene hijos, renderiza un Link directamente.
                                <Link
                                    href={ruta.ruta}
                                    onClick={closeMenu}
                                    className={clsx(
                                        'flex items-center gap-3 hover:bg-gray-100 dark:hover:text-black p-4 rounded-xl transition-all',
                                        { 'text-blue-500 border': pathname === ruta.ruta }
                                    )}
                                >
                                    {ruta.icon} {ruta.nombre}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>


                <div>

                </div>

            </nav >

        </div >
    );
};