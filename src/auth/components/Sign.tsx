"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { User } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

function Sign() {

    const sesion = useSession()

    if (sesion.status === 'loading') {
        return (<Skeleton className="w-[50px] h-15 rounded-full  text-white flex justify-center items-center">
            <User size={30} />
        </Skeleton>)
    }

    if (sesion.status === 'unauthenticated') {
        return <Link href={"api/auth/signin"}>
            <User className="w-[50px] h-15" size={30} />
        </Link>
    }

    console.log(sesion.data);
    if (sesion.status === 'authenticated') {

        return (
            <div className="w-[50px] h-15 ">
                <Image width={50} height={50} className="rounded-full " src={sesion.data.user?.image as string} alt="?" />
            </div>
        )
    }
}

export default Sign