import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function TableComprobanteSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead><Skeleton className="h-[25px] w-[350px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[350px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[350px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[350px] rounded-xl" /></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    Array(10).fill(1).map((_, index) => (
                        <TableRow key={index}>
                            <TableHead><Skeleton className="h-[25px] w-[350px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[350px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[350px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[350px] rounded-xl" /></TableHead>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

export default TableComprobanteSkeleton