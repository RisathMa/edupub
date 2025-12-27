import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyArI6FaHC0KSr1oGlz4WPaOw65xrW0Zbsw";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Checking available models for API Key...");
        // For listing models, we don't need a specific model instance, 
        // but the SDK structure usually assumes getting a model. 
        // However, the current SDK version might simplify this differently. 
        // Let's try a direct approach if the SDK exposes it, or just try to generate with a fallback model.

        // Actually, let's just try to generate simple content with a few common model names to see which one sticks.
        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-pro",
            "gemini-pro"
        ];

        for (const modelName of modelsToTry) {
            console.log(`\nTesting model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ SUCCESS: ${modelName} is working!`);
                console.log("Response:", result.response.text());
                return; // Valid model found
            } catch (error) {
                console.log(`❌ FAILED: ${modelName}`);
                console.log(`Error: ${error.message.split('\n')[0]}`); // Print just the first line of error
            }
        }

        console.log("\n❌ All common models failed.");
    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

listModels();
