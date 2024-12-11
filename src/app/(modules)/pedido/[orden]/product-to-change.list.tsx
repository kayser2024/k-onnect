import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';

interface Product {
    codigoEan: string;
    codigoSap: string;
    url_foto: string;
    id: number;
    quantity: number;
}

interface ProductToChangeProps {
    newProducts: Product[];
    // setNewProducts: (newProducts: Product[]) => void;
    setNewProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const ProductToChangeList = ({ newProducts, setNewProducts }: ProductToChangeProps) => {
    // Sincroniza la cantidad inicial si falta
    useEffect(() => {
        const updatedProducts = newProducts.map((product) => ({
            ...product,
            quantity: product.quantity || 1, // Asigna 1 si no tiene cantidad
        }));
        setNewProducts(updatedProducts);
    }, []);

    const handleQuantityChange = (id: number, value: number) => {
        setNewProducts((prevProducts: Product[]) =>
            prevProducts.map((product) =>
                product.id === id
                    ? { ...product, quantity: Math.max(1, Math.min(10, (product.quantity || 1) + value)) } // Limita entre 1 y 10
                    : product
            )
        );
    };


    const handleDelete = (id: number) => {
        setNewProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    };

    return (
        <ScrollArea className="h-[350px]">
            {newProducts.map((product) => (
                <div key={product.id} className="flex gap-3 shadow-md rounded-md mb-4 w-full overflow-hidden">
                    <Image
                        width={100}
                        height={100}
                        src={product.url_foto}
                        alt={`imagen-${product.codigoEan}`}
                        className="h-28 w-auto"
                    />
                    <div className="w-full p-4 flex flex-col justify-between">
                        <div>
                            <div className="text-xs">Cod. SAP: {product.codigoSap}</div>
                            <div className="text-xs">Cod. EAN: {product.codigoEan}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-2 w-full">
                            <div className="flex gap-2 items-center">
                                <Button
                                    onClick={() => handleQuantityChange(product.id, -1)}
                                    disabled={product.quantity === 1}
                                    size="sm"
                                >
                                    -
                                </Button>
                                <p>{product.quantity || 1}</p>
                                <Button
                                    onClick={() => handleQuantityChange(product.id, 1)}
                                    disabled={product.quantity === 10}
                                    size="sm"
                                >
                                    +
                                </Button>
                            </div>
                            <Button
                                variant="destructive"
                                title="Eliminar"
                                onClick={() => handleDelete(product.id)}
                                size="sm"
                            >
                                <Trash size={25} />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </ScrollArea>
    );
};
