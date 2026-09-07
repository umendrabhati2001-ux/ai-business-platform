import { NextRequest, NextResponse } from "next/server";

type SalesforceError = {
  message?: string;
  errorCode?: string;
};

// Define the shape of the Salesforce Lead
type SalesforceLead = {
  Id: string;
  Name: string;
  Company: string;
  Email: string | null;
  Phone: string | null;
  Status: string;
};

function getSalesforceConnection(request: NextRequest) {
  const accessToken = request.cookies.get(
    "salesforce_access_token"
  )?.value;

  const instanceUrl = request.cookies.get(
    "salesforce_instance_url"
  )?.value;

  return {
    accessToken,
    instanceUrl,
  };
}

// ================================
// GET LEADS
// ================================
export async function GET(request: NextRequest) {
  try {
    const { accessToken, instanceUrl } = getSalesforceConnection(request);

    if (!accessToken || !instanceUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Salesforce connection is missing or expired. Please connect Salesforce.",
        },
        { status: 401 }
      );
    }

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
      LIMIT 50
    `;

    const salesforceUrl =
      `${instanceUrl}/services/data/v60.0/query/?q=` +
      encodeURIComponent(soql);

    const response = await fetch(salesforceUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Salesforce GET Leads Error:", data);

      return NextResponse.json(
        {
          success: false,
          error:
            data?.[0]?.message || "Failed to fetch Salesforce leads",
          details: data,
        },
        { status: response.status }
      );
    }

    // FIXED: Replaced 'any' with 'SalesforceLead' type
    const leads = (data.records || []).map(
      (lead: SalesforceLead) => ({
        id: lead.Id,
        name: lead.Name,
        company: lead.Company,
        email: lead.Email,
        phone: lead.Phone,
        status: lead.Status,
      })
    );

    return NextResponse.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Salesforce GET Leads Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while fetching Salesforce leads",
      },
      { status: 500 }
    );
  }
}

// ================================
// CREATE LEAD
// ================================
export async function POST(request: NextRequest) {
  try {
    const { accessToken, instanceUrl } = getSalesforceConnection(request);

    if (!accessToken || !instanceUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Salesforce connection is missing or expired.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const company = String(body.company || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const status = String(body.status || "").trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead name is required",
        },
        { status: 400 }
      );
    }

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: "Company is required",
        },
        { status: 400 }
      );
    }

    // Split full name into FirstName + LastName
    const nameParts = name.split(/\s+/);

    const lastName =
      nameParts.length > 1
        ? nameParts[nameParts.length - 1]
        : nameParts[0];

    const firstName =
      nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "";

    const leadData: Record<string, string> = {
      LastName: lastName,
      Company: company,
    };

    if (firstName) {
      leadData.FirstName = firstName;
    }

    if (email) {
      leadData.Email = email;
    }

    if (phone) {
      leadData.Phone = phone;
    }

    if (status) {
      leadData.Status = status;
    }

    const response = await fetch(
      `${instanceUrl}/services/data/v60.0/sobjects/Lead`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(leadData),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Salesforce CREATE Lead Error:", data);

      const message =
        Array.isArray(data) && data[0]?.message
          ? data[0].message
          : "Failed to create Salesforce lead";

      return NextResponse.json(
        {
          success: false,
          error: message,
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead created successfully",
      id: data.id,
    });
  } catch (error) {
    console.error("Salesforce CREATE Lead Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while creating the lead",
      },
      { status: 500 }
    );
  }
}

// ================================
// UPDATE LEAD
// ================================
export async function PATCH(request: NextRequest) {
  try {
    const { accessToken, instanceUrl } = getSalesforceConnection(request);

    if (!accessToken || !instanceUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Salesforce connection is missing or expired.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead ID is required",
        },
        { status: 400 }
      );
    }

    const leadData: Record<string, string> = {};

    if (body.name) {
      const name = String(body.name).trim();

      const nameParts = name.split(/\s+/);

      const lastName =
        nameParts.length > 1
          ? nameParts[nameParts.length - 1]
          : nameParts[0];

      const firstName =
        nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "";

      leadData.LastName = lastName;

      if (firstName) {
        leadData.FirstName = firstName;
      }
    }

    if (body.company !== undefined) {
      leadData.Company = String(body.company).trim();
    }

    if (body.email !== undefined) {
      leadData.Email = String(body.email).trim();
    }

    if (body.phone !== undefined) {
      leadData.Phone = String(body.phone).trim();
    }

    if (body.status !== undefined) {
      leadData.Status = String(body.status).trim();
    }

    const response = await fetch(
      `${instanceUrl}/services/data/v60.0/sobjects/Lead/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(leadData),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const data = (await response.json()) as SalesforceError[];

      console.error("Salesforce UPDATE Lead Error:", data);

      return NextResponse.json(
        {
          success: false,
          error:
            data?.[0]?.message || "Failed to update Salesforce lead",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully",
    });
  } catch (error) {
    console.error("Salesforce UPDATE Lead Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while updating the lead",
      },
      { status: 500 }
    );
  }
}

// ================================
// DELETE LEAD
// ================================
export async function DELETE(request: NextRequest) {
  try {
    const { accessToken, instanceUrl } = getSalesforceConnection(request);

    if (!accessToken || !instanceUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Salesforce connection is missing or expired.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead ID is required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${instanceUrl}/services/data/v60.0/sobjects/Lead/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const data = (await response.json()) as SalesforceError[];

      console.error("Salesforce DELETE Lead Error:", data);

      return NextResponse.json(
        {
          success: false,
          error:
            data?.[0]?.message || "Failed to delete Salesforce lead",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Salesforce DELETE Lead Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while deleting the lead",
      },
      { status: 500 }
    );
  }
}
