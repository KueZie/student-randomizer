const root = document.querySelector("#root");
const preloader = document.querySelector("#preloader");
const listContainer = document.querySelector("#list-container");
const btnSave = document.querySelector("#btn-save");
// Both periods should be sorted once initialized in jsonHandler.
let periodOne, periodTwo;
let lastIndex = 0;

function jsonHandler(json) {
    const ratio = 1 / 4;
    periodOne = sortArray(json.period1);
    periodTwo = sortArray(json.period2);
    insertPeople(getPeople(ratio, periodOne));
}

function getPeople(ratio, period) {
    const periodCopy = [...period];
    let peopleToPick = Math.floor(periodCopy.length * ratio);
    console.log(peopleToPick, periodCopy.slice(0, peopleToPick))
    lastIndex += peopleToPick;
    return periodCopy.slice(0, peopleToPick)
}

function sortArray(arr) {
    let array = [...arr];
    let swapped = true;
    while(swapped) {
        swapped = false;
        for(let i = 1; i < array.length; i++) {
            if(array[i - 1].callCount > array[i].callCount) {
                let temp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = temp;
                swapped = true;
            }
        }
    }
    return array;
}

function refresh(id) {
    const container = document.querySelector(`#${id}-container`);
    const newPerson = periodOne[lastIndex + 1];
    container.id = `${newPerson.name.replace(/\s+/g, '')}-container`
    container.innerHTML =  `
            <div class="col s6 red lighten-4 pull-s3 border-round z-depth-1">
                <h6 class="left">${newPerson.name}</h6>
                <span class="right" id="${newPerson.name.replace(/\s+/g, '')}" onclick="refresh(this.id);"><i class="small material-icons refresh-btn">refresh</i></span>
            </div>`;
    lastIndex++;
}

// Inserts a period into a wrapper
function insertPeople(people) {
    const peopleCopy = [...people];
    for(let i = 0; i < peopleCopy.length; i++) {
        listContainer.innerHTML += `
        <div id="${peopleCopy[i].name.replace(/\s+/g, '')}-container" class="row valign-wrapper ${i === 0 ? "move-down" : ""}">
            <div class="col s6 red lighten-4 pull-s3 border-round z-depth-1">
                <h6 class="left">${peopleCopy[i].name}</h6>
                <span class="right" id="${peopleCopy[i].name.replace(/\s+/g, '')}" onclick="refresh(this.id);"><i class="small material-icons refresh-btn">refresh</i></span>
            </div>
        </div>
        `
    }
}
// Get both periods and call the jsonHandler
fetch("people/all/", { method: "GET" })
    .then(res => res.json())
    .then(json => jsonHandler(json))
    .catch(err => console.error(err));

// When clicked, trigger scale out.
btnSave.addEventListener("click", (e) => btnSave.classList.add("scale-out"));

// Preloader change
setTimeout(() => {
    root.classList.remove("hide");
    preloader.classList.add("hide");
}, 0000)
