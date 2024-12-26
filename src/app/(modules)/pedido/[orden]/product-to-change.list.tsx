import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

interface Product {
    codigoEan: string;
    codigoSap: string;
    url_foto: string;
    id: string;
    quantity: number
    price: number;
    priceSale: number;
    size: string;
    color: string;
}

interface ProductToChangeProps {
    newProducts: Product[];
    // setNewProducts: (newProducts: Product[]) => void;
    setNewProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    setProdChangeSubtotal: (value: number) => void;
}

export const ProductToChangeList = ({ newProducts, setNewProducts, setProdChangeSubtotal }: ProductToChangeProps) => {
    // Sincroniza la cantidad inicial si falta
    useEffect(() => {
        const updatedProducts = newProducts.map((product) => ({
            ...product,
            quantity: 1, // Asigna 1 si no tiene cantidad
        }));
        setNewProducts(updatedProducts);
    }, []);

    const handleQuantityChange = (id: string, value: number) => {
        setNewProducts((prevProducts: Product[]) =>
            prevProducts.map((product) =>
                product.id === id
                    ? { ...product, quantity: Math.max(1, Math.min(10, (product.quantity || 1) + value)) } // Limita entre 1 y 10
                    : product
            )
        );
    };


    const handleDelete = (id: string) => {
        setNewProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    };

    useEffect(() => {
        const subtotal = newProducts.reduce((sum, product) => sum + (product.priceSale * (product.quantity || 1)), 0);
        setProdChangeSubtotal(subtotal);
    }, [newProducts, setProdChangeSubtotal]);


    return (
        <ScrollArea className="h-[350px]">
            <div className="flex flex-col gap-3">

                {newProducts.map((product) => (
                    <div key={product.id} className="flex gap-2 shadow-md rounded-md  w-full overflow-hidden">
                        <Image
                            width={120}
                            height={120}
                            src={product.url_foto}
                            alt={`imagen-${product.codigoEan}`}
                            className="h-36 w-auto object-cover"
                        />
                        <div className="w-full px-2 flex flex-col justify-between">
                            <div>
                                <div className="text-xs">Cod. Padre: {product.codigoSap}</div>
                                <div className="text-xs">Cod. EAN: {product.codigoEan}</div>
                                <div className="text-xs">Talla: {product.size}</div>
                                <div className="text-xs">Color: {product.color}</div>
                                <div className="text-xs">Precio: S/ {product.priceSale}</div>
                                <Link className="text-sm flex items-center my-2" target="_blank" href={`https://tutati.com/pe/items-1/detail?uid_items_1=&id_items_1=&eid_items_1=&eid2_items_1=${product.codigoEan}&tab=detail&page=1`}>
                                    {/* <EyeIcon size={20} /> */}
                                    Ver stock en Tutati
                                </Link>
                            </div>
                            <div className="flex items-center justify-between gap-2 my-2 w-full">
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
            </div>
        </ScrollArea>
    );
};
