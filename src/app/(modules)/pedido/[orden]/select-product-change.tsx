'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { toast } from 'sonner';
import { fetchData } from './fetchProduct';
import Link from 'next/link';

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

interface Option {
    label: string;
    value: string;
    product: Product;
}

interface SelectProductProps {
    setNewProducts: (product: Product[]) => void;
    newProducts: Product[];
}

export const SelectProductChange = ({ setNewProducts, newProducts }: SelectProductProps) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [listProduct, setListProduct] = useState<Product[]>(newProducts);

    // Función para React Select Async
    const promiseOptions = async (inputValue: string): Promise<Option[]> => {
        try {
            return await fetchData(inputValue);
        } catch (error) {
            console.error('Error al cargar las opciones:', error);
            return [];
        }
    };

    // Manejar cambios en la selección
    const handleChange = (newValue: SingleValue<Option>) => {
        setSelectedProduct(newValue?.product || null);
    };

    // Agregar el producto seleccionado a la lista
    const handleAddProduct = () => {
        if (selectedProduct) {
            // Verificar si el producto ya está en la lista
            const alreadyExists = listProduct.some((product) => product.id === selectedProduct.id);

            if (!alreadyExists) {
                const newProduct = { ...selectedProduct, quantity: 1 }; // Asignar cantidad inicial
                const updatedList = [...listProduct, newProduct];

                setListProduct(updatedList); // Actualiza la lista interna
                setNewProducts(updatedList); // Actualiza el estado global
            } else {
                toast.warning("El producto ya está en la lista");
            }
        }

        // Limpiar el select
        setSelectedProduct(null);
    };

    useEffect(() => {
        setListProduct(newProducts); // Esto asegurará que `listProduct` se actualice cuando cambie `newProducts`
    }, [newProducts]);


    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Select para buscar productos */}
            <div className="flex gap-2 w-full">
                <AsyncSelect
                    cacheOptions
                    defaultOptions={false}
                    loadOptions={promiseOptions}
                    placeholder="Buscar Producto..."
                    onChange={handleChange}
                    isClearable
                    className="w-full"
                />
                <Button onClick={handleAddProduct}>Agregar</Button>
            </div>

            {/* Vista previa del producto seleccionado */}
            {selectedProduct ? (
                <div className="flex gap-4 items-start">
                    <Image
                        width={100}
                        height={100}
                        src={selectedProduct.url_foto}
                        alt={selectedProduct.codigoEan}
                        className="h-24 w-auto rounded-lg"
                    />
                    <div className="flex flex-col w-full gap-1">
                        <div className="flex gap-2">
                            <p className="text-xs font-bold">Cód. Padre: </p>
                            <p className="text-xs">{selectedProduct.codigoSap}</p>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-xs font-bold">Código EAN:</p>
                            <p className="text-xs">{selectedProduct.codigoEan}</p>

                        </div>
                        <div className="flex gap-2">
                            <p className="text-xs font-bold">Precio:</p>
                            <div className="flex gap-3">
                                <p className="text-xs line-through text-slate-500">S/ {selectedProduct.price}</p>
                                <p className="text-xs">S/ {selectedProduct.priceSale}</p>
                            </div>

                        </div>
                        <div className="flex gap-2 text-center">
                            <p className="text-xs font-bold">Talla:</p>
                            <p className='text-xs'>{selectedProduct.size}</p>
                        </div>

                        <div className="flex gap-2">
                            <p className="text-xs font-bold">Color:</p>
                            <p className="text-xs">{selectedProduct.color}</p>

                        </div>
                        <div className="flex gap-2">
                            <p className="text-xs font-bold">Stock:</p>
                            <p className="text-xs">{selectedProduct.quantity}</p>

                        </div>
                        <div className="flex gap-2">
                            <Link className="text-sm flex items-center my-2 text-blue-400" target="_blank" href={`https://tutati.com/pe/items-1/detail?uid_items_1=&id_items_1=&eid_items_1=&eid2_items_1=${selectedProduct.codigoEan}&tab=detail&page=1`}>
                                {/* <EyeIcon size={20} /> */}
                                Ver stock en Tutati
                            </Link>

                        </div>

                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Seleccione un producto para ver su vista previa.</p>
            )}

        </div>
    );
};
