import { NextResponse } from 'next/server';
import { apiUrls } from '@/environments/prod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${apiUrls.users.registerForTest}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 },
    );
  }
}
