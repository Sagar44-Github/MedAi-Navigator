/**
 * Represents an emergency contact.
 */
export interface EmergencyContact {
  /**
   * The name of the emergency contact.
   */
  name: string;
  /**
   * The phone number of the emergency contact.
   */
  phoneNumber: string;
}

/**
 * Asynchronously retrieves a list of emergency contacts.
 *
 * @returns A promise that resolves to a list of EmergencyContact objects.
 */
export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      name: 'Example Emergency Contact',
      phoneNumber: '555-123-4567',
    },
  ];
}
