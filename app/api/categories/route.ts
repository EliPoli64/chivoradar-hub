import { NextResponse } from 'next/server';
import { getCategoriesSafe } from '@/lib/events';

export async function GET() {
  try {
    const categories = await getCategoriesSafe();

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}
