const knowledge = [
{
    title: "Outlook Authentication Issues",
    keywords: ["outlook", "email", "password", "exchange"],
    cause: "Cached or corrupt credentials.",
    resolution: [
        "Close Outlook",
        "Open Credential Manager",
        "Remove Microsoft credentials",
        "Restart Outlook",
        "Sign back in"
    ],
    escalation: "Seniors"
},
{
    title: "VPN Connection Failure",
    keywords: ["vpn", "forticlient", "remote"],
    cause: "Internet issue or expired credentials.",
    resolution: [
        "Verify internet access",
        "Confirm VPN credentials",
        "Reset MFA token",
        "Reconnect"
    ],
    escalation: "Seniors"
},
{
    title: "Locked Account",
    keywords: ["locked", "account", "login"],
    cause: "Too many failed login attempts.",
    resolution: [
        "Unlock account",
        "Reset password",
        "Confirm MFA registration",
        "Test sign in"
    ],
    escalation: "AIM"
}
];

function addMessage(text, sender) {
    const chat = document.getElementById("chat");

    const div = document.createElement("div");
    div.className = sender;
    div.innerHTML = text;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function askBot() {
    const box = document.getElementById("question");
    const query = box.value.toLowerCase().trim();

    if (!query) return;

    const originalQuestion = box.value;

    addMessage(originalQuestion, "user");

    box.value = "";
    box.focus();

    let match = null;

    for (let article of knowledge) {
        if (
            article.keywords.some(keyword =>
                query.includes(keyword.toLowerCase())
            )
        ) {
            match = article;
            break;
        }
    }

    if (match) {

        let steps = "";

        match.resolution.forEach(step => {
            steps += `<li>${step}</li>`;
        });

        const response = `
            <strong>Issue:</strong> ${match.title}<br><br>

            <strong>Probable Cause:</strong><br>
            ${match.cause}<br><br>

            <strong>Resolution:</strong>
            <ol>${steps}</ol>

            <strong>Escalate To:</strong><br>
            ${match.escalation}
        `;

        addMessage(response, "bot");

    } else {

        addMessage(`
            <strong>No knowledge article found.</strong><br><br>

            Please gather:

            <ul>
                <li>Exact error message</li>
                <li>Application affected</li>
                <li>User impact</li>
                <li>Recent changes</li>
            </ul>
        `, "bot");
    }
}

function runCommand(command) {

    if (command === "clear") {
        document.getElementById("chat").innerHTML = `
            <div class="bot">
                Hello! Describe the issue and I'll search my knowledge base.
            </div>
        `;
        return;
    }

    if (command === "help") {
        addMessage(`
            <strong>Available Commands</strong>
            <ul>
                <li>🗑️ Clear Chat</li>
                <li>📚 Show Articles</li>
                <li>ℹ️ Show Version</li>
            </ul>
        `, "bot");
        return;
    }

    if (command === "list") {

        let html = "<strong>Knowledge Articles:</strong><ul>";

        knowledge.forEach(article => {
            html += `<li>${article.title}</li>`;
        });

        html += "</ul>";

        addMessage(html, "bot");
        return;
    }

    if (command === "version") {
        addMessage("🤖 Yamin's Service Desk Assistant v1.0", "bot");
        return;
    }
}

window.onload = function () {

    const questionBox = document.getElementById("question");

    questionBox.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            event.preventDefault();
            askBot();
        }

    });

    questionBox.focus();

};

function quickIssue(issue) {

    document.getElementById("question").value = issue;

    askBot();
}
