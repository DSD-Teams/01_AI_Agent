import e from "express";
import chat from "./answer.js";
import cors from "cors";
const app = e();

app.use(cors());
app.use(e.json());

app.post("/api", async (req, res) => {
  try {
    const input = req.body.input;

    if (!input) {
      return res.status(400).send("Missing 'input' field");
    }

    const reply = await chat(input); // ✅ Wait for the AI response

    res.json({ reply });              // ✅ Send the actual message text
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while processing request");
  }
});

app.listen(1234, () => {
  console.log("server is running on port 1234");
});
