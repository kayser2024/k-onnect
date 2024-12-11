'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { toast } from 'sonner';

interface Product {
    codigoEan: string;
    codigoSap: string;
    url_foto: string;
    id: number;
    quantity: number;
}

interface Option {
    label: string;
    value: number;
    product: Product;
}

interface SelectProductProps {
    setNewProducts: (product: Product[]) => void;
    newProducts: Product[];
}

export const SelectProductChange = ({ setNewProducts, newProducts }: SelectProductProps) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [listProduct, setListProduct] = useState<Product[]>(newProducts);

    // Función para obtener datos desde la API
    const fetchData = async (search: string): Promise<Option[]> => {
        const res = await fetch(`/api/producto/buscador?buscado=${search}`);
        if (!res.ok) throw new Error('Error al cargar productos');
        const data: Product[] = await res.json();
        return data.map((product) => ({
            label: `${product.codigoEan}`,
            value: product.id,
            product,
        }));
    };

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
                const updatedList = [...listProduct, selectedProduct];
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
                    <div className="flex flex-col">
                        <p className="text-xs font-bold">Código SAP:</p>
                        <p className="text-xs">{selectedProduct.codigoSap}</p>
                        <p className="text-xs font-bold mt-2">Código EAN:</p>
                        <p className="text-xs">{selectedProduct.codigoEan}</p>
                        <Link
                            href={`https://tutati.com/pe/items-1/detail?uid_items_1=&id_items_1=&eid_items_1=&eid2_items_1=${selectedProduct.codigoEan}&tab=detail&page=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs mt-2 inline-flex items-center text-blue-500 hover:underline gap-2"
                        >
                            <ExternalLink size={15} /> Ver stock en Tutati
                        </Link>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Seleccione un producto para ver su vista previa.</p>
            )}

        </div>
    );
};
