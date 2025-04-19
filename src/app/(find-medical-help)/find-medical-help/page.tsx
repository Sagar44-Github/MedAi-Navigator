'use client';

import {useState, useEffect, useRef} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {MapPin} from 'lucide-react';
import type * as L from 'leaflet';

/**
 * Represents a medical facility.
 */
export interface MedicalFacility {
  /**
   * The name of the medical facility.
   */
  name: string;
  /**
   * The address of the medical facility.
   */
  address: string;
  /**
   * The phone number of the medical facility.
   */
  phoneNumber: string;
  /**
   * The rating of the medical facility.
   */
  rating: number;
  /**
   * The distance of the medical facility from the user.
   */
  distance: number;
    /**
   * The latitude of the medical facility.
   */
  latitude: number;
  /**
   * The longitude of the medical facility.
   */
  longitude: number;
}

/**
 * Asynchronously retrieves a list of medical facilities near a given location.
 *
 * @param location The location to search near.
 * @param specialty The specialty to filter by.
 * @returns A promise that resolves to a list of MedicalFacility objects.
 */
export async function getMedicalFacilities(
  location: { lat: number; lng: number },
  specialty?: string
): Promise<MedicalFacility[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      name: 'Example Hospital',
      address: '123 Main St',
      phoneNumber: '555-123-4567',
      rating: 4.5,
      distance: 1.2,
      latitude: 34.0522, // Example latitude
      longitude: -118.2437, // Example longitude
    },
  ];
}

// Leaflet's default icon path is not correctly configured, leading to marker errors.
// This workaround sets the correct paths for the marker icons.
// More info: https://github.com/Leaflet/Leaflet/issues/4968
function setLeafletIcon() {
  if (typeof window === 'undefined') {
    return;
  }

  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'leaflet/images/marker-2x.png',
    iconUrl: 'leaflet/images/marker.png',
    shadowUrl: 'leaflet/images/marker-shadow.png',
  });
}

export default function FindMedicalHelpPage() {
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true); // Track location loading state

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocationLoading(false); // Location loaded successfully
        },
        () => {
          setError('Could not retrieve your location. Please enter manually.');
          setIsLocationLoading(false); // Location loading failed
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your location manually.');
      setIsLocationLoading(false); // Geolocation not supported
    }
  }, []);

  // Initialize map after location is set
  useEffect(() => {
    if (!isClient) {
      return;
    }

    setLeafletIcon();

    const initializeMap = async () => {
      if (location && mapRef.current) {
        try {
          const L = await import('leaflet') as typeof L;
          const newMap = L.map(mapRef.current).setView([location.lat, location.lng], 12);

          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(newMap);

          setMap(newMap);
        } catch (error) {
          console.error('Failed to initialize leaflet map', error);
        }
      }
    };

    initializeMap();

    return () => {
      map?.remove();
    };
  }, [location, isClient]);

  // Add markers when facilities change
  useEffect(() => {
    if (map && facilities.length > 0) {
      // Clear existing markers
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      facilities.forEach(facility => {
        if (map) {
          const marker = (L as any).marker([facility.latitude, facility.longitude]).addTo(map);
          marker.bindPopup(`<b>${facility.name}</b><br>${facility.address}<br>Rating: ${facility.rating}`);
        }
      });
    }
  }, [facilities, map]);

  const handleSearch = async () => {
    if (!location) {
      setError('Please allow location access or enter your location manually.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getMedicalFacilities(location, specialty);
       // Simulate adding latitude and longitude to the facilities
      const facilitiesWithLatLng = data.map(facility => ({
        ...facility,
        latitude: location.lat + (Math.random() - 0.5) * 0.1, // Adding some random offset
        longitude: location.lng + (Math.random() - 0.5) * 0.1, // Adding some random offset
      }));
      setFacilities(facilitiesWithLatLng);
    } catch (err: any) {
      console.error('Error fetching medical facilities:', err);
      setError('Failed to fetch medical facilities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-background py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            MedAi Navigator
          </a>
        </div>
      </header>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-lg mx-auto hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
            <CardHeader>
              <CardTitle>Find Medical Help</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {error && (
                <div className="text-red-500">{error}</div>
              )}
              {isLocationLoading ? (
                <div>
                  <p>Getting your location...</p>
                </div>
              ) : location ? (
                <>
                  <div className="grid gap-2">
                    <label htmlFor="specialty">Specialty (optional)</label>
                    <Input
                      id="specialty"
                      value={specialty}
                      onChange={e => setSpecialty(e.target.value)}
                      placeholder="Enter specialty (e.g., Dentist, Cardiologist)"
                    />
                  </div>
                  <Button
                    className="transition-colors duration-300 bg-primary text-primary-foreground hover:bg-primary/80 rounded-md py-2 px-4 font-semibold"
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                  {facilities.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Nearby Medical Facilities:
                      </h3>
                      <ul>
                        {facilities.map(facility => (
                          <li
                            key={facility.name}
                            className="mb-2 p-4 rounded-md shadow-sm bg-card"
                          >
                            <strong>{facility.name}</strong>
                            <p>Address: {facility.address}</p>
                            <p>Phone: {facility.phoneNumber}</p>
                            <p>Rating: {facility.rating}</p>
                            <p>Distance: {facility.distance} miles</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {isClient && mapRef.current && (
                    <div
                      ref={mapRef}
                      className="mt-4"
                      style={{height: '400px'}}
                    />
                  )}
                </>
              ) : (
                <div>
                  <p>Location access denied or unavailable.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
