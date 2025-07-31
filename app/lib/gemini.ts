export async function sendToGemini(message: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const body = {
        contents: [
            {
                parts: [{ text: message }],
            },
        ],
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                "X-goog-api-key": apiKey || "",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        console.log("Respuesta completa de Gemini:", data);

        if (!data?.candidates || data.candidates.length === 0) {
            return "Gemini no devolvió candidatos de respuesta. Verifica tu clave o acceso.";
        }

        return data.candidates[0]?.content?.parts?.[0]?.text || "Sin texto de respuesta.";
    } catch (error) {
        console.error("Error al comunicarse con Gemini:", error);
        return "Error en la conexión con Gemini.";
    }
}
