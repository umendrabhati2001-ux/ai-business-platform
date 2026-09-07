import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.SFORCE_CLIENT_ID;
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI;
    const loginUrl = process.env.SALESFORCE_LOGIN_URL;

    const code = request.nextUrl.searchParams.get("code");

    const codeVerifier = request.cookies.get(
      "salesforce_code_verifier"
    )?.value;

    console.log("SALESFORCE CALLBACK:", {
      clientId: !!clientId,
      redirectUri: !!redirectUri,
      loginUrl: !!loginUrl,
      code: !!code,
      codeVerifier: !!codeVerifier,
    });

    if (
      !clientId ||
      !redirectUri ||
      !loginUrl ||
      !code ||
      !codeVerifier
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Salesforce OAuth callback data is missing",
          hasClientId: !!clientId,
          hasRedirectUri: !!redirectUri,
          hasLoginUrl: !!loginUrl,
          hasCode: !!code,
          hasCodeVerifier: !!codeVerifier,
        },
        { status: 400 }
      );
    }

    const tokenResponse = await fetch(
      `${loginUrl}/services/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          redirect_uri: redirectUri,
          code,
          code_verifier: codeVerifier,
        }).toString(),
      }
    );

    const tokenData = await tokenResponse.json();

    console.log("SALESFORCE TOKEN RESPONSE:", {
      ok: tokenResponse.ok,
      hasAccessToken: !!tokenData.access_token,
      hasInstanceUrl: !!tokenData.instance_url,
      error: tokenData.error,
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Salesforce token exchange failed",
          details: tokenData,
        },
        { status: tokenResponse.status }
      );
    }

    const response = NextResponse.redirect(
      new URL("/dashboard", request.url)
    );

    response.cookies.set(
      "salesforce_access_token",
      tokenData.access_token,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      }
    );

    response.cookies.set(
      "salesforce_instance_url",
      tokenData.instance_url,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      }
    );

    response.cookies.delete(
      "salesforce_code_verifier"
    );

    return response;
  } catch (error) {
    console.error(
      "Salesforce OAuth Callback Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Salesforce callback failed",
      },
      { status: 500 }
    );
  }
}