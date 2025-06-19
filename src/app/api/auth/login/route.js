import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  console.log('Admin Email from env:', adminEmail);
  console.log('Admin Password Hash from env:', adminPasswordHash ? 'Hash loaded' : 'Hash NOT loaded');
  console.log('Received email:', email);

  if (!email || !password) {
    return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
  }

  // ✅ Compare email and hashed password
  const emailMatch = email === adminEmail;
  const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

  if (emailMatch && passwordMatch) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
    });

    return response;
  }

  return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
}

