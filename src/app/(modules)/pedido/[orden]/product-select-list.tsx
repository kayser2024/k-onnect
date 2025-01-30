'use client'

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DetallePedido } from '@/types/Orden'
import Image from 'next/image'

interface ProductsSelect {
    sku: string,
    quantity: number,
    price: number
    imageURL?: string
}

interface ProductsSelectListProps {
    productsSelect: any,
    setProductsSelect: Dispatch<SetStateAction<ProductsSelect[]>>;
    setProdOriginSubtotal: (value: number) => void;
}



export const ProductSelectList = ({ productsSelect, setProductsSelect, setProdOriginSubtotal }: ProductsSelectListProps) => {
    console.log(productsSelect)

    const initSelect = productsSelect.map((product: DetallePedido) => ({ sku: product.sku, quantity: product.quantity_sku, price: product.sale_price, imageURL: product.url_imagen_sku }))

    // Sincronizamos el estado local con el estado del padre
    const [products, setProducts] = useState<ProductsSelect[]>(initSelect);

    const handleQuantityChange = (sku: string, increment: number) => {
        // Actualizamos la cantidad en el estado local del componente
        const updatedProducts = products.map((product) =>
            product.sku === sku
                ? { ...product, quantity: Math.max(1, Math.min(10, product.quantity + increment)), price: product.price }
                : product
        );
        setProducts(updatedProducts); // Actualizamos el estado local

        // Actualizamos la cantidad en el estado del padre
        setProductsSelect(updatedProducts); // Actualizamos el estado del padre
    }


    useEffect(() => {
        setProductsSelect(products)
    }, [])

    useEffect(() => {
        const subtotal = products.reduce((acc, product) => acc + product.quantity * product.price, 0);
        setProdOriginSubtotal(subtotal); // Actualizar el subtotal en el estado del padre
    }, [products, setProdOriginSubtotal]);


    return (
        <ScrollArea className="h-[220px] md:h-[350px] w-full ">
            <div className="flex flex-col gap-2">

                {productsSelect.map((producto: DetallePedido) => {
                    const currentProduct = products.find((p) => p.sku === producto.sku);
                    return (
                        <div key={producto.sku} className="flex gap-3 shadow-md rounded-md overflow-hidden">

                            <div>
                                {/* <Image height={100} width={100} className="rounded-lg max-h-32" src={producto.url_imagen_sku} alt="SIN FOTO" /> */}
                                <Image height={120} width={120} src={producto.url_imagen_sku} alt={producto.title} className='h-36 w-auto object-cover' />
                            </div>
                            <div>
                                <h3 className="text-xs  text-gray-400">{producto.categoria} / {producto.sub_categoria}</h3>
                                <h2 className="text-sm truncate w-[130px] md:max-w-[250px]" title={producto.title}>{producto.title}</h2>
                                <p className="text-xs text-gray-400">{producto.sku}</p>
                                <p className="text-xs text-gray-400">Talla: {producto.atributo1_valor}</p>
                                <p className="text-xs text-gray-400">Color: {producto.atributo2_valor}</p>
                                <p className="text-xs text-gray-400">Precio:S/ {producto.sale_price.toFixed(2)}</p>

                                <div className="flex  gap-2 items-center">

                                    <Button className="" onClick={() => handleQuantityChange(producto.sku, -1)} disabled={currentProduct?.quantity === 1} size="sm">-</Button>
                                    <p className="text-lg">{currentProduct?.quantity}</p>
                                    <Button className="" onClick={() => handleQuantityChange(producto.sku, +1)} disabled={currentProduct?.quantity === producto.quantity_sku} size="sm">+</Button>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        </ScrollArea>
    )
}