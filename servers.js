export const config = {
  runtime: "edge",
};

// 🔗 API ต้นทาง
const SOURCE_API_URL = "https://api-one-theta-96.vercel.app/api/data";

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  try {
    const res = await fetch(SOURCE_API_URL, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "ServerFinder-Hop/1.0",
      },
    });

    if (!res.ok) {
      return errorResponse(`Upstream error: ${res.status}`, 502);
    }

    const json = await res.json();

    // กรอง server เต็มออกเลยที่ฝั่ง API (ลด payload ที่ส่งไป client)
    const data = (json.data ?? json).filter(
      (s) => s.player_count < s.max_players
    );

    return new Response(
      JSON.stringify({ status: "success", data, cached_at: new Date().toISOString() }),
      {
        status: 200,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json",
          // Cache ที่ edge 1 วิ (ช่วยลด rate-limit ถ้ามีหลาย client)
          "Cache-Control": "s-maxage=1, stale-while-revalidate=2",
        },
      }
    );
  } catch (err) {
    return errorResponse("Failed to fetch upstream: " + err.message, 500);
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function errorResponse(message, status = 500) {
  return new Response(JSON.stringify({ status: "error", message }), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}
