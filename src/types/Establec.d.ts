export interface PickupPoint {
  PickupPointID: number;
  Description: string | null;
  District: string | null;
  Province: string | null;
  Department: string | null;
  LocationCode: string | null;
  Place: string | null;
  Address: string | null
  Grouped?: string | null;
  IsActive: boolean;
  IsAvailablePickup: boolean;
  CodWareHouse: string | null;
  Lat: Decimal | null;
  Lon: Decimal | null;
}