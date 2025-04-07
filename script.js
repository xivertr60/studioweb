async function generateResponse() {
    const userInput = document.getElementById("userInput").value;
    const apiKey = "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"; // ⚠️ No publiques esta clave en GitHub

    const url = "https://api.openai.com/v1/completions";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: userInput,
                max_tokens: 100
            })
        });

        const data = await response.json();
        document.getElementById("response").innerText = data.choices[0].text;
    } catch (error) {
        console.error("Error al obtener la respuesta:", error);
        document.getElementById("response").innerText = "Ups, algo salió mal.";
    }
}
