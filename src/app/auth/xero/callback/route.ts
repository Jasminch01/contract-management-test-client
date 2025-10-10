import { NextRequest, NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    );
  }

  const xero = new XeroClient({
    clientId: process.env.XERO_CLIENT_ID!,
    clientSecret: process.env.XERO_CLIENT_SECRET!,
    redirectUris: [process.env.XERO_REDIRECT_URI!],
    scopes: process.env.XERO_SCOPES!.split(' '),
  });

  try {
    const tokenSet = await xero.apiCallback(request.url);
    
    // Store tokenSet in your database
    // You need to save: access_token, refresh_token, expires_at
    // Associated with the current user/organization
    console.groupCollapsed(tokenSet)
    // await saveXeroTokens({
    //   accessToken: tokenSet.access_token,
    //   refreshToken: tokenSet.refresh_token,
    //   expiresAt: new Date(Date.now() + tokenSet.expires_in * 1000),
    // });

    // Redirect to success page
    return NextResponse.redirect(new URL('/dashboard/settings?xero=connected', request.url));
  } catch (error) {
    console.error('Xero callback error:', error);
    return NextResponse.redirect(new URL('/dashboard/settings?xero=error', request.url));
  }
}

// Helper function to save tokens (implement based on your database)
// async function saveXeroTokens(tokens: {
//   accessToken: string;
//   refreshToken: string;
//   expiresAt: Date;
// }) {
//   // TODO: Save to your database
//   // Example: await prisma.xeroToken.upsert({ ... })
// }