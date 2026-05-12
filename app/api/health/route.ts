import { NextResponse } from 'next/server';
import { getModelVersion } from '@/lib/ai-service';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    modelVersion: getModelVersion(),
    services: {
      auth: 'operational',
      ai: process.env.OPENAI_API_KEY ? 'operational' : 'mock',
      storage: 'operational',
    },
  });
}
