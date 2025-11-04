/**
 * API Route: Vaccine Lookup by Batch Number
 *
 * GET /api/vaccines/lookup?batch=<batch_number>
 *
 * Looks up vaccine information from the local JSON database
 * based on batch number.
 *
 * Returns:
 * - 200: Vaccine record found
 * - 404: No record found for batch number
 * - 400: Missing batch parameter
 */

import { NextRequest, NextResponse } from 'next/server';
import data from '@/data/Impfstoffchargen.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const batch = searchParams.get('batch');

  if (!batch) {
    return NextResponse.json(
      { error: 'Missing batch parameter' },
      { status: 400 }
    );
  }

  const hit = data.find((record) => record.batch === batch);

  if (!hit) {
    return NextResponse.json(
      { error: 'No vaccine data found for this batch number' },
      { status: 404 }
    );
  }

  return NextResponse.json(hit, { status: 200 });
}
