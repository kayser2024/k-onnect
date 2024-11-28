export interface Order {
    OrderID: number,
    OrderNumber: string,
    StatusID: number,
    UserID: number,
    PickupPointID: number | null,
    CreatedAt: string,
    UpdatedAt: string,
    PickupPoint: string,
    UserUpdaterID: number | null
}
