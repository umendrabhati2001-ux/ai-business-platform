import { NextRequest, NextResponse } from "next/server";

type SalesforceLead = {
  Id: string;
  Name: string;
  Company: string;
  Email: string | null;
  Phone: string | null;
  Status: string;
};

type SalesforceResponse = {
  records: SalesforceLead[];
  totalSize: number;
  done: boolean;
};

export async function GET(request: NextRequest) {
  try {
    // Get Salesforce cookies
    const accessToken = request.cookies.get(
      "salesforce_access_token"
    )?.value;

    const instanceUrl = request.cookies.get(
      "salesforce_instance_url"
    )?.value;

    // Debug information
    console.log("SALESFORCE LEADS COOKIE CHECK:", {
      hasAccessToken: !!accessToken,
      hasInstanceUrl: !!instanceUrl,
      instanceUrl: instanceUrl || null,
    });

    // Check connection
    if (!accessToken || !instanceUrl) {
      console.error(
        "SALESFORCE LEADS ERROR: Missing Salesforce cookies"
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Salesforce connection is missing or expired. Please connect Salesforce.",
          hasAccessToken: !!accessToken,
          hasInstanceUrl: !!instanceUrl,
        },
        { status: 401 }
      );
    }

    // Salesforce SOQL query
    const soql = `
      SELECT
        Id,
        Name,
        Company,
        Email,
        Phone,
        Status
      FROM Lead
      ORDER BY CreatedDate DESC
      LIMIT 5
    `;

    // Salesforce API URL
    const salesforceUrl =
      `${instanceUrl}/services/data/v60.0/query/?q=` +
      encodeURIComponent(soql);

    console.log(
      "SALESFORCE LEADS REQUEST:",
      salesforceUrl
    );

    // Call Salesforce
    const response = await fetch(salesforceUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = (await response.json()) as
      | SalesforceResponse
      | {
          error?: string;
          error_description?: string;
        };

    console.log("SALESFORCE LEADS RESPONSE:", {
      ok: response.ok,
      status: response.status,
      hasRecords:
        "records" in data && Array.isArray(data.records),
    });

    // Salesforce API error
    if (!response.ok) {
      console.error(
        "Salesforce Leads API Error:",
        data
      );

      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch Salesforce leads",
          details: data,
        },
        { status: response.status }
      );
    }

    // Make sure records exist
    const records =
      "records" in data && Array.isArray(data.records)
        ? data.records
        : [];

    // Format leads for frontend
    const leads = records.map(
      (lead: SalesforceLead) => ({
        id: lead.Id,
        name: lead.Name,
        company: lead.Company,
        email: lead.Email,
        phone: lead.Phone,
        status: lead.Status,
      })
    );

    console.log(
      `SALESFORCE LEADS SUCCESS: ${leads.length} leads loaded`
    );

    return NextResponse.json({
      success: true,
      leads,
      totalSize:
        "totalSize" in data
          ? data.totalSize
          : leads.length,
    });
  } catch (error) {
    console.error(
      "Salesforce Leads Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while fetching Salesforce leads",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, phone, status } = body;

    if (!name || !company) {
      return NextResponse.json(
        { success: false, error: "Name and Company are required" },
        { status: 400 }
      );
    }

    const accessToken = request.cookies.get("salesforce_access_token")?.value;
    const instanceUrl = request.cookies.get("salesforce_instance_url")?.value;

    const parts = name.trim().split(" ");
    const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : "";
    const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0];

    if (accessToken && instanceUrl) {
      const sfUrl = `${instanceUrl}/services/data/v60.0/sobjects/Lead`;
      const sfPayload: Record<string, string> = {
        LastName: lastName,
        Company: company,
        Status: status || "Open - Not Contacted",
      };
      if (firstName) sfPayload.FirstName = firstName;
      if (email) sfPayload.Email = email;
      if (phone) sfPayload.Phone = phone;

      const sfRes = await fetch(sfUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sfPayload),
      });

      const sfData = await sfRes.json();
      if (!sfRes.ok) {
        console.error("SALESFORCE CREATE LEAD ERROR:", sfData);
        return NextResponse.json(
          {
            success: false,
            error: "Salesforce rejected lead creation",
            details: sfData,
          },
          { status: sfRes.status }
        );
      }

      return NextResponse.json({
        success: true,
        id: sfData.id,
        message: "Lead created successfully in Salesforce!",
        source: "salesforce",
      });
    }

    return NextResponse.json({
      success: true,
      id: `lead-local-${Date.now()}`,
      message: "Lead saved (Salesforce credentials not found)",
      source: "local",
    });
  } catch (error) {
    console.error("CREATE LEAD API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Lead ID and Status are required" },
        { status: 400 }
      );
    }

    const accessToken = request.cookies.get("salesforce_access_token")?.value;
    const instanceUrl = request.cookies.get("salesforce_instance_url")?.value;

    if (accessToken && instanceUrl && !id.startsWith("lead-local-")) {
      const sfUrl = `${instanceUrl}/services/data/v60.0/sobjects/Lead/${id}`;
      const sfRes = await fetch(sfUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Status: status }),
      });

      if (!sfRes.ok && sfRes.status !== 204) {
        const sfData = await sfRes.json().catch(() => ({}));
        console.error("SALESFORCE UPDATE LEAD ERROR:", sfData);
        return NextResponse.json(
          {
            success: false,
            error: "Salesforce rejected lead update",
            details: sfData,
          },
          { status: sfRes.status }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Lead status updated to ${status} in Salesforce!`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Lead status updated locally`,
    });
  } catch (error) {
    console.error("UPDATE LEAD API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}