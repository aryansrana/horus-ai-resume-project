'use server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

// Define your DecodedToken interface
interface DecodedToken {
  userId: string;
  email: string;
  username: string;
  exp: number;
}

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const key = new TextEncoder().encode(SECRET_KEY);

export async function setTokenCookie(token: string) {
  try {
    const cookieStore = cookies();
    // Verify the JWT first (this checks the signature and expiration)
    const { payload } = await jwtVerify(token, key);

    // If verification is successful, decode the token to access the payload
    const decoded = jwtDecode<DecodedToken>(token); // Specify the custom type here

    const expires = new Date(decoded.exp * 1000);

    cookieStore.set('token', token, {
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === 'production', // Secure only in production
      path: '/', // Makes the cookie available site-wide
      sameSite: 'strict', // Prevents CSRF attacks
      expires, // Use token's exp as expiration date
    });
  } catch (error) {
    console.error('Failed to verify or decode token:', error);
  }
}

export async function getEmailFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return null;
  }

  try {
    // Verify the JWT first (this checks the signature and expiration)
    const { payload } = await jwtVerify(token.value, key);

    // If verification is successful, decode the token to access the payload
    const decoded = jwtDecode<DecodedToken>(token.value); // Specify the custom type here

    // Access the email property directly from the decoded token
    const email = decoded.email;
    return email;
  } catch (error) {
    await removeTokenCookie();
    return null; // Return null or handle the error as needed
  }
}

// Remove Token Cookie
export async function removeTokenCookie() {
  cookies().delete('token');
  return;
}
