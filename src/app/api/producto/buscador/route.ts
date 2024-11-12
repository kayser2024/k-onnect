import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const buscado = req.nextUrl.searchParams.get('buscado') as string

    console.log('Buscado : ', buscado)

    // TODO: Consumir una api
    const posibleProducto = await prisma.oSF_Product.findMany({
        take: 5,
        where: {
            OR: [
                {
                    codigoSap: {
                        contains: buscado,
                    }
                },
                {
                    codigoEan: {
                        contains: buscado
                    }
                }
            ]
        },
    })

    console.log('producto', posibleProducto)

    return NextResponse.json(posibleProducto)

}