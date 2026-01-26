import { NextResponse } from 'next/server';

import { apiUrls } from '@/environments/prod';
const API_URL = apiUrls.questions.getAll;

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // If it's multipart (file upload), forward as is
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // We need to reconstruct a new FormData to send because the incoming one
      // is bound to the incoming request.
      const outgoingFormData = new FormData();
      
      // Iterate over all entries and append them to the new FormData
      // @ts-ignore - TS iterator issues with FormData
      for (const [key, value] of formData.entries()) {
        outgoingFormData.append(key, value);
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        // Note: DO NOT set 'Content-Type': 'multipart/form-data' manually here.
        // fetch() will set it automatically with the correct boundary.
        body: outgoingFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend API Error (${response.status}):`, errorText);
        throw new Error(`Backend API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } 
    
    // Fallback for JSON requests (if any remain)
    else {
      const body = await request.json();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const id = body._id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete question' },
      { status: 500 }
    );
  }
} 