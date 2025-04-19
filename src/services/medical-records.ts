/**
 * Represents a medical record.
 */
export interface MedicalRecord {
  /**
   * The name of the medical record.
   */
  name: string;
  /**
   * The url of the medical record.
   */
  url: string;
}

/**
 * Asynchronously retrieves a list of medical records.
 *
 * @returns A promise that resolves to a list of MedicalRecord objects.
 */
export async function getMedicalRecords(): Promise<MedicalRecord[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      name: 'Example Medical Record',
      url: 'https://example.com',
    },
  ];
}
