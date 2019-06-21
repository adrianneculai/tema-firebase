var numeRef = document.getElementById("nume");
var telefonRef = document.getElementById("telefon");
var butonRef = document.getElementById("buton");

var agendaObj = [];
var indexEdit = -1;

async function ajaxPromise(url, method, body) {
    return new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    resolve(this.responseText);
                } else {
                    reject(this);
                }
            }
        };
        xhttp.open(method, url, true);
        xhttp.send(body);
    });
}

async function getObj() {
    var responseText = await ajaxPromise("https://agenda-d6848.firebaseio.com/.json", "GET")
    agendaObj = JSON.parse(responseText)
    draw()
    indexEdit = -1
}

numeRef.addEventListener("keypress", apasaEnter)
telefonRef.addEventListener("keypress", apasaEnter)


async function add() {
    if (numeRef.value != "" && telefonRef.value != "") {
        var obj = {
            nume: numeRef.value,
            numar: telefonRef.value
        }
    }
    if (indexEdit === -1) {
        await ajaxPromise(`https://agenda-d6848.firebaseio.com/.json`, "POST", JSON.stringify(obj))
    } else {
        await ajaxPromise(`https://agenda-d6848.firebaseio.com/${indexEdit}.json`, "PUT", JSON.stringify(obj))
    }
    getObj()
}

async function edt(idx) {
    numeRef.value = agendaObj[idx].nume
    telefonRef.value = agendaObj[idx].numar
    indexEdit = idx
}


async function del(idx) {
    if (confirm(`Esti sigur ca vrei sa stergi ${agendaObj[idx].nume} `)) {
        // agendaObj.splice(event.target.id, 1)
         await ajaxPromise(`https://agenda-d6848.firebaseio.com/${idx}.json`, "DELETE")
        getObj()
    }
}

function apasaEnter(event) {
    if (event.keyCode === 13) {
        butonRef.click();
    }
};

function draw() {
    var createTable = ""
    var createRows = ''
    createTable = `<table id="tabel">
                        <thead>
                            <th> Nume</th>
                            <th>Telefon</th>
                        </thead>
                        <tbody>
                        </tbody>
                        </table>`
    document.querySelector("#outPut").innerHTML = createTable;

    for (var i in agendaObj) {
        createRows +=
            `<tr>
                <td class="tableData">${agendaObj[i].nume}</td>
                <td class="tableData">${agendaObj[i].numar}</td>
                <td> <button id="${i}" 
                                class="tableButton" 
                                style="margin-bottom: 10px; 
                                margin-left:0px"
                                onclick="edt('${i}')">
                                Modifica
                    </button>
                </td>
                <td> 
                <button id="${i}" 
                                class="tableButton" 
                                style="margin-bottom: 10px"
                                onclick="del('${i}')">
                                Sterge
                </button> 
                
                </td>
            </tr>`
    }
    document.querySelector("table tbody").innerHTML = createRows
    numeRef.value = "";
    telefonRef.value = "";

    console.log(agendaObj.tags)
}