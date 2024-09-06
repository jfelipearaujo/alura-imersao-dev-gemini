window.onload = function () {
    var apiKey = localStorage.getItem("API_KEY");

    if (apiKey) {
        localStorage.setItem("API_KEY", "");
    }

    var modal = document.getElementById("modal");

    var closeButton = document.querySelector(".close-button");

    modal.style.display = "block";

    closeButton.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
};

var saveApiKeyButton = document.getElementById("save-api-key-btn");

saveApiKeyButton.addEventListener("click", function () {
    var apiKey = document.getElementById("api-key").value;

    if (apiKey) {
        localStorage.setItem("API_KEY", apiKey);
        document.querySelector(".close-button").click();
    }
});

var searchButton = document.getElementById("search-btn");
searchButton.disabled = false;

searchButton.addEventListener("click", function () {
    var searchValue = document.getElementById("search-prompt").value;

    if (searchValue) {
        var apiKey = document.getElementById("api-key").value;

        if (!apiKey) {
            alert("Por favor, informe sua API Key");
            location.reload();
        }

        prompt = {
            system_instruction: {
                parts: {
                    text: "Você é um assistente de pesquisa que responde a perguntas apenas sobre a linguagem Go Lang. Interprete as perguntas aplicando em Go Lang. Retorne os dados sempre em HTML, sem dados de Markdown ou JSON. Quando for exigir exemplos de código coloque o conteúdo entre dentro de uma tag chamada <pre>."
                }
            },
            contents: {
                parts: {
                    text: searchValue
                },
            }
        };

        searchButton.disabled = true;

        window.fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: [
                ["Content-Type", "application/json"]
            ],
            body: JSON.stringify(prompt)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            searchButton.disabled = false;

            data = data.candidates[0].content.parts[0].text;
            data = data.replace(/```html/g, "");
            data = data.replace(/```/g, "");

            var searchResult = document.getElementById("search-result");

            searchResult.innerHTML = data;
        });
    }
});