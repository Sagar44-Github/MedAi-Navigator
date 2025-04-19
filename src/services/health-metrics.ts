/**
 * Represents health metrics.
 */
export interface HealthMetrics {
  /**
   * The blood pressure.
   */
  bloodPressure: string;
  /**
   * The heart rate.
   */
  heartRate: number;
}

/**
 * Asynchronously retrieves health metrics.
 *
 * @returns A promise that resolves to a HealthMetrics object.
 */
export async function getHealthMetrics(): Promise<HealthMetrics> {
  // TODO: Implement this by calling an API.

  return {
    bloodPressure: '120/80',
    heartRate: 72,
  };
}
