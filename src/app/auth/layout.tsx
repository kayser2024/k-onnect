import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';


export default async function ShopLayout({ children }: {
  children: React.ReactNode;
}) {


  const session = await auth();

  if (session?.user) {
    redirect('/');
  }



  return (

    <main className="flex justify-center">
      <div className="w-full  px-10 bg-slate-50">

        {children}

      </div>
    </main>
  );
}