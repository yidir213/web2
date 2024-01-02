// Sélectionner les éléments du DOM
const form = document.getElementById("form-csv");
const input = document.getElementById("input-csv");
const button = document.getElementById("button-submit");
const result = document.getElementById("result");

// Créer une requête HTTP
const xhr = new XMLHttpRequest();

function displayPrediction(prediction) {
    const predictionResult = document.getElementById("prediction-result");
    predictionResult.textContent = "La prédiction est : " + prediction;
}

// Gérer l'événement submit du formulaire
form.addEventListener("submit", function(e) {
    // Empêcher le comportement par défaut du formulaire
    e.preventDefault();
    // Récupérer le fichier CSV
    const file = input.files[0];
    // Créer un objet FormData
    const formData = new FormData();
    // Ajouter le fichier CSV au FormData
    formData.append("csv_file", file);
    // Ouvrir la requête HTTP avec la méthode POST et l'URL de l'API
    xhr.open("POST", config.train_api );
    // Envoyer le FormData à l'API
    xhr.send(formData);
});

// Gérer l'événement load de la requête HTTP
xhr.addEventListener("load", function() {
    // Vérifier le statut de la réponse
    if (xhr.status === 200) {
        // Récupérer la réponse de l'API
        const response = xhr.responseText;
        // Parser la réponse si elle est au format JSON
        const data = JSON.parse(response);
        // Afficher l'accuracy renvoyée par l'API
        result.textContent = "L'accuracy est de " + data.accuracy ;
    } else {
        // Afficher un message d'erreur
        result.textContent = "Une erreur est survenue : " + xhr.statusText;
    }
});

const value1 = document.getElementById("value1");
const value2 = document.getElementById("value2");
const value3 = document.getElementById("value3");
const value4 = document.getElementById("value4");
const predictButton = document.getElementById("button-predict");

// Add event listener for predict button
predictButton.addEventListener("click", function() {
    // Get values entered by the user
    const val1 = parseFloat(value1.value);
    const val2 = parseFloat(value2.value);
    const val3 = parseFloat(value3.value);
    const val4 = parseFloat(value4.value);

    // Create an array from the entered values
    const valuesArray = [[val1, val2, val3, val4]];

    // Create a data object to send to the API
    const data = {
        toPred: valuesArray
    };

    // Create an XMLHttpRequest to send the values to the API
    const predictXhr = new XMLHttpRequest();
    predictXhr.open("POST", config.predict_api);
    predictXhr.setRequestHeader("Content-Type", "application/json");
    predictXhr.send(JSON.stringify(data));

    // Handle the response
    predictXhr.addEventListener("load", function() {
        if (predictXhr.status === 200) {
            const response = JSON.parse(predictXhr.responseText);
            const prediction = response.predicted;
            displayPrediction(prediction);
            document.getElementById("prediction-result").textContent = "La prédiction est : " + prediction;
        } else {
            document.getElementById("result").textContent = "Erreur : " + JSON.parse(predictXhr.responseText).error;
        }
    });
});