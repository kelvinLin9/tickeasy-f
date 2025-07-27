export interface VenueCardProps {
  idx: number;
  title: string;
  image: string | null;
  description: string | null;
  address: string;
  capacity: string | null;
  CanBus: boolean;
  CanParking: boolean;
}

export interface VenueData {
  venueId: string;
  venueName: string;
  venueDescription: string | null;
  venueAddress: string;
  venueCapacity: number | null;
  venueImageUrl: string | null;
  googleMapUrl: string | null;
  isAccessible: boolean;
  hasParking: boolean;
  hasTransit: boolean;
  createdAt: string;
  updatedAt: string;
}
