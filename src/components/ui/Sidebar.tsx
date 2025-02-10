'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useUIStore } from '@/store';
import { BaggageClaim, Box, Building, ClipboardCheck, FileBox, Power, ScanEye, Search, FileWarning, TriangleAlert, Truck, UserCog, Warehouse, FileDown, Store, PackageSearch, FileText } from 'lucide-react';
import { Monitor } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { logout } from '@/actions/auth/logout';
import { FaHeadset } from 'react-icons/fa';
import { ScrollArea } from "@/components/ui/scroll-area";

export const Sidebar = () => {
    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeMenu = useUIStore(state => state.closeSideMenu);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]); // Estado para controlar menús desplegados.

    const rutas = [
        {
            nombre: 'Inicio',
            icon: <Search />,
            ruta: '/',
            roles: [1, 2, 3, 4, 5, 6]
        },
        {
            nombre: 'ATC',
            icon: <FaHeadset size={22} />,
            ruta: '/incidencia',
            roles: [1, 2, 4],
            children: [
                { nombre: "Incidencias", ruta: "/atc/incidencia", icon: <TriangleAlert /> },
                { nombre: "Exportar Data", ruta: "/atc/export_data", icon: <FileDown /> },
            ]
        },
        {
            nombre: 'Preparacion (Web Master)',
            icon: <BaggageClaim />,
            ruta: '/preparacion',
            roles: [1, 2, 3]
        },
        {
            nombre: 'Almacén',
            ruta: '/almacen',
            icon: <Warehouse />,
            roles: [1, 2, 5],
            children: [
                { nombre: "Enviar Orden", ruta: "/almacen/envio_orden", icon: <Truck /> },
                { nombre: "Exportar Data", ruta: "/almacen/export_data", icon: <FileDown /> },
            ]
        },
        {
            nombre: 'Tienda',
            icon: <Store />,
            ruta: '/tienda_orden',
            roles: [1, 2, 6],
            children: [
                {
                    nombre: "Ordenes",
                    ruta: "/tienda/ordenes",
                    icon: <FileBox />,
                    children: [

                        { nombre: 'Recepción Orden', ruta: '/tienda/recepcion', icon: <Box /> },
                        { nombre: 'Entregar Orden', ruta: '/tienda/entrega', icon: <ClipboardCheck /> },
                        { nombre: 'Incidencias', ruta: '/tienda/incidencia', icon: <FileWarning /> },
                    ]
                },
                {
                    nombre: 'Guias',
                    ruta: '/tienda/guia',
                    icon: <FileText />,
                    children: [
                        { nombre: 'Recepción Guía', ruta: '/tienda/guia', icon: <FileText /> },
                        { nombre: 'Lista Guías', ruta: '/tienda/list-guia', icon: <FileText /> },
                    ]
                },
                { nombre: 'Stock', ruta: '/tienda/stock', icon: <PackageSearch /> },
            ]
        },
        {
            nombre: 'Soporte',
            icon: <Monitor />,
            ruta: '/mantenimiento',
            roles: [1, 2],
            children: [
                { nombre: 'Usuarios', ruta: '/mantenimiento/usuarios', icon: <UserCog /> },
                { nombre: 'Tiendas', ruta: '/mantenimiento/tiendas', icon: <Building /> },
                { nombre: 'Orden', ruta: '/mantenimiento/ordenes', icon: <FileBox /> },
            ],
        },
    ];

    const sesion = useSession();
    const userRole = sesion.data?.user.RoleID;
    const usuarioInfo = { nombre: `${sesion.data?.user?.Name} ` || 'No Conectado' };

    // Filtrar rutas según el rol del usuario
    const rutasFiltradas = rutas.filter((ruta) => {
        if (typeof userRole === 'number') {
            return ruta.roles.includes(userRole);
        }
        return false;
    });

    const pathname = usePathname();

    const toggleMenu = (menu: string) => {
        setExpandedMenus((prev) =>
            prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
        );
    };

    // Función recursiva para renderizar menús y submenús
    const renderMenu = (menu: any, level: number = 0) => {
        const hasChildren = menu.children && menu.children.length > 0;

        return (
            <div key={menu.nombre}>
                {hasChildren ? (
                    // Si tiene hijos, se renderiza un contenedor desplegable.
                    <>
                        <div
                            className={clsx(
                                'flex items-center justify-between hover:bg-gray-100 dark:hover:text-black p-4 rounded-xl transition-all',
                                { 'text-blue-500 border': pathname === menu.ruta || expandedMenus.includes(menu.nombre) }
                            )}
                            onClick={() => toggleMenu(menu.nombre)}
                            style={{ paddingLeft: `${level * 20}px` }} // Añadir sangría para subniveles
                        >
                            <div className='flex items-center gap-3'>
                                {menu.icon} {menu.nombre}
                            </div>
                            <span>{expandedMenus.includes(menu.nombre) ? '-' : '+'}</span>
                        </div>
                        {expandedMenus.includes(menu.nombre) && (
                            <div className='ml-6 flex flex-col gap-2'>
                                {menu.children.map((child: any) => renderMenu(child, level + 1))}
                            </div>
                        )}
                    </>
                ) : (
                    // Si no tiene hijos, se renderiza un Link directamente.
                    <Link
                        href={menu.ruta}
                        onClick={closeMenu}
                        className={clsx(
                            'flex items-center gap-3 hover:bg-gray-100 dark:hover:text-black p-4 rounded-xl transition-all',
                            { 'text-blue-500 border': pathname === menu.ruta }
                        )}
                        style={{ paddingLeft: `${level * 20}px` }} // Añadir sangría para subniveles
                    >
                        {menu.icon} {menu.nombre}
                    </Link>
                )}
            </div>
        );
    };

    return (
        <div>
            {/* Background black */}
            {isSideMenuOpen && (<div className="fixed top-0 left-0 w-screen h-screen z-20 bg-black opacity-30" />)}

            {/* Blur */}
            {isSideMenuOpen && (<div onClick={closeMenu} className="fade-in fixed top-0 left-0 w-screen h-screen z-20 backdrop-filter backdrop-blur-sm" />)}

            {/* Sidemenu */}
            <nav className={clsx("fixed p-5 right-0 top-0 w-[400px] h-screen z-[25] bg-white dark:bg-black dark:text-white shadow-2xl transform transition-all duration-300", { "translate-x-full": !isSideMenuOpen })}>
                <ScrollArea className='h-screen'>
                    {/* Menú */}
                    <div className=''>
                        <div className='flex items-center '>
                            {usuarioInfo.nombre !== 'No Conectado' && <div className='bg-black text-white rounded-full p-1 w-10 h-10 flex items-center justify-center'>{usuarioInfo.nombre.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()}</div>}

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

                    <div className='flex flex-col gap-1 my-6'>
                        {rutasFiltradas.map((ruta) => renderMenu(ruta))}
                    </div>
                </ScrollArea>
            </nav>
        </div>
    );
};