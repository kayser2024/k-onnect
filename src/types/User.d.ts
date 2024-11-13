
export interface User {
    dni: string
    name: string
    lastName: string
    email: string
    emailVerified: string
    password: string
    image: string
    rolId: number
    status?: boolean
}