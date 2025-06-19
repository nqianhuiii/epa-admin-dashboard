// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export async function POST(request) {
//   const { email, password } = await request.json();

//   const adminEmail = process.env.ADMIN_EMAIL;
//   const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

//   console.log('Admin Email from env:', adminEmail);
//   console.log('Admin Password Hash from env:', adminPasswordHash ? 'Hash loaded' : 'Hash NOT loaded');
//   console.log('JWT_SECRET loaded:', !!jwtSecret);
//   console.log('Received email:', email);
  

//   if (!email || !password) {
//     return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
//   }

//   // ✅ Compare email and hashed password
//  const emailMatch = email === adminEmail;
//   console.log('Email match:', emailMatch);
  
//   const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
//   console.log('Password match:', passwordMatch);

//   if (emailMatch && passwordMatch) {
//     const token = jwt.sign({ email }, process.env.JWT_SECRET, {
//       expiresIn: '3h',
//     });

//     const response = NextResponse.json({ success: true });

//     response.cookies.set('auth-token', token, {
//       httpOnly: true,
//       path: '/',
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 60 * 60,
//     });

//     return response;
//   }

//   return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
// }

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;
  
  console.log('Admin Email from env:', adminEmail);
  console.log('Admin Password Hash from env:', adminPasswordHash ? 'Hash loaded' : 'Hash NOT loaded');
  console.log('JWT_SECRET loaded:', !!jwtSecret);
  console.log('Received email:', email);

  if (!email || !password) {
    return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
  }

  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  // ✅ Compare email and hashed password
  const emailMatch = email === adminEmail;
  console.log('Email match:', emailMatch);
  
  const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
  console.log('Password match:', passwordMatch);

  if (emailMatch && passwordMatch) {
    console.log('Auth successful, creating token...');
    
    // Use jose instead of jsonwebtoken
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('3h')
      .sign(secret);

    console.log('Token created successfully');

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 3, // 3 hours in seconds
    });

    return response;
  }

  console.log('Auth failed - returning 401');
  return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
}