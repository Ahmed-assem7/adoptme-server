import express from "express"
import cors from "cors"
import OpenAI from "openai"

const app = express()
app.use(cors())
app.use(express.json())

// OpenAI reads OPENAI_KEY automatically from Railway env
const openai = new OpenAI()

let players = {}

// Roblox sends data here
app.post("/api/roblox", (req, res) => {
  players[req.body.username] = req.body
  res.send({ status: "saved" })
})

// Debug endpoint
app.get("/api/test", (req, res) => {
  res.json(players)
})

// AI profile endpoint
app.get("/api/profile/:name", async (req, res) => {
  const player = players[req.params.name]
  if (!player) return res.json({ error: "No data yet" })

  const prompt = `
You are a soft gothic cute Adopt Me profile analyzer.

Player data:
${JSON.stringify(player)}

Return JSON with:
- vibe
- progressScore (0–100)
- flexLevel (Low, Medium, High, Insane)
- personality
`

  try {
    const ai = await openai.responses.create({
      model: "gpt-5.2",
      input: prompt
    })

    const text = ai.output_text
    res.json(JSON.parse(text))
  } catch (err) {
    res.json({ error: "AI failed", details: err.message })
  }
})

// Railway requires process.env.PORT
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on", PORT)
})
