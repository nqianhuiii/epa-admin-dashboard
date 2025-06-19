import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  const token = request.cookies.get('auth-token')?.value;

  // No token = not authenticated, but not an error (use 200 status)
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ authenticated: true, user: decoded }, { status: 200 });
  } catch (error) {
    // Invalid token = authentication failed (use 200 with authenticated: false)
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}