import { NextResponse } from 'next/server';
import { getEventsFeed } from '@/lib/events';

export async function GET() {
  try {
    const events = await getEventsFeed();

    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}