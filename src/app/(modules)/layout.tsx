import { auth } from "@/auth.config";
import { Sidebar } from "@/components/ui/Sidebar";
import { TopMenu } from "@/components/ui/topMenu";
import { redirect } from "next/navigation";



export default async function Layout({ children }: { children: React.ReactNode }) {

    const session = await auth()

    if (!session)
        redirect('/auth/login')

    return (
        <main >

            <TopMenu />
            <Sidebar />

            <div className="px-5 w-full mx-auto">
                {children}
            </div>
        </main>
    )
}