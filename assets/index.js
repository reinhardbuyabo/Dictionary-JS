const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  synonymous = wrapper.querySelector(".synonym .list"),
  volume = wrapper.querySelector(".word i"),
  removeIcon = wrapper.querySelector(".search span"),
  infoText = wrapper.querySelector(".info-text"),

  details = wrapper.querySelector(".word .details p"),
  phonetics = wrapper.querySelector(".word .details span"),
  meaning = wrapper.querySelector(".meaning span"),
  example = wrapper.querySelector(".example span");

let audio;
// fetch api function
function fetchApi(word) {
  infoText.style.color = "#000";
  wrapper.classList.remove("active");
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((res) => res.json()) // reads response stream to completion and returns a promise which resolves with the result of parsing the body text as JSON // res is a response object returned from fetch containing the embodiment of all data we need.
    .then((result) => data(result, word))
    .catch(err => console.log(err));
}

searchInput.addEventListener("keyup", e => {
  if (e.code == "Enter") {
    fetchApi(e.target.value);
  }
})

data = (res, w) => {
  if (res.resolution) {
    infoText.innerHTML = `${res.title} for <span>"${w}</span>."`;
  } else {
    console.log(res);
    wrapper.classList.add("active");
    details.innerHTML = w;
    meaning.innerHTML = res[0].meanings[0].definitions[0].definition;
    phonetics.innerHTML = res[0].phonetic ?? res[0].phonetics[1].text ?? "Phonetic not found";
    example.innerHTML = res[0].meanings[0].definitions[0].example ?? "No example found";
    let listofsyn = res[0].meanings[0].synonyms;
    synonymous.innerHTML = " ";
    if (listofsyn.length == 0){
      synonymous.innerHTML = "<span>No synonyms found.</span>";
    } else {
      let output = listofsyn.map(synonym => {
      let sp = document.createElement('span');
      sp.textContent = synonym;
      return sp;
    });
    synonymous.append(...output);
    }
    let audURL = res[0].phonetics[0].audio = '' ? res[0].phonetics[1].audio: res[0].phonetics[0].audio;
    
    audio = new Audio(audURL);
  }
  volume.addEventListener("click", () => audio.play().catch(err => {
    console.log(err);
  }));
}