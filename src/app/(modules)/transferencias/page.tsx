"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import clsx from "clsx"
import { Minus, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"


interface Salida {
    ean: string,
    cantidad: number
}

function TransferenciaPage() {

    const sesion = useSession()

    const [nombreSalida, setNombreSalida] = useState<String>("NombreDeSalida")
    const [codigos, setCodigo] = useState<Salida[]>([])


    if (sesion.status === 'loading') {
        return <p>Cargando...</p>
    }
    if (sesion.status === 'unauthenticated') {
        redirect('/api/auth/signin')

    }

    const handleCodigos = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget))
        const codigosForm = data.codigos

        const totalCodigos = (codigosForm as string).split('\n').map(codigo => codigo.trim()).filter(codigo => codigo)

        if (totalCodigos.length === 0) {
            toast.error('Ingresa al menos un codigo')
            return
        }

        const copiaSalidas = [...codigos]

        totalCodigos.forEach(codigo => copiaSalidas.push({
            cantidad: 1,
            ean: codigo
        }))
        setCodigo(copiaSalidas)
    }


    const handleTransferir = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (codigos.length === 0) {
            toast.success('No hay codigos para transferir')
            return
        }
        if (nombreSalida === '') {
            toast.error('Ingresa un nombre para la salida')
            return
        }

        let cadenaCSV = 'Origen,CodProducto,Cantidad,Destino,CodigoTransaccion,Tipo,attr\n'

        codigos.forEach(codigo => {
            cadenaCSV += `K033,${codigo.ean},${codigo.cantidad},K001,${nombreSalida},Venta Externa,1\n`
        })

        //Descargar archivo
        const element = document.createElement('a');
        const file = new Blob([cadenaCSV], { type: 'text/csv' });
        element.href = URL.createObjectURL(file);
        element.download = `${nombreSalida}.csv`;
        element.click();
        element.remove();

    }

    const setCantidad = (index: number, num: number) => {

        const copiaSalidas = [...codigos]

        if (copiaSalidas[index].cantidad + num > 0) {
            copiaSalidas[index].cantidad += num
            console.log('Aumentado')
            setCodigo(copiaSalidas)
        }
    }

    return (
        <>
            <form onSubmit={handleCodigos} className="flex flex-col items-center justify-center gap-3 p-3">
                <Textarea name="codigos" placeholder="7709842842" />
                <div className="flex flex-wrap gap-2" >
                    <Button type="submit">Agregar</Button>
                    <Button type="button" className={clsx('transition-all', {
                        'text-gray-500 bg-gray-300': codigos.length === 0,
                        'text-white bg-red-500 hover:bg-red-600': codigos.length > 0,
                    })} onClick={() => setCodigo([])}>Limpiar Tabla</Button>
                </div>
            </form>

            <Table id="tablaTransferencia">
                <TableHeader>
                    <TableRow>
                        <TableHead>Origen</TableHead>
                        <TableHead>Codigo Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Codigo Transferencia</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Attr</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        codigos.map((codigo, index) => (
                            <TableRow key={codigo.ean + index}>

                                <TableCell>K033</TableCell>
                                <TableCell>{codigo.ean}</TableCell>
                                <TableCell className="flex gap-2 items-center">
                                    <Button className="bg-gray-300 rounded-full text-white" onClick={() => setCantidad(index, -1)} >
                                        <Minus size={10} className="font-bold" />
                                    </Button>
                                    <p className="">{codigo.cantidad}</p>
                                    <Button className="bg-gray-300 rounded-full  text-white" onClick={() => setCantidad(index, 1)}>
                                        <Plus size={10} />
                                    </Button>
                                </TableCell>
                                <TableCell>K001</TableCell>
                                <TableCell>{nombreSalida}</TableCell>
                                <TableCell>Venta Externa</TableCell>
                                <TableCell>1</TableCell>

                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <form onSubmit={handleTransferir} className="flex flex-col  justify-center items-center gap-3 ">
                <h2 className="text-xl text-gray-500">Exportar Salida</h2>
                <Input type="text" maxLength={50} name="nombreArchivo" placeholder="Destino" value={(nombreSalida as string)} onChange={(e) => setNombreSalida(e.target.value)} className="w-2/5" />
                <Button type="submit" className={clsx('',
                    {
                        'bg-gray-300 text-gray-500': codigos.length === 0,
                        'bg-blue-500 text-white hover:bg-blue-600': codigos.length > 0
                    }
                )}>Crear Salida</Button>
            </form >
        </>
    )
}

export default TransferenciaPage