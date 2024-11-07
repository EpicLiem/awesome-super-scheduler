// server utils

import bcrypt from 'bcrypt';

async function isAuthenticated(cookies) {
    const emailCookie = cookies.get('email');
    const tokenCookie = cookies.get('token');

    if (!emailCookie || !tokenCookie) {
        return false;
    }

    const email = emailCookie.value;
    const token = tokenCookie.value;

    // Compare the hashed token with the expected pattern
    const isAuthorized = await bcrypt.compare('Authorized' + email, token);
    return isAuthorized;
}

export async function authMiddleware(cookies) {
    const isAuth = await isAuthenticated(cookies);
    if (!isAuth) {
        return new Response('Unauthorized', { status: 401 });
    }
    // If authorized, return `null` to indicate no response interference
    return null;
}