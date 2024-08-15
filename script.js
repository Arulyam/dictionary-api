const _newMeaningTemplate = `<h5 class="mb-1">
          <em>
            <span id="part-of-speech-{{index}}"></span>
          </em>
        </h5>
        <h4 class="mb-2">
          <span id="definition-{{index}}"></span>
        </h4>
        <ol id="definitions-{{index}}"></ol>`;

function getAndDisplayWordData() {
  let input = document.querySelector("#word-search-input").value;
  axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/" + input.trim().toLowerCase())
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
    .then(response => {
      console.log("Response object: ");
      console.log(response);
      if (response != undefined) {
        // Display basic information
        document.querySelector("#no-word-found").classList.add("d-none");
        document.querySelector("#word").innerHTML = response.data[0].word;
        document.querySelector("#pronunciation").innerHTML = response.data[0].phonetic;
        // Clear past definitions
        document.querySelector("#definitions").innerHTML = "";
        let defContainer = document.querySelector("#definitions");
  
        // Display definitions
        let meanings = response.data[0].meanings;
        console.log("Num of meanings: " + meanings.length);
        for (let i = 0; i < meanings.length; ++i) {
          // Add html to definitions element
          console.log("Meaning " + i);
          let newMeaning = _newMeaningTemplate.replaceAll("{{index}}", i);
          defContainer.insertAdjacentHTML("beforeend", newMeaning);
  
          // Chage HTML accordingly
          document.querySelector("#part-of-speech-" + i).innerHTML = response.data[0].meanings[i].partOfSpeech;
          document.querySelector("#definition-" + i).innerHTML = response.data[0].meanings[i].definitions[0].definition;
          let definitions = response.data[0].meanings[0].definitions;
          console.log("Num of definitions in meaning: " + definitions.length);
          for (let j = 1; j < definitions.length; ++j) {
            console.log("Def  " + j);
            let newDef = document.createElement("li");
            newDef.setAttribute("id", "def-" + j);
            newDef.innerHTML = definitions[j].definition;
            document.querySelector("#definitions-" + i).appendChild(newDef);
          }
        }
      } else {
        console.log("Word does not exist in dictionary");
        document.querySelector("#no-word-found").classList.remove("d-none");
        document.querySelector("#word").innerHTML = "";
        document.querySelector("#pronunciation").innerHTML = "";
        document.querySelector("#definitions").innerHTML = "";
      }
    });
}

document.querySelector("#word-search-input").onkeyup = function(e) {
  if (e.key == "Enter" ||
      e.code == "Enter" ||      
      e.keyCode == 13      
  ) {
    console.log("Enter key pressed");
    getAndDisplayWordData();
  }
}