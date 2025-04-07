async function generateResponse() {
    const userInput = document.getElementById("userInput").value.toLowerCase();
    
    // Simulación de respuestas dinámicas
    const responses = {
        "hola": "¡Hola! ¿Cómo estás?",
        "¿quién eres?": "Soy Copilot 2.0, tu asistente digital.",
        "cuéntame un chiste": "¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas.",
        "¿cómo estás?": "¡Estoy genial! Siempre listo para ayudarte."
    };

    let response = responses[userInput] || "Hmm... eso es interesante. Déjame pensar.";

    document.getElementById("response").innerText = response;
}
