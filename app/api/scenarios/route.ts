import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dataStore } from '@/lib/store';
import { Scenario } from '@/lib/types';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const scenarios = dataStore.getScenarios();
    
    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error('Get scenarios error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only doctors and admins can create scenarios
    if (session.user.role === 'viewer') {
      return NextResponse.json(
        { error: 'Forbidden: Viewers cannot create scenarios' },
        { status: 403 }
      );
    }

    const body: Omit<Scenario, 'id'> = await request.json();
    
    if (!body.name || !body.timeline || body.timeline.length === 0) {
      return NextResponse.json(
        { error: 'Name and timeline are required' },
        { status: 400 }
      );
    }

    const newScenario = dataStore.addScenario({
      ...body,
      isPreloaded: false,
    });

    return NextResponse.json(newScenario, { status: 201 });
  } catch (error) {
    console.error('Create scenario error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
