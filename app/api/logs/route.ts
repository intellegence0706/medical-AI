import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dataStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins and doctors can view logs
    if (session.user.role === 'viewer') {
      return NextResponse.json(
        { error: 'Forbidden: Viewers cannot access logs' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const filters: any = {};
    if (userId) filters.userId = parseInt(userId);
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (action) filters.action = action;

    const allLogs = dataStore.getAuditLogs(filters);
    const total = allLogs.length;
    const logs = allLogs.slice(offset, offset + limit);

    return NextResponse.json({
      logs,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
