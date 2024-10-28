"use client"

import { FormEvent } from "react";
import { Orden } from "@/types/Orden";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface Props {
    orderData: Orden;
}

function OrdenCard({ orderData }: Props) {
    const datosEnvio = orderData.datos_envio[0];
    const datosCabecera = orderData.cabecera_pedido[0]; // Cabecera de pedido
    const detallePedido = orderData.detalle_pedido; // Array de productos
    const datosFacturacion = orderData.datos_facturacion[0]; // Datos de facturacion
    const resumen_pedido = orderData.resumen_pedido[0]; // Resumen de pedido
    const situ_pago = orderData.situacion_pagos[0]; // Resumen de pedido




    const handleSalida = (e: FormEvent<HTMLFormElement>) => {



    }

    return (
        <div className="flex flex-col min-[800px]:grid min-[800px]grid-cols-[repeat(3,1fr)] gap-3  p-2">
            <div className="flex flex-col min-[800px]:grid min-[800px]grid-cols-[repeat(3,1fr)] gap-3 my-5 p-2">
                {/* Card de Facturacion... */}
                <Card className="text-center border-solid">
                    <CardHeader className="pb-0 pt-2 px-3 gap-2 flex-col items-start ">
                        <p className="text-tiny uppercase font-bold my-2">Facturacion</p>


                        <form onSubmit={handleSalida}>
                            <Button type="submit" color="secondary" >Descargar Salida</Button>
                        </form>
                    </CardHeader>

                    <Separator className="my-4" />

                    <CardContent className="py-2 scrollbar">
                        <p className="text-tiny uppercase font-bold">Estado de Pago</p>
                        <small
                            className={`text-default-500 ${situ_pago.estado_pago === "pendiente"
                                ? "text-orange-500"
                                : "text-green-500"
                                } capitalize`}
                        >
                            {situ_pago.estado_pago}
                        </small>

                        <p className="text-tiny uppercase font-bold">Nombre Facturacion</p>
                        <small className="text-default-500">
                            {datosFacturacion.nombres_facturacion}
                        </small>

                        <p className="text-tiny uppercase font-bold">Numero de Orden</p>
                        <small className="text-default-500">
                            {datosCabecera.numero_orden}
                        </small>

                        <p className="text-tiny uppercase font-bold">Tipo Doc</p>
                        <small className="text-default-500">
                            {datosFacturacion.tipo_de_doc}
                        </small>

                        <p className="text-tiny uppercase font-bold">Id Cliente</p>
                        <small className="text-default-500">
                            {datosFacturacion.id_cliente}
                        </small>

                        <p className="text-tiny uppercase font-bold">Email Facturacion</p>
                        <small className="text-default-500">
                            {datosFacturacion.email_facturacion}
                        </small>

                        <p className="text-tiny uppercase font-bold">
                            Telefono Facturacion
                        </p>
                        <small className="text-default-500">
                            {datosFacturacion.telefono_facturacion}
                        </small>

                        <p className="text-tiny uppercase font-bold">Moneda</p>
                        <small className="text-default-500">
                            {datosFacturacion.moneda}
                        </small>

                        <p className="text-tiny uppercase font-bold">Fecha</p>
                        <small className="text-default-700">
                            "DatA SERVER"
                        </small>
                    </CardContent>
                </Card>
                {/* Card de Datos de Envio */}
                <Card className="text-center p-3 border-solid">
                    <CardHeader className="flex flex-col">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1839/1839268.png"
                            width={50}
                            height={50}
                            alt="Icono"
                        />
                        <p>Datos de envio</p>
                    </CardHeader>

                    <CardContent className="scrollbar">
                        <p className="text-tiny uppercase font-bold">Nombre Envio</p>
                        <small className="text-default-500">
                            {datosEnvio.nombres_envio}
                        </small>

                        <p className="text-tiny uppercase font-bold">Direccion</p>
                        <small className="text-default-500">
                            {datosEnvio.direccion_envio}
                        </small>

                        <p className="text-tiny uppercase font-bold">Referencia</p>
                        <small className="text-default-500">
                            {datosEnvio.referencia_envio.length === 0
                                ? "No hay referencia"
                                : datosEnvio.referencia_envio}
                        </small>

                        <p className="text-tiny uppercase font-bold">Telefono Envio</p>
                        <small className="text-default-500">
                            {datosEnvio.telefono_envio}
                        </small>

                        <p className="text-tiny uppercase font-bold">Pais</p>
                        <small className="text-default-500">{datosEnvio.pais}</small>

                        <p className="text-tiny uppercase font-bold">Departamento</p>
                        <small className="text-default-500">
                            {datosEnvio.departamento}
                        </small>

                        <p className="text-tiny uppercase font-bold">provincia</p>
                        <small className="text-default-500">{datosEnvio.provincia}</small>

                        <p className="text-tiny uppercase font-bold">Distrito</p>
                        <small className="text-default-500">{datosEnvio.distrito}</small>

                        <p className="text-tiny uppercase font-bold">Dni Envio</p>
                        <small className="text-default-500">{datosEnvio.dni_envio}</small>

                        <p className="text-tiny uppercase font-bold">Servicio de Envio</p>
                        <small className="text-default-500">
                            {datosEnvio.servicio_envio}
                        </small>

                        <p className="text-tiny uppercase font-bold">Tipo de Envio</p>
                        <small className="text-default-500">{datosEnvio.tipo_envio}</small>



                    </CardContent>
                </Card>
                {/* Card de Costos y Resumen de Pedido */}
                <Card className="text-center p-3 border-solid">
                    <CardHeader className="flex flex-col">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4530/4530555.png"
                            height={50}
                            width={50}
                            alt="icon"
                        />
                        <p>Resumen Pedido</p>
                    </CardHeader>

                    <CardContent className="scrollbar">
                        <p className="text-tiny uppercase font-bold">Cantidad Producto</p>
                        <small className="text-default-500">
                            {detallePedido.length}
                        </small>

                        <p className="text-tiny uppercase font-bold">Cupon</p>
                        <small className="text-default-500">
                            {orderData.cupon ? orderData.cupon : "No hay cupon"}
                        </small>

                        <p className="text-tiny uppercase font-bold">Cantidad Total</p>
                        <small className="text-default-500">
                            {resumen_pedido.quantity}
                        </small>

                        <p className="text-tiny uppercase font-bold">Costo de Envio</p>
                        <small className="text-default-500">
                            {resumen_pedido.costo_envio}
                        </small>

                        <p className="text-tiny uppercase font-bold">Impuesto</p>
                        <small className="text-default-500">
                            {resumen_pedido.impuesto}
                        </small>

                        <p className="text-tiny uppercase font-bold">Descuento</p>
                        <small className="text-default-500">
                            {resumen_pedido.disccount}
                        </small>

                        <p className="text-tiny uppercase font-bold">Subtotal</p>
                        <small className="text-default-500">
                            {resumen_pedido.subtotal}
                        </small>

                        <p className="text-tiny uppercase font-bold">Total</p>
                        <small className="text-default-500">{resumen_pedido.total}</small>

                        <p className="text-tiny uppercase font-bold">TOTAL FINAL</p>
                        <small className="text-default-500">
                            {resumen_pedido.gran_total}
                        </small>

                        <br />
                        <h2 className="text-center">SEGUIMIENTO PEDIDO</h2>
                        <br />
                        <p className="text-tiny uppercase font-bold">Numero de Guia</p>
                        <small className="text-default-500">T123-4567890</small>
                        <p className="text-tiny uppercase font-bold">Empaquetado: </p>
                        <small className="text-default-500">12-05-2024 T 12:20:32 PM</small>
                        <p className="text-tiny uppercase font-bold">Llego a Tienda: </p>
                        <small className="text-default-500">15-05-2024 T 18:50:12 PM</small>
                        <p className="text-tiny uppercase font-bold">Entregado a Cliente: </p>
                        <small className="text-default-500">16-05-2024 T 14:35:26 PM</small>
                    </CardContent>
                </Card>

                {/* Card de listado de Prouctos */}
                <Card className="col-[1_/_span_3] text-start border p-2.5">
                    <CardHeader className="flex flex-col">
                        <p>Productos</p>
                    </CardHeader>

                    <div className="flex gap-5">
                        {detallePedido.map((item) => (
                            <div key={`${item.sku}`} className="flex gap-2">
                                <img
                                    src={item.url_imagen_sku}
                                    className="p-2 w-[250px] rounded-3xl"
                                    alt=""
                                />
                                <div className="flex flex-col  w-[500px] justify-between">
                                    <p className="text-tiny uppercase font-bold">SKU</p>
                                    <div>
                                        <a target="_blank" className="text-default-500" href={`https://tutati.com/pe/items-1/detail?uid_items_1=&id_items_1=&eid_items_1=&eid2_items_1=${item.sku}&tab=detail&page=1&row_count=100`} rel="noreferrer">{item.sku}</a>
                                    </div>
                                    <p className="text-tiny uppercase font-bold">SKU Padre</p>
                                    <small className="text-default-500">
                                        {item.sku_padre ?? "No Identificado"}
                                    </small>

                                    <p className="text-tiny uppercase font-bold">Nombre</p>
                                    <small className="text-default-500">{item.title}</small>

                                    <p className="text-tiny uppercase font-bold">Precio Base</p>
                                    <small className="text-default-500">{item.price}</small>

                                    <p className="text-tiny uppercase font-bold">Precio Sale</p>
                                    <small className="text-default-500">
                                        {item.sale_price.toFixed(2)}
                                    </small>

                                    <p className="text-tiny uppercase font-bold">Categoria</p>
                                    <small className="text-default-500">{item.categoria}</small>

                                    <p className="text-tiny uppercase font-bold">Cantidad</p>
                                    <small className="text-default-500">{item.quantity_sku}</small>
                                    <p className="text-tiny uppercase font-bold">
                                        SubCategoria
                                    </p>
                                    <small className="text-default-500">
                                        {item.sub_categoria}
                                    </small>

                                    <p className="text-tiny uppercase font-bold">
                                        {item.atributo1_titulo}
                                    </p>
                                    <small className="text-default-500">
                                        {item.atributo1_valor}
                                    </small>

                                    <p className="text-tiny uppercase font-bold">
                                        {item.atributo2_titulo}
                                    </p>
                                    <small className="text-default-500">
                                        {item.atributo2_valor}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default OrdenCard;
