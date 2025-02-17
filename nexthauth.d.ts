
import NextAuth, { DefaultSession } from "next-auth";
import { string } from "zod";

declare module 'next-auth' {
    interface Session {
        user: {
            UserID: number,
            Email: string,
            Password: string,
            Name: string,
            LastName: string,
            Status: boolean,
            TypeDocID: number,
            NroDoc: string,
            RoleID: number,
            PickupPointID: number | null,
            CreatedAt: Date | null,
            UpdatedAt: Date | null,
            PickupPoints: {
                Description: string,
                CodWareHouse: string,
                Lat: Decimal,
                Lon: Decimal,
                IsActive: boolean,
                IsAvailablePickup: boolean
            }
        } & DefaultSession
    }
}