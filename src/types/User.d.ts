
export interface User {
    dni: string
    name: string
    lastName: string
    email: string
    emailVerified?: string
    password?: string
    image?: string
    rolId: number
    status?: boolean
    pickupPointID?: string
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