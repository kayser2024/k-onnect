'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DetallePedido } from '@/types/Orden'
import Image from 'next/image'




export const ProductSelectList = ({ productsSelect }: any) => {

    const [products, setProducts] = useState<{ sku: string, quantity: number }[] | { sku: '', quantity: 0 }[]>(productsSelect.map((product: DetallePedido) => ({
        sku: product.sku,
        quantity: product.quantity_sku,
    })))


    const handleIncrement = (sku: string) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.sku === sku
                    ? { ...product, quantity: product.quantity + 1 }
                    : product
            )
        );
    };


    const handleDecrement = (sku: string) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.sku === sku && product.quantity > 1
                    ? { ...product, quantity: product.quantity - 1 }
                    : product
            )
        );
    };

    console.log({ products }, 'PRODUCTO_______________')
    return (
        <ScrollArea className="h-[350px] w-full ">
            <div className="flex flex-col gap-2">

                {productsSelect.map((producto: DetallePedido) => {
                    const currentProduct = products.find((p) => p.sku === producto.sku);
                    return (
                        <div key={producto.sku} className="flex gap-3 shadow-md rounded-md overflow-hidden">

                            <div>
                                {/* <Image height={100} width={100} className="rounded-lg max-h-32" src={producto.url_imagen_sku} alt="SIN FOTO" /> */}
                                <Image height={100} width={100} src={producto.url_imagen_sku} alt={producto.title} className='h-32 w-auto' />
                            </div>
                            <div>
                                <h3 className="text-xs  text-gray-400">{producto.categoria} / {producto.sub_categoria}</h3>
                                <h2 className="text-normal truncate max-w-[250px]" title={producto.title}>{producto.title}</h2>
                                <p className="text-xs text-gray-400">{producto.sku}</p>
                                <p className="text-xs text-gray-400">{producto.atributo1_titulo}: {producto.atributo1_valor}</p>
                                <p className="text-xs text-gray-400">{producto.atributo2_titulo}: {producto.atributo2_valor}</p>
                                <div className="flex  gap-2 items-center">

                                    <Button className="" onClick={() => handleDecrement(producto.sku)} disabled={currentProduct?.quantity === 1} size="sm">-</Button>
                                    <p className="text-lg">{currentProduct?.quantity}</p>
                                    <Button className="" onClick={() => handleIncrement(producto.sku)} disabled={currentProduct?.quantity === producto.quantity_sku} size="sm">+</Button>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        </ScrollArea>

    )

}

