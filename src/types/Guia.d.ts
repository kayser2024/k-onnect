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
    NoteGuideID:number;
    BarCode: string;
    ProductCode: string;
    Description: string;
    Image1: string;
    Quantity: number;
    QuantityPicks: number;
    ExistInGuide: boolean;
}
