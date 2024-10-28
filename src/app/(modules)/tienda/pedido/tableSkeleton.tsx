import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function TableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead><Skeleton className="h-[25px] w-[170px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[170px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[100px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[100px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[170px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[80px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[80px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[100px] rounded-xl" /></TableHead>
                    <TableHead><Skeleton className="h-[25px] w-[80px] rounded-xl" /></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    Array(25).fill(1).map((_, index) => (
                        <TableRow key={index}>
                            <TableHead><Skeleton className="h-[25px] w-[170px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[170px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[100px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[100px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[170px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[80px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[80px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[100px] rounded-xl" /></TableHead>
                            <TableHead><Skeleton className="h-[25px] w-[80px] rounded-xl" /></TableHead>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

export default TableSkeleton