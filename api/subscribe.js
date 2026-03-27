export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, streak, totalListens } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Missing email" });
  }

  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formID = "9188590";
  const tagID  = "17331161";

  try {
    const ckRes = await fetch(
      `https://api.convertkit.com/v3/forms/${formID}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          email,
          tags: [tagID],
          fields: {
            source:            "sitfirst_app",
            app_streak:        String(streak       ?? 0),
            app_total_listens: String(totalListens ?? 0),
          },
        }),
      }
    );
    const data = await ckRes.json();
    if (!ckRes.ok) return res.status(502).json({ error: "ConvertKit error", detail: data });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
