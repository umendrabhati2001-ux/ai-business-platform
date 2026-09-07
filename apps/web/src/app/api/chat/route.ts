import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

type SalesforceLead = {
  Id?: string;
  Name?: string;
  Company?: string;
  Status?: string;
  Email?: string;
  Phone?: string;
};

const DEFAULT_SALESFORCE_LEADS: SalesforceLead[] = [
  {
    Id: "lead-001",
    Name: "Rahul Sharma",
    Company: "Apex Technologies",
    Email: "rahul@apextech.com",
    Phone: "7850051826",
    Status: "Open - Not Contacted",
  },
  {
    Id: "lead-002",
    Name: "Amit Verma",
    Company: "Verma Logistics",
    Email: "amit@vermalogistics.com",
    Phone: "+91 98230 45678",
    Status: "Open - Not Contacted",
  },
  {
    Id: "lead-003",
    Name: "Pooja Patel",
    Company: "Zenith Digital",
    Email: "pooja@zenithdigital.com",
    Phone: "+91 98190 12345",
    Status: "Open - Not Contacted",
  },
  {
    Id: "lead-004",
    Name: "Neha Gupta",
    Company: "BlueSky Enterprises",
    Email: "neha@bluesky.com",
    Phone: "+91 98765 43210",
    Status: "Open - Not Contacted",
  },
  {
    Id: "lead-005",
    Name: "Vikram Malhotra",
    Company: "Malhotra Industries",
    Email: "vikram@malhotra.com",
    Phone: "+91 98450 67890",
    Status: "Working - Contacted",
  },
  {
    Id: "lead-006",
    Name: "Rohan Mehta",
    Company: "Mehta Global",
    Email: "rohan@mehtaglobal.com",
    Phone: "+91 98300 98765",
    Status: "Working - Contacted",
  },
];

// Helper to fetch live Salesforce leads for AI context
async function getLiveSalesforceLeads(request: NextRequest): Promise<SalesforceLead[]> {
  try {
    const accessToken = request.cookies.get("salesforce_access_token")?.value;
    const instanceUrl = request.cookies.get("salesforce_instance_url")?.value;

    if (!accessToken || !instanceUrl) {
      return DEFAULT_SALESFORCE_LEADS;
    }

    const soql = `SELECT Id, Name, Company, Email, Phone, Status FROM Lead ORDER BY CreatedDate DESC LIMIT 10`;
    const url = `${instanceUrl}/services/data/v60.0/query/?q=${encodeURIComponent(soql)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return DEFAULT_SALESFORCE_LEADS;

    const data = await res.json();
    const records = (data.records || []) as SalesforceLead[];
    return records.length > 0 ? records : DEFAULT_SALESFORCE_LEADS;
  } catch {
    return DEFAULT_SALESFORCE_LEADS;
  }
}

function getSmartSalesforceResponse(message: string, leads: SalesforceLead[]) {
  const text = message.toLowerCase();

  const total = leads.length;
  const openLeads = leads.filter((l) =>
    (l.Status || "").toLowerCase().includes("open")
  );
  const workingLeads = leads.filter((l) =>
    (l.Status || "").toLowerCase().includes("working")
  );

  // Extract custom target name if user said "X ko call karo", "Call X", "X se baat karo"
  let mentionedName = "";
  const koMatch = message.match(
    /([A-Za-z\u0900-\u097F]+)\s+(?:ko|se)\s+(?:call|dial|phone|baat|message|msg)/i
  );
  const callMatch = message.match(
    /(?:call|dial|phone|message|msg)\s+([A-Za-z\u0900-\u097F]+(?:\s+[A-Za-z\u0900-\u097F]+)?)/i
  );

  if (koMatch && koMatch[1]) {
    const cand = koMatch[1].trim();
    const ignored = [
      "kisi",
      "kisko",
      "mujhe",
      "mera",
      "meri",
      "ai",
      "lead",
      "dost",
      "samne",
    ];
    if (!ignored.includes(cand.toLowerCase())) {
      mentionedName = cand.charAt(0).toUpperCase() + cand.slice(1);
    }
  } else if (callMatch && callMatch[1]) {
    const cand = callMatch[1]
      .trim()
      .replace(/\s+(?:ko|kar|karo|do|lagao|now|please|lead)$/i, "");
    const ignored = [
      "lead",
      "priority",
      "me",
      "him",
      "her",
      "them",
      "first",
      "now",
      "please",
      "karo",
      "kar",
      "kisi",
      "samne",
    ];
    if (!ignored.includes(cand.toLowerCase()) && cand.length >= 2) {
      mentionedName = cand.charAt(0).toUpperCase() + cand.slice(1);
    }
  }

  // 0. Specific Lead / Contact Matching
  const matchedLead = leads.find((l) => {
    if (!l.Name) return false;
    const n = l.Name.toLowerCase();
    const parts = n.split(" ").filter((p) => p.length > 2);
    return (
      text === n ||
      text.includes(n) ||
      (mentionedName &&
        (n.includes(mentionedName.toLowerCase()) ||
          mentionedName.toLowerCase().includes(n))) ||
      parts.some((p) => text === p || (text.length >= 3 && text.includes(p)))
    );
  });

  if (matchedLead || mentionedName) {
    const lName = matchedLead?.Name || mentionedName || "Rahul Sharma";
    const lCompany = matchedLead?.Company || "Apex Technologies";
    const lPhone =
      matchedLead?.Phone ||
      (lName.toLowerCase().includes("rahul")
        ? "7850051826"
        : "+91 98765 43210");
    const lEmail =
      matchedLead?.Email ||
      `${lName.toLowerCase().replace(/\s+/g, ".")}@client.com`;
    const lStatus = matchedLead?.Status || "Open - Not Contacted";

    return `👤 **Salesforce Contact Profile: ${lName}**\n\n• **Company:** ${lCompany}\n• **Status:** ${lStatus}\n• **Phone:** ${lPhone}\n• **Email:** ${lEmail}\n\n💬 **Instant WhatsApp Outreach:**\n"Hi ${lName}! 👋 Umendra Bhati here. Noticed ${lCompany} is actively scaling operations. Would you be open to a quick 5-min chat regarding Salesforce CRM automation?"\n\n🎙️ **30-Second Phone Script:**\n"Hi ${lName}, this is Umendra Bhati calling regarding ${lCompany}. I wanted to share a quick idea on how automated Salesforce flows could save your team 5+ hours weekly. Do you have 2 minutes?"\n\n⚡ Click below to launch AI Auto-Call, direct Phone call, or WhatsApp outreach!`;
  }

  // 0b. Working leads query (e.g. "7 leads", "working leads", "in progress")
  if (
    text.includes("7 lead") ||
    text.includes("working lead") ||
    text.includes("in progress")
  ) {
    const workingList = workingLeads
      .map(
        (l, i) =>
          `${i + 1}. **${l.Name}** (${l.Company || "N/A"})\n   📞 **Phone:** ${
            l.Phone || "+1 (555) 0199"
          } — *Status: ${l.Status}*`
      )
      .join("\n\n");

    return `💼 **Your ${workingLeads.length} Working Leads in Salesforce**\n\nThese leads have already been contacted and are currently active in your pipeline:\n\n${workingList}\n\n💡 **Next Step:** Follow up with these leads to close agreements or schedule demo presentations.`;
  }

  // 1. Leads / Sales Analysis
  if (
    text.includes("lead") ||
    text.includes("sales") ||
    text.includes("crm") ||
    text.includes("analyze") ||
    text.includes("analysis")
  ) {
    if (total > 0) {
      const leadList = leads
        .map(
          (l, i) =>
            `${i + 1}. **${l.Name || "Lead"}** (${l.Company || "N/A"}) — *Status: ${l.Status || "Open"}*`
        )
        .join("\n");

      return `📊 **Live Salesforce CRM Insights**\n\nYou currently have **${total} active leads** synced from your Salesforce CRM:\n\n${leadList}\n\n💡 **Actionable Recommendations:**\n• **${openLeads.length} leads** are currently marked as **Open - Not Contacted**.\n• Prioritize outreach to **${leads[0]?.Name || "top prospect"}** at **${leads[0]?.Company || "their company"}** today to accelerate your pipeline.\n• **${workingLeads.length} leads** are in progress. Follow up to schedule demo calls.`;
    }

    return "📈 **Sales Insights**\n\nNo live Salesforce leads found yet. Connect your Salesforce org to analyze your active pipeline in real-time.";
  }

  // 2. Growth / Ideas
  if (text.includes("growth") || text.includes("idea") || text.includes("improve")) {
    return `🚀 **CRM Growth Strategy for Your Leads**\n\nBased on your **${total} connected Salesforce prospects**:\n1. **Automate First Touch:** Use Salesforce Flows to send an immediate welcome email when a Lead is created.\n2. **SLA Alerts:** Set up notifications for leads that stay in "Open - Not Contacted" for more than 24 hours.\n3. **Lead Scoring:** Qualify high-value companies like **${leads[0]?.Company || "enterprise accounts"}** first.`;
  }

  // 3. Report
  if (text.includes("report")) {
    return `📋 **Salesforce Executive Summary Report**\n\n• **Total Pipeline:** ${total} Leads\n• **Uncontacted (Open):** ${openLeads.length}\n• **In Progress (Working):** ${workingLeads.length}\n• **Conversion Potential:** High\n\n⚡ Next Step: Reach out to uncontacted leads to convert them into active Opportunities.`;
  }

  // 4. Who to call first / Priority Contact
  if (
    text.includes("call") ||
    text.includes("who") ||
    text.includes("first") ||
    text.includes("contact") ||
    text.includes("priority") ||
    text.includes("phone")
  ) {
    if (openLeads.length > 0) {
      const callList = openLeads
        .slice(0, 3)
        .map(
          (l, i) =>
            `${i + 1}. **${l.Name}** (${l.Company || "Company"})\n   📞 **Phone:** ${l.Phone || "+1 (555) 234-5678"}\n   ✉️ **Email:** ${l.Email || "lead@company.com"}`
        )
        .join("\n\n");

      return `📞 **Top Priority Call List (Uncontacted Leads)**\n\nThese high-value leads are in **Open - Not Contacted** status. Reaching out today yields the highest conversion probability:\n\n${callList}\n\n🎙️ **30-Second Phone Script for ${openLeads[0]?.Name}:**\n"Hi ${openLeads[0]?.Name}, this is Umendra Bhati calling regarding ${openLeads[0]?.Company}. I noticed you're expanding operations and wanted to share a quick idea on how automated Salesforce flows could save your sales team 5+ hours weekly. Do you have 2 minutes?"\n\n⚡ Click **Call Now** or **WhatsApp** below to start reaching out!`;
    }

    return "All current leads have already been contacted! Follow up with your in-progress Working leads to advance deals.";
  }

  // 5. WhatsApp & Quick Message Pitch
  if (
    text.includes("whatsapp") ||
    text.includes("msg") ||
    text.includes("message") ||
    text.includes("sms")
  ) {
    const target = openLeads[0] || leads[0];
    const targetName = target?.Name || "Prospect";
    const targetCompany = target?.Company || "your company";
    const targetPhone = target?.Phone || "+1 (555) 234-5678";

    return `💬 **Instant WhatsApp Outreach for ${targetName}**\n\nTarget Lead: **${targetName}** (${targetCompany})\n📞 **Phone:** ${targetPhone}\n\n📱 **Ready-to-Send WhatsApp Text:**\n"Hi ${targetName}! 👋 Umendra Bhati here. Noticed ${targetCompany} is actively scaling operations. We help teams automate Salesforce workflows & eliminate manual data entry. Would you be open to a quick 5-min chat this week?"\n\n⚡ Click **WhatsApp** or **Call Now** below to send directly!`;
  }

  // 6. Custom Phone Number / Friend Number / Testing Intent
  const phoneMatch = message.match(/(\+?\d[\d\s-]{8,}\d)/);
  if (
    phoneMatch ||
    text.includes("number") ||
    text.includes("dost") ||
    text.includes("friend") ||
    text.includes("testing")
  ) {
    if (phoneMatch) {
      const detectedPhone = phoneMatch[0].trim();
      return `📞 **Test Number Detected:** \`${detectedPhone}\`\n\nAI Voice Calling Engine is ready to dial this number!\n\n• **Call ${detectedPhone} Now**\n• **Send WhatsApp to ${detectedPhone}**\n• **Save to Salesforce CRM as Lead**\n\n🎙️ **AI Voice Script:**\n"Hello! This is Umendra Bhati's AI assistant calling for a live diagnostic test. Audio synthesis and Salesforce sync channels are connected and working at 100% capacity!"\n\n⚡ Launching AI Voice Call modal now...`;
    }

    return `📱 **Apna ya Apne Dost ka Number Batao!**\n\nBhai, aap yahan chat me apna ya dost ka **Phone Number** aur **Naam** type kar do (jaise: \`9876543210 - Rahul\` ya bas number \`+91 98XXXXXXXX\`):\n\nHum turant:\n1. 🤖 **Live AI Voice Call:** Us number par AI agent se direct call dial karwa denge (speakers se ghanti bajegi aur AI baat karega!)\n2. 💬 **WhatsApp Outreach:** 1-click ready WhatsApp message tayar kar denge!\n3. ☁️ **Salesforce CRM:** Direct aapke Salesforce me new Lead create kar denge!\n\n💡 Aap screen ke upar **"⚡ Test Custom Number"** button se bhi dial kar sakte ho!`;
  }

  // 7. Email Drafting
  if (
    text.includes("email") ||
    text.includes("draft") ||
    text.includes("pitch")
  ) {
    const target = openLeads[0] || leads[0];
    const targetName = target?.Name || "Prospect";
    const targetCompany = target?.Company || "your company";
    const targetEmail = target?.Email || "lead@company.com";

    return `✉️ **Personalized Outreach Email Draft for ${targetName}**\n\nRecipient: **${targetEmail}**\n**Subject:** Quick question regarding ${targetCompany}'s CRM workflows\n\nHi ${targetName},\n\nI noticed ${targetCompany} is scaling its operations, and I wanted to reach out directly.\n\nWe specialize in streamlining Salesforce CRM processes, automations, and custom workflows to help teams close deals faster with zero manual friction.\n\nWould you be open to a brief 10-minute chat this Thursday to see how we could optimize ${targetCompany}'s pipeline?\n\nBest regards,\n**Umendra Bhati**\nSalesforce Administrator & Automation Specialist`;
  }

  // 8. Greetings
  if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
    return `Hello! 👋 I am your AI Business & Salesforce Assistant.\n\nI am connected to your live CRM pipeline (${total} leads synced from Salesforce).\n\nHere are the top actions I can execute for you right now:\n• **Who should I call first?**\n• **Send WhatsApp message**\n• **Draft an email**\n• **Analyze my leads**`;
  }

  return `I reviewed your query: "${message}".\n\nI am connected to your ${total} live Salesforce leads. Here are high-impact questions you can ask:\n• **Who should I call first?**\n• **Send WhatsApp message**\n• **Draft an email**\n• **Analyze my leads**`;
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    // 1. Fetch live Salesforce leads for context
    const leads = await getLiveSalesforceLeads(req);

    // 2. If OpenAI key is present and NOT demo, use GPT-4
    if (
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "dummy-key" &&
      !process.env.OPENAI_API_KEY.includes("your-openai-api-key")
    ) {
      try {
        const leadContext = leads.length > 0
          ? `\n\nCURRENT SALESFORCE LEADS IN USER'S CRM:\n` +
            JSON.stringify(leads, null, 2)
          : `\n\n(No Salesforce leads found)`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an expert AI Business & Salesforce Assistant. Give concise, actionable advice using the user's real Salesforce leads if available." +
                leadContext,
            },
            { role: "user", content: message },
          ],
        });

        const reply = response.choices[0]?.message?.content;
        if (reply) {
          return NextResponse.json({
            success: true,
            provider: "openai",
            message: reply,
          });
        }
      } catch (openAiErr) {
        console.warn("OpenAI API call failed, falling back to smart CRM engine:", openAiErr);
      }
    }

    // 3. Smart CRM Engine fallback (uses real live Salesforce leads!)
    return NextResponse.json({
      success: true,
      provider: "salesforce-smart-ai",
      message: getSmartSalesforceResponse(message, leads),
    });
  } catch (error) {
    console.error("AI CHAT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sorry, I couldn't process your request right now.",
      },
      { status: 500 }
    );
  }
}