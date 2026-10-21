import AuthService from '@/modules/auth/services/auth-services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await AuthService.destroySession();

    return NextResponse.redirect(new URL('/portal/sign-in', req.url));
}