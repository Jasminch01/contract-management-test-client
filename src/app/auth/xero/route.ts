import { NextRequest, NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const xero = new XeroClient({
    clientId: process.env.XERO_CLIENT_ID!,
    clientSecret: process.env.XERO_CLIENT_SECRET!,
    redirectUris: [process.env.XERO_REDIRECT_URI!],
    scopes: process.env.XERO_SCOPES!.split(' '),
  });

  try {
    const consentUrl = await xero.buildConsentUrl();
    return NextResponse.redirect(consentUrl);
  } catch (error) {
    console.error('Xero auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Xero authentication' },
      { status: 500 }
    );
  }
}