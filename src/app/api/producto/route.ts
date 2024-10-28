import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    console.log('======= API PRODUCTO =======');
    const { data }: { data: string[] } = await req.json()

    console.log(data);
    let sap_list: string[] = []

    for (let i = 0; i < data.length; i++) {
        const sap = await prisma.oSF_Product.findFirst({
            where: {
                codigoEan: data[i]
            }
        })

        if (sap) {
            console.log(sap.codigoSap)
            sap_list.push(sap.codigoSap as string)
        }
    }

    console.log('RESPUESTA => ', sap_list);

    return NextResponse.json(sap_list)
}