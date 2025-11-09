import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


async function chat(input) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini", // or "gpt-4-turbo"
            messages: [
                { role: "system", content: "You are a helpful chatbot." },
                { role: "user", content: input },
            ],
        });

        // ✅ use `res`, not `response`
        return aiResponse.choices[0].message.content
    } catch (error) {
        console.error(error);
        return "Error while communicating with OpenAI"
    }
}
export default chat;
