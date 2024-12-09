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
    console.error('Failed to verify or decode token:', error);

    // If the JWT is invalid, remove the token cookie
    await removeTokenCookie();

    return null; // Return null or handle the error as needed
  }
}

// Remove Token Cookie
export async function removeTokenCookie() {
  cookies().delete('token');
  return;
}
