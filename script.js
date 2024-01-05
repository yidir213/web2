
const form = document.getElementById("form-csv");
const input = document.getElementById("input-csv");
const button = document.getElementById("button-submit");
const result = document.getElementById("result");
const modelSelect = document.getElementById("model-select");                                                            //added this


const xhr = new XMLHttpRequest();

function displayPrediction(prediction) {
    const predictionResult = document.getElementById("prediction-result");
    predictionResult.textContent = "Prediction : " + prediction;
}


const dropdown = document.querySelector('.dropdown');                                                                       //added these
const placeholder = document.querySelector('.dropdown-placeholder');

dropdown.addEventListener('click', () => {
    dropdown.classList.toggle('active');

    if (dropdown.classList.contains('active')) {
        placeholder.style.height = '400px';
    } else {
        placeholder.style.height = '0';
    }
});

document.querySelectorAll('.dropdown .items a').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedItemValue = this.getAttribute('data-value');
        document.querySelector('.dropdown-title').textContent = this.textContent;
        modelSelect.value = selectedItemValue;
    });
});

form.addEventListener("submit", function(e) {

    e.preventDefault();

    const file = input.files[0];

    const formData = new FormData();

    formData.append("csv_file", file);


    const selectedModel = modelSelect.value;
    formData.append("model", selectedModel);

    xhr.open("POST", config.train_api );

    xhr.send(formData);
});


xhr.addEventListener("load", function() {

    if (xhr.status === 200) {
       
        const response = xhr.responseText;
        
        const data = JSON.parse(response);
      
        result.textContent = "Accuracy : " + data.accuracy ;
    } else {
        if(modelSelect.value == null && input.files[0]== null ){
            error = "Please select a dataset and a model to train ";
        }
        else if(modelSelect.value == null){
            error = "Please select a model to train with ";

        }
        else if(input.files[0]== null){
            error = "Please select a dataset  ";
        }
        else{
            error="";
        }
        result.textContent = "Error : " +error ;
    }
});






const predictButton = document.getElementById("button-predict");
predictButton.addEventListener("click", function() {
    var parameterValues = [];
    for (let i = 1; i <= parameterCount; i++) {
        let paramValue = document.getElementById('value' + i);
        if (paramValue) {
            parameterValues.push(parseFloat(paramValue.value));
        }
    }
    const valuesArray = [parameterValues];
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
            document.getElementById("prediction-result").textContent = "Prediction : " + prediction;
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
