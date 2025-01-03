import { auth } from "@/auth.config";
import { Sidebar } from "@/components/ui/Sidebar";
import { TopMenu } from "@/components/ui/topMenu";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";



export default async function Layout({ children }: { children: React.ReactNode }) {

    const session = await auth()

    if (!session)
        redirect('/auth/login')

    return (
        <main >

            <TopMenu />

            <Sidebar />

            <div className="px-0 sm:px-10 max-w-screen-xl mx-auto">
                {children}

            </div>
            
            {/* <Toaster richColors expand={true} /> */}
        </main>
    )
}