
const apiKey = "AIzaSyArI6FaHC0KSr1oGlz4WPaOw65xrW0Zbsw";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            console.error(await response.text());
            return;
        }
        const data = await response.json();
        const models = data.models || [];
        console.log("Found models:", models.length);
        models.forEach(m => {
            console.log(`- ${m.name} (${m.version}) [${m.supportedGenerationMethods?.join(", ")}]`);
        });
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

listModels();
