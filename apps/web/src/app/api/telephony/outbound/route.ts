import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name, company, prompt } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.startsWith("+")
      ? phone
      : `+91${phone.replace(/[^\d]/g, "")}`;

    const blandApiKey = process.env.BLAND_API_KEY;
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFromNumber = process.env.TWILIO_PHONE_NUMBER;

    // 1. BLAND AI (Full Autonomous AI Voice Agent on Physical Mobile Phones)
    if (blandApiKey) {
      try {
        const blandRes = await fetch("https://api.bland.ai/v1/calls", {
          method: "POST",
          headers: {
            Authorization: blandApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: cleanPhone,
            task:
              prompt ||
              `You are an AI executive calling on behalf of Umendra Bhati regarding Salesforce CRM automations for ${name || "the prospect"} at ${company || "their company"}. Pitch our automated CRM pipeline tools politely in natural Hindi and English.`,
            voice: "maya",
            record: true,
            reduce_latency: true,
          }),
        });

        const blandData = await blandRes.json();
        return NextResponse.json({
          success: true,
          provider: "bland-ai",
          data: blandData,
          message: `Real AI call dispatched to ${cleanPhone} via Bland.ai telecom network!`,
        });
      } catch (blandErr) {
        console.error("Bland AI Error:", blandErr);
      }
    }

    // 2. TWILIO VOICE (Real Telecom Cellular Dialing)
    if (twilioAccountSid && twilioAuthToken && twilioFromNumber) {
      try {
        const basicAuth = Buffer.from(
          `${twilioAccountSid}:${twilioAuthToken}`
        ).toString("base64");

        const twiml = `<Response><Say voice="Polly.Aditi">Hello ${
          name || "there"
        }. This is an autonomous AI assistant calling from Umendra Bhati regarding your Salesforce CRM pipeline. Thank you for answering!</Say></Response>`;

        const twilioParams = new URLSearchParams({
          To: cleanPhone,
          From: twilioFromNumber,
          Twiml: twiml,
        });

        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${basicAuth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: twilioParams.toString(),
          }
        );

        const twilioData = await twilioRes.json();
        return NextResponse.json({
          success: twilioRes.ok,
          provider: "twilio",
          data: twilioData,
          message: `Real mobile call dispatched to ${cleanPhone} via Twilio!`,
        });
      } catch (twilioErr) {
        console.error("Twilio Voice Error:", twilioErr);
      }
    }

    // 3. Telephony credentials not configured in environment
    return NextResponse.json({
      success: false,
      configured: false,
      error: "Telephony Provider API Key not found in .env.local",
      instructions:
        "To make physical mobile phones ring automatically via telecom network, add BLAND_API_KEY or TWILIO_ACCOUNT_SID to .env.local. Direct SIM call (tel:) and WhatsApp call links are available immediately.",
    });
  } catch (error) {
    console.error("TELEPHONY ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Internal telephony error",
      },
      { status: 500 }
    );
  }
}
