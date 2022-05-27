let allElements = document.getElementsByTagName("*");

let button = document.querySelector('*[value="Start"]');
let radioInput = document.querySelectorAll('*[type="radio"]');
let beerForm = document.querySelector('#beerForm');

let beerHeader = document.createElement("h1");
beerHeader.append("Vælg en Øl-type");
beerForm.before(beerHeader);

/*let beerTypes={
    ales: ["Bitter", "Pale Ale", "Brown Ale", "Trappist", "Porter",  "Weizenbier"],
    lagers:["Pilsner", "Münchener", "Wiener", "Bock", "Porter"],
    wilds: ["Gueuze", "Faro", "Fruit"]
};*/



function listChecked () {
    let choices = document.querySelectorAll('*[name="gæringstype"]');
    for (let element of choices) {
        if (element.checked) {
            console.log(element.value);
        }
    }
}

function listAll () {
    let choices = document.querySelectorAll('*[name="gæringstype"]');
    for (let element of choices) {
        console.log('Type: ' + element.value + ', check status: ' + element.checked);
    }
}

function orderBeer () {
    try {
        let currentSelect = document.querySelector('#BeerSelect');
        alert("Order accepted for: " + currentSelect[currentSelect.selectedIndex].text + "\nWith value of: " + currentSelect.value);
    }
    catch(e) {
        alert(e);
    }
}

function leakInformation () {
    console.log(event.type);
    switch (event.type) {
        case "mouseover":
            console.log('nodeName: ' + event.target.nodeName + ', innerHTML: ' + event.target.innerHTML);
            break;
        case "keydown":
            console.log('keyPressed: ' + event.key);
            break;
        default:
            break;
    }
}

function createBeerSelect () {
    //console.log("Test");
    //let choices = document.querySelectorAll('*[name="gæringstype"]');
    let selectedElement = event.target;
    let selectedBeerKind = selectedElement.getAttribute("data-kind");
    /*for (let element of choices) {
        if (element.checked) {
            selectedBeerKind = element.getAttribute("data-kind");
        }
    }*/
    
    //let currentSelect = document.querySelector('#BeerSelect');
    createHTMLBeerSelect(selectedBeerKind);
    /*if (currentSelect !== null) {
        currentSelect.replaceWith(htmlBeerSelect);
    } else {
        let hr = document.querySelector('#inputSpacer');
        hr.after(htmlBeerSelect);
    }*/

}

async function createHTMLBeerSelect (kind) {
    let select = document.createElement("select");
    select.id = "BeerSelect";
    let currentSelect = document.querySelector('#BeerSelect');
    fetch('http://127.0.0.1:3000/beer.json')
    .then(response => response.json())
    .then(beerTypes => {
        for (let entry of beerTypes[kind]) {
            console.log(entry);
            let option = document.createElement("option");
            option.text = entry;
            option.value = entry.toLowerCase();
            select.add(option);
        }
        if (currentSelect !== null) {
            currentSelect.replaceWith(select);
        } else {
            let hr = document.querySelector('#inputSpacer');
            hr.after(select);
        }
    }).catch(e => console.log(e));
    
}




button.addEventListener("click", orderBeer);

for (let element of radioInput) {
    element.addEventListener("click", createBeerSelect);
}
/*
for (let element of allElements) {
    element.addEventListener("mouseover", leakInformation);
}
document.addEventListener("keydown", leakInformation);
*/
//.addEventListener("click", () => { console.log("Thanks again!"); });