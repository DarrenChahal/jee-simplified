import { NextResponse } from 'next/server';

import createTest from '@/mocks/tests/create-test.json';

// const API_URL = 'https://jee-simplified-api-1075829581.us-central1.run.app/api/tests';
const API_URL = 'http://localhost:8080/api/tests';
const useMock = false;

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
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tests' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (useMock) {
      console.log("Returning mock test");
      return NextResponse.json(createTest);
    }
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test' }, 
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
        { success: false, error: 'Test ID is required' }, 
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
    console.error('Error updating test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update test' }, 
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
        { success: false, error: 'Test ID is required' }, 
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
    console.error('Error deleting test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete test' }, 
      { status: 500 }
    );
  }
} 