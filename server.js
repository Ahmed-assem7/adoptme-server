import express from "express"
import cors from "cors"
import OpenAI from "openai"

const app = express()
app.use(cors())
app.use(express.json())

// Make sure Railway has OPENAI_API_KEY set
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY environment variable")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

let players = {}

// Roblox sends data here
app.post("/api/roblox", (req, res) => {
  const data = req.body
  if (!data.username) {
    return res.status(400).send({ error: "Missing username" })
  }

  players[data.username.toLowerCase()] = data
  console.log("Saved:", data.username)

  res.send({ status: "saved" })
})

// Debug endpoint
app.get("/api/test", (req, res) => {
  res.send(players)
})

// AI profile endpoint
app.get("/api/profile/:name", async (req, res) => {
  const name = req.params.name.toLowerCase()
  const player = players[name]

  if (!player) {
    return res.send({ error: "No data yet. Join the Roblox game first." })
  }

  const prompt = `
You are a soft gothic cute Adopt Me profile analyzer.

Player data:
${JSON.stringify(player)}

Return JSON with:
vibe
progressScore (0–100)
flexLevel (Low, Medium, High, Insane)
personality
`

  try {
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })

    const text = ai.choices[0].message.content

    // Try to parse AI JSON safely
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      return res.send({ error: "AI returned invalid JSON", raw: text })
    }

    res.send(parsed)

  } catch (err) {
    console.error("AI ERROR:", err.message)
    res.status(500).send({ error: "AI failed", details: err.message })
  }
})

// VERY IMPORTANT: Railway port
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on port", PORT)
