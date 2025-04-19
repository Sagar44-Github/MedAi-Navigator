'use client';

import {useState, useEffect} from 'react';
import {getMedicalFacilities, MedicalFacility} from '@/services/medical-facility-locator';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {MapPin} from 'lucide-react';

export default function FindMedicalHelpPage() {
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setError('Could not retrieve your location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  }, []);

  const handleSearch = async () => {
    if (!location) {
      setError('Please allow location access or enter your location manually.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getMedicalFacilities(location, specialty);
      setFacilities(data);
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
              {location ? (
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
                  {/* TODO: Implement clickable map here */}
                  <div className="mt-4">
                    <p>Clickable map will be implemented here in future version</p>
                  </div>
                </>
              ) : (
                <div>
                  <p>Getting your location...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
