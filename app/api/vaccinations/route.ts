/**
 * API Route: GET /api/vaccinations
 *
 * Loads the vaccination scheme from the JSON file and returns it.
 * This endpoint provides the base data for Tab 3.1 (Impfanamnese).
 */

import { NextResponse } from 'next/server';
import vaccinationData from '@/data/vaccination_scheme.json';

export async function GET() {
  try {
    return NextResponse.json(vaccinationData);
  } catch (error) {
    console.error('Error loading vaccination data:', error);
    return NextResponse.json(
      { error: 'Failed to load vaccination data' },
      { status: 500 }
    );
  }
}
