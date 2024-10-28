"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useSearchParams } from "next/navigation"


function TablePaginacion() {

    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1
    const pathname = usePathname()

    const handleCreateURL = (page: string | number) => {

        if (Number(page) === 0)
            return

        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())

        return `${pathname}?${params.toString()}`
    }
    const handleInitialPage = () => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1')
        return `${pathname}?${params.toString()}`
    }

    return (

        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={handleCreateURL(currentPage - 1)} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={handleInitialPage()}>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink className="bg-gray-300" href="">{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href={handleCreateURL(currentPage + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default TablePaginacion