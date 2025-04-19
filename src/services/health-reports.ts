/**
 * Represents a health report.
 */
export interface HealthReport {
  /**
   * The name of the health report.
   */
  name: string;
  /**
   * The url of the health report.
   */
  url: string;
}

/**
 * Asynchronously retrieves a list of health reports.
 *
 * @returns A promise that resolves to a list of HealthReport objects.
 */
export async function getHealthReports(): Promise<HealthReport[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      name: 'Example Health Report',
      url: 'https://example.com',
    },
  ];
}
