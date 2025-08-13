import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// TODO: The JWT_SECRET must be loaded from environment variables.
// The .env file creation is failing in the current environment.
// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = "some-super-secret-and-long-string-for-jwt-42";

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse('Email and password are required', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Return the token to the client
    return NextResponse.json({ token });

  } catch (error) {
    console.error('LOGIN_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
