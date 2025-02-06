export interface ResponseGuia {
    GuideNumber: string;
    OriginWarehouse: string;
    NameOriginWarehouse: string;
    DestinationWarehouse: string;
    NameDestinationWarehouse: string;
    Details: Detail[];
}

export interface Detail {
    NoteGuideDetailsID:number;
    BarCode: string;
    ProductCode: string;
    Description: string;
    Image1: string;
    Quantity: string;
    QuantityPicks: number;
    ExistInGuide: boolean;
}
