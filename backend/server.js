import express from "express";
import cors from "cors";
import https from "https";

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// GET: Top Products
// =========================
app.get("/api/top-products", (req, res) => {
  try {
    const topProducts = [
      { name: "Smart Dog Collar", category: "Pet Accessories", sales: 2500 },
      { name: "Organic Pet Shampoo", category: "Pet Care", sales: 2200 },
      { name: "Interactive Feeder", category: "Pet Supplies", sales: 1800 },
      { name: "Premium Dog Food", category: "Food", sales: 1600 },
      { name: "Cat Scratching Post", category: "Furniture", sales: 1400 },
      { name: "Bird Cage Deluxe", category: "Bird Supplies", sales: 1200 }
    ];
    return res.json({ success: true, data: topProducts });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch top products" });
  }
});

// =========================
// GET: Marketing Trends
// =========================
app.get("/api/marketing-trends", (req, res) => {
  try {
    const trends = [
      "Short-form video ads for local brands",
      "Conversational AI for commerce",
      "Sustainability-driven product lines",
      "Hyperlocal targeting in tier-2 cities",
      "Email-first re-engagement campaigns",
      "Micro-influencer collaborations"
    ];
    return res.json({ success: true, data: trends });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// =========================
// POST: Fetch Verified Email
// =========================
app.post("/fetch-email", (req, res) => {
  const user_json_url = req.body.url;

  if (!user_json_url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  https
    .get(user_json_url, (apiRes) => {
      let data = "";

      apiRes.on("data", (chunk) => {
        data += chunk;
      });

      apiRes.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          const email = jsonData.user_email_id;

          console.log("Verified email:", email);

          return res.json({ email });
        } catch (err) {
          return res.status(500).json({ error: "JSON Parse Error" });
        }
      });
    })
    .on("error", (err) => {
      console.log("Error:", err.message);
      res.status(500).json({ error: "Failed to fetch data" });
    });
});

// =========================
// Start Server
// =========================
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
