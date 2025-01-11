export interface Incidence {
    IncidenceID: number;
    OrdenID: number;
    InvoiceOriginal: string;
    InvoiceIncidence: string;
    NCIncidence: string;
    TypeIncidenceID: number;
    IsCompleted: boolean;
    Description: string;
    PickupPointID: number;
    CreatedAt: Date;
    Dispatched: boolean;
    DispatchedDate: Date;
    ReceivedDate: Date;
    Received: boolean;
    Comments: string;
    IsConfirmed: boolean;
    IncidenceLogs: IncidenceLog[];
}

export interface IncidenceLog {
    CodEan: string;
    CodProd: string;
    ProdQuantity: number;
    ProdSubtotal: number;
    Description: string;
    CreatedAt: Date;
}


export interface ResponseAllIncidence {
    OrderID: number,
    OrderNumber: string,
    Invoice: string,
    PickupPoint: string,
    Destiny: string,
    OrderStatusDescription: string,
    TypeIncidenceCount: number

}