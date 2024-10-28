'use client'
import Papa from 'papaparse';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { obtenerEtiqueta } from "@/actions/dinet/dinet"
import { EtiquetaDinet } from "@/types/Dinet"
import clsx from "clsx"
import { revalidatePath } from "next/cache"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "sonner"

function EtiquetasPage() {

    const [etiquetas, setEtiquetas] = useState<EtiquetaDinet[]>([])
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState<number>(0)

    const handleForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        if (loading) {
            toast.warning('Ya hay un proceso cargando')
            return
        }

        const { inputBoletas } = Object.fromEntries(new FormData(e.currentTarget))
        if (inputBoletas.toString() === '') {
            toast.warning('Introducir algun valor')
            return
        }

        setLoading(true)
        const boletas = (inputBoletas as string).split('\n').map(boleta => boleta.trim()).filter(boleta => boleta)

        console.log(boletas)
        for (let i = 0; i < boletas.length; i++) {

            const etiqueta = boletas[i].split('\t')
            const data = await obtenerEtiqueta(etiqueta[0])

            if (!data)
                continue
            data.cant_bultos_totales = isNaN(Number(etiqueta[1])) ? 1 : (+etiqueta[1])


            setEtiquetas(prevEtiquetas => [...prevEtiquetas, data])
            const curressProgres = ((i / 1) / boletas.length) * 100
            setProgress(curressProgres)
        }
        setProgress(100)
        console.log(etiquetas)
        setLoading(false)
    }

    const handleBultos = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const copia = [...etiquetas]
        copia[index].cant_bultos_totales = Number(e.target.value)
        setEtiquetas(copia)
    }

    const handleDescargar = () => {
        const csv = Papa.unparse(etiquetas, {
            delimiter: ';'
        })
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob)

        // Crear un enlace para descargar el archivo CSV
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            <div>
                <form onSubmit={handleForm} className="flex flex-col gap-2 justify-center items-center">
                    <Textarea name="inputBoletas" placeholder="BW17-XXXX 1" />
                    <Button type="submit" className={clsx('bg-sky-500 hover:bg-sky-500 w-[15%] my-2 transition-all', {
                        "animate-in": !loading,
                        "animate-pulse ": loading
                    })}>
                        Procesar
                    </Button>
                    <Button type='button' onClick={handleDescargar}>
                        Descargar Salida
                    </Button>
                </form>
            </div>
            <div className="my-5" hidden={progress === 0 || progress === 100}>
                <Progress className="transition-all" value={progress} />
            </div>
            <div>
                {
                    etiquetas.length !== 0 && (
                        <Table>
                            <TableCaption>Listo</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>nro_pedido</TableHead>
                                    <TableHead>nro_doc_referencia</TableHead>
                                    <TableHead>fecha_pedido</TableHead>
                                    <TableHead>fecha_entrega</TableHead>
                                    <TableHead>cliente</TableHead>
                                    <TableHead>dni_cliente</TableHead>
                                    <TableHead>telef_cliente</TableHead>
                                    <TableHead>mail_cliente</TableHead>
                                    <TableHead>dir_entrega</TableHead>
                                    <TableHead>nom_contacto</TableHead>
                                    <TableHead>dni_contacto</TableHead>
                                    <TableHead>Bultos</TableHead>
                                    <TableHead>departamento</TableHead>
                                    <TableHead>provincia</TableHead>
                                    <TableHead>distrito</TableHead>
                                    <TableHead>fecha_estimada_recojo</TableHead>
                                    <TableHead>referencias</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    etiquetas.map((etiqueta, index) => (
                                        <TableRow key={etiqueta.nro_pedido} className="transition-all text-xs ">
                                            <TableCell>{etiqueta.nro_pedido} </TableCell>
                                            <TableCell>{etiqueta.nro_doc_referencia} </TableCell>
                                            <TableCell>{etiqueta.fecha_pedido} </TableCell>
                                            <TableCell>{etiqueta.fecha_entrega} </TableCell>
                                            <TableCell>{etiqueta.cliente} </TableCell>
                                            <TableCell>{etiqueta.dni_cliente} </TableCell>
                                            <TableCell>{etiqueta.telef_cliente} </TableCell>
                                            <TableCell>{etiqueta.mail_cliente} </TableCell>
                                            <TableCell>{etiqueta.dir_entrega} </TableCell>
                                            <TableCell>{etiqueta.nom_contacto} </TableCell>
                                            <TableCell>{etiqueta.dni_contacto} </TableCell>
                                            <TableCell>
                                                <Input value={etiqueta.cant_bultos_totales} onChange={e => handleBultos(e, index)} />
                                            </TableCell>
                                            <TableCell>{etiqueta.departamento} </TableCell>
                                            <TableCell>{etiqueta.provincia} </TableCell>
                                            <TableCell>{etiqueta.distrito} </TableCell>
                                            <TableCell> {etiqueta.fecha_estimada_recojo} </TableCell>
                                            <TableCell>{etiqueta.referencias} </TableCell>
                                        </TableRow>
                                    ))
                                }
                                <TableRow>

                                </TableRow>
                            </TableBody>
                        </Table>
                    )
                }
            </div>
        </>
    )
}

export default EtiquetasPage