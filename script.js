// Sélectionner les éléments du DOM
const form = document.getElementById("form-csv");
const input = document.getElementById("input-csv");
const button = document.getElementById("button-submit");
const result = document.getElementById("result");
const modelSelect = document.getElementById("model-select");                                                            //added this

document.querySelectorAll('.dropdown .items a').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('.dropdown-title').textContent = this.textContent;
    });
});


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

    // Add the selected model to your FormData                                                                         //added these 3 lines
    const selectedModel = modelSelect.value;
    formData.append("model", selectedModel);

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



const dropdown = document.querySelector('.dropdown');                                                                       //added these
const placeholder = document.querySelector('.dropdown-placeholder');

dropdown.addEventListener('click', () => {
    dropdown.classList.toggle('active');

    if (dropdown.classList.contains('active')) {
        placeholder.style.height = '600px';
    } else {
        placeholder.style.height = '0';
    }
});



const value1 = document.getElementById("value1");
const value2 = document.getElementById("value2");
const value3 = document.getElementById("value3");
const value4 = document.getElementById("value4");
const value5 = document.getElementById("value5");
const value6 = document.getElementById("value6");
const value7 = document.getElementById("value7");
const value8 = document.getElementById("value8");
const value9 = document.getElementById("value9");
const value10 = document.getElementById("value10");
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



document.getElementById('addParam').addEventListener('click', addParameter);


var parameterCount = 1; // Start from 4, assuming 4 parameters already exist

function addParameter() {
    parameterCount++;

    var container = document.getElementById('paramContainer');
    var input = document.createElement('input');
    input.type = 'number';
    input.name = 'dynamicParameter[]';
    input.id = 'value' + parameterCount;
    input.placeholder = 'Parameter ' + parameterCount;

    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}



// Assuming you have a function to collect data for prediction
function collectDataForPrediction() {
    var dynamicParameters = document.querySelectorAll('input[name="dynamicParameter[]"]');
    var data = {};
    dynamicParameters.forEach(function(input, index) {
        data['param' + (index + 1)] = input.value;
    });
    // Add existing fixed parameter values to 'data' as well
    // Send 'data' to your prediction endpoint
}

document.getElementById('button-predict').addEventListener('click', sendPredictionRequest);

function sendPredictionRequest() {
    // Collect fixed parameters as before
    var fixedParam1 = document.getElementById('fixedParam1').value;
    // ... collect other fixed parameters ...

    // Collect dynamic parameters
    var dynamicParameters = document.querySelectorAll('input[name="dynamicParameter[]"]');
    var dynamicData = Array.from(dynamicParameters).map(input => input.value);

    // Combine fixed and dynamic parameters
    var allParams = { fixedParam1, /* other fixed params, */ dynamicData };

    // Send allParams to your prediction endpoint
    // For example: makePrediction(allParams);
}



document.getElementById('removeParam').addEventListener('click', removeLastParameter);


function removeLastParameter() {
    var container = document.getElementById('paramContainer');
    // Get the last input element in the container
    var lastInput = container.querySelector('input[type="number"]:last-of-type');
    if (lastInput) {
        // Remove the last input field and its preceding line break
        container.removeChild(lastInput.nextSibling); // Removing line break
        container.removeChild(lastInput);

        // Decrement the parameter count
        parameterCount--;
    }
}
