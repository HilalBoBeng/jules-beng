import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // In a stateless JWT setup, the client is responsible for destroying the token.
    // This endpoint is here for completeness and can be extended later
    // for features like token blacklisting if needed.

    // For now, we just acknowledge the request and tell the client "OK".
    return NextResponse.json({ message: 'Logout successful' });

  } catch (error) {
    console.error('LOGOUT_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
