"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"

interface Texto {
    texto: string
    className?: string
}


function AccionCopiar({ texto, className }: Texto) {

    const handleCopy = () => {
        navigator.clipboard.writeText(texto)
        toast.success(`Texto copiado correctamente`)
    }
    return (
        <div className="flex gap-2">
            <Copy className="cursor-pointer" onClick={handleCopy} size={20} />
            <p className={className}>{texto}</p>
        </div>
    )
}

export default AccionCopiar