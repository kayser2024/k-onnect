import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface Product {
    codigoEan: string;
    codigoSap: string;
    url_foto: string;
    id: number;
}

interface ProductToChangeProps {
    newProducts: Product[];
    setNewProducts: (newProducts: Product[]) => void;
}

export const ProductToChangeList = ({ newProducts, setNewProducts }: ProductToChangeProps) => {
    // Estado para manejar los incrementos por producto
    const [increments, setIncrements] = useState<{ [id: number]: number }>(
        newProducts.reduce((acc, product) => {
            acc[product.id] = 1; // Inicializamos cada producto con cantidad 1
            return acc;
        }, {} as { [id: number]: number })
    );

    // Función para manejar el incremento
    const handleIncrement = (id: number, value: number) => {
        setIncrements((prev) => ({
            ...prev,
            [id]: Math.max(1, Math.min(10, (prev[id] || 1) + value)), // Rango entre 1 y 10
        }));
    };



    console.log({ increments }, '👀 Cantidades por producto 👀');

    const handleDelete = (id: number) => {
        console.log({ id }, "ELIMINAR")
        const updatedProducts = newProducts.filter((product) => product.id !== id);
        setNewProducts(updatedProducts);

    }


    console.log({ newProducts }, 'PRODUCTOS----')
    return (
        <ScrollArea className="h-[350px]">
            {newProducts.map((product) => (
                <div key={product.id} className="flex gap-3 shadow-md rounded-md mb-4 w-full overflow-hidden">
                    <Image
                        width={100}
                        height={100}
                        src={product.url_foto}
                        alt={`imagen-${product.codigoEan}`}
                        className='h-28 w-auto '
                    />
                    <div className='w-full p-4 flex flex-col justify-items-end justify-between'>
                        <div className="">

                            <div className="text-xs">Cod. SAP: {product.codigoSap}</div>
                            <div className="text-xs">Cod. EAN: {product.codigoEan}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-2 w-full ">
                            <div className="flex gap-2 items-center">
                                <Button
                                    onClick={() => handleIncrement(product.id, -1)}
                                    disabled={increments[product.id] === 1}
                                    size="sm"
                                >
                                    -
                                </Button>
                                <p>{increments[product.id] || 1}</p>
                                <Button
                                    onClick={() => handleIncrement(product.id, 1)}
                                    disabled={increments[product.id] === 10}
                                    size='sm'
                                >
                                    +
                                </Button>
                            </div>
                            <Button variant="destructive" title="Eliminar" onClick={() => handleDelete(product.id)} size="sm">
                                <Trash size={25} />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </ScrollArea>
    );
};
