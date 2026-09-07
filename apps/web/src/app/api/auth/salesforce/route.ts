import { NextResponse } from "next/server";
import crypto from "crypto";

function base64UrlEncode(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function GET() {
  try {
    const clientId = process.env.SFORCE_CLIENT_ID;
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI;
    const loginUrl = process.env.SALESFORCE_LOGIN_URL;

    console.log("SALESFORCE ENV CHECK:", {
      clientId: !!clientId,
      redirectUri: !!redirectUri,
      loginUrl: !!loginUrl,
    });

    if (!clientId || !redirectUri || !loginUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Salesforce environment variables are missing",
        },
        { status: 500 }
      );
    }

    // Generate PKCE verifier
    const codeVerifier = base64UrlEncode(
      crypto.randomBytes(32)
    );

    // Generate PKCE challenge
    const codeChallenge = base64UrlEncode(
      crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest()
    );

    console.log("PKCE generated:", {
      verifier: !!codeVerifier,
      challenge: !!codeChallenge,
    });

    // Salesforce authorization URL
    const authUrl = new URL(
      `${loginUrl}/services/oauth2/authorize`
    );

    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);

    authUrl.searchParams.set(
      "code_challenge",
      codeChallenge
    );

    authUrl.searchParams.set(
      "code_challenge_method",
      "S256"
    );

    console.log(
      "Salesforce Auth URL:",
      authUrl.toString()
    );

    // Redirect browser to Salesforce
    const response = NextResponse.redirect(
      authUrl.toString()
    );

    // Save verifier for callback
    response.cookies.set(
      "salesforce_code_verifier",
      codeVerifier,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 600,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Salesforce OAuth Start Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to start Salesforce OAuth",
      },
      { status: 500 }
    );
  }
}