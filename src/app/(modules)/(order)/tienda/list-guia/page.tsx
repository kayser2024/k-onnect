import React from 'react'
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { Metadata } from "next";
import { DataTable } from './data-table';
import { Container } from './container';


export const metadata: Metadata = {
  title: 'Kayser | Listado de guias',
  icons: '/kayser.ico'
}
const ListGuiaPage = async () => {

  const user = await auth()
  const role = user!.user.RoleID;

  const rolePermission = [1, 2, 6, 7]//admin,soporte,tienda,supervisor

  const isPermited = rolePermission.includes(role)
  if (!user) redirect('/api/auth/signin')
  if (!isPermited) redirect('/')

  return (
    <div>

      <Container />

    </div>
  )
}

export default ListGuiaPage