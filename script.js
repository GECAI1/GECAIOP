async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const message = userInput.value;
    if (message.trim() === "") return;

    // Affiche le message de l'utilisateur dans la boîte de discussion
    displayMessage(message, "user");

    // Vide le champ de saisie
    userInput.value = "";

    // Affiche un message de type "en cours de traitement"
    const processingMessageId = displayMessage("En cours de traitement...", "ai");

    try {
        // Obtenir la réponse de GECAI
        const aiResponse = await getAIResponse(message);

        // Remplace le message de type "en cours de traitement" par la réponse de GECAI
        updateMessage(processingMessageId, aiResponse, "ai");
    } catch (error) {
        console.error("Error fetching AI response:", error);
        // Remplace le message de type "en cours de traitement" par un message générique
        updateMessage(processingMessageId, "Je n'ai pas pu comprendre votre demande. Essayez encore.", "ai");
    }
}

// Fonction pour afficher un message dans la boîte de discussion
function displayMessage(message, sender) {
    const chatbox = document.getElementById("chatbox");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = (sender === "user" ? "Toi: " : "GECAI: ") + message;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;

    return messageElement;
}

// Fonction pour mettre à jour un message existant dans la boîte de discussion
function updateMessage(messageElement, newMessage, sender) {
    messageElement.textContent = (sender === "user" ? "Toi: " : "GECAI: ") + newMessage;
}

// Fonction pour obtenir une réponse de GECAI
async function getAIResponse(message) {
    const apiKey = "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";  // <-- Remplace avec ta clé API

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
                max_tokens: 150
            })
        });

        // Afficher le code de statut et le corps de la réponse pour débogage
        console.log("Response Status:", response.status);
        const responseBody = await response.text();
        console.log("Response Body:", responseBody);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = JSON.parse(responseBody);
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Je n'ai pas pu comprendre votre demande. Essayez encore.";
    }
}
