'use server'

import prisma from "@/lib/prisma"


export const getAllTypeIncidence = async () => {

  let result;
  try {

    result = await prisma.typesIncidence.findMany({
      select: {
        TypeIncidenceID: true,
        Description: true,
      }
    })

  } catch (error: any) {

    return { ok: false, message: `${error.message}}`, data: [] }
  }

  return { ok: true, message: "", data: result }
}