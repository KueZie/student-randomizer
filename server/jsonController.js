const fs = require("fs");
const fileName = "server/myJSON.json"
const file = JSON.parse( fs.readFileSync(fileName) );
const express = require("express");
const router = express.Router();

// Gets and instance of file with the period and index as the path to the document
function getByIndex(period, index) {
    if(index > file[`period${period}`].length - 1)
        throw Error( `Index out of range. Given index: ${index} is greater than array length of ${file[`period${period}`].length}` );
    return file[`period${period}`][index]
}

function getByName(period, name) {
    const objToSearch = file[`period${period}`];
    console.log(objToSearch.filter(obj => obj.name === name)[0])
    return objToSearch.filter(obj => obj.name === name)[0];
}

function getAll(period) {
    return file[`period${period}`];
}

// Copies the main file edits one document inside of a certain period and writes the changes to the specified JSON file.
function modifyOne(period, personName, payload) {
    const fileCopy = {...file};
    const periodTemplate = `period${period}`;
    let found = false;
    let foundIndex;
    
    // Find and change, set off flags
    for(index in fileCopy[periodTemplate]) {
        if(fileCopy[periodTemplate][index].name === personName) {
            fileCopy[periodTemplate][index] = payload;
            found = true;
            foundIndex = index;
            break;
        }
    }
    if(found)
        fs.writeFileSync(fileName, JSON.stringify( fileCopy, null, 2) );
    else
        throw Error("Error in finding and configuring given name, given name must be a valid instance in file.");
    console.log(found)
}

router.get("/all/:period", (req, res) => {
    const period = req.params.period;
    res.status(200).send(getAll(period));
});

router.get("/all", (req, res) => {
    const aggregate = {period1: getAll(1), period2: getAll(2)};
    res.status(200).send(aggregate);
});

router.post("/callCount/increment/:period/:personName", (req, res) => {
    console.log(req.params)
    const name = req.params.personName;
    const period = parseInt(req.params.period);
    const fileRef = getByName(period, name);
    fileRef.callCount++;
    // console.log(fileRef, name, period)
    modifyOne(period, name, fileRef);
});

router.post("/callCount/decrement/:period/:personName", (req, res) => {
    const name = req.params.personName;
    const period = parseInt(req.params.period);
    const fileRef = getByName(period, name);
    fileRef.callCount--;
    modifyOne(period, name, fileRef);
    console.log(fileRef);
});

// modifyOne(1, "Hunter Goram", { "name": "Hunter Goram", "callCount": 2 }); Example way to call and use modifyOne

module.exports = router;