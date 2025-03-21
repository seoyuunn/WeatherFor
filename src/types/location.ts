export interface LocationType {
    latitude: number;
    longitude: number;
  }
  
  export interface LocationData extends LocationType {
    name: string;
    address?: string;
  }
  