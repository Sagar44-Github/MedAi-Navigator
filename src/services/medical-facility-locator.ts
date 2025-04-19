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
    },
  ];
}
