
export interface User {
    UserID: number;
    Email: string
    Password?: string
    Name: string
    LastName: string
    Status?: boolean
    TypeDocID: number;
    NroDoc: string
    RoleID: number
    PickupPointID?: number
}

export interface Users {
    UserID: number
    Password: string
    Email: string
    Status: boolean
    TypeDocID: number
    NroDoc: string
    RoleID: number
    Name: string
    LastName: string
}