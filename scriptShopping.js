buttonRef = document.getElementById("addButton");
textRef = document.getElementById("item");

var arr = [];
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
    var responseText = await ajaxPromise("https://shopping-list-df64d.firebaseio.com/.json", "GET")
    arr = JSON.parse(responseText)
    console.log("valorile din array = ", arr)
    draw()
}

function taiat(idx) {
    if (arr[idx].mark === 0) {
        return arr[idx].name
    } else if (arr[idx].mark === 1) {
        return arr[idx].name.strike()
    }
}

textRef.addEventListener("keyup", apasaEnter);

function apasaEnter(e) {
    if (e.keyCode === 13) {
        buttonRef.click();
    }
}

async function add() {
    if (textRef.value != "") {
        var obj = {
            name: textRef.value,
            mark: 0
        }
        textRef.value = ""
        await ajaxPromise("https://shopping-list-df64d.firebaseio.com/.json", "POST", JSON.stringify(obj))
    }
    getObj()
}

async function mark(idx) {
    console.log("oare merge asta? =", idx)
    if (arr[idx].mark == 0) {
        var obj = {
            mark: 1,
            name: arr[idx].name
        }
    }
    else if (arr[idx].mark === 1) {
        var obj = {
            mark: 0,
            name: arr[idx].name
        }
    }
    await ajaxPromise(`https://shopping-list-df64d.firebaseio.com/${idx}.json`, "PUT", JSON.stringify(obj))
    getObj()
}


function draw() {
    var createTHead = ``
    var createRow = ``
    createTHead = `<thead>
    <th>Item description</th>
    <th>Action</th>
    </thead>
    <tbody>
    </tbody>`
    document.querySelector("#table").innerHTML = createTHead
    for (var i in arr) {
        createRow +=
            `<tr>
        <td>${taiat(i)}</td>
        <td><button onclick="mark('${i}')" class="mark">Mark as buyed</button></td>
        </tr>`

        // console.log("acesta este i = ", i)
        // console.log("arr[i] este = ", arr[i])

    }
    document.querySelector("table tbody").innerHTML = createRow;
}

async function sortAsc() {
    console.log("sort ascendent")

    // keysSorted = Object.keys(name).sort(function (a, b) { return arr[a] - arr[b] })
    // console.log("asta e noua sortare = ", keysSorted);

    var arrNew = objectSort(arr)
    arrNew.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase())
    console.log(arrNew)
    await ajaxPromise(`https://shopping-list-df64d.firebaseio.com/.json`, "PUT", JSON.stringify(arrNew))
    getObj()
}


async function sortDesc() {
    console.log("sort descendent")
    var arrNew = objectSort(arr)
    arrNew.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase())
    console.log(arrNew)
    await ajaxPromise(`https://shopping-list-df64d.firebaseio.com/.json`, "PUT", JSON.stringify(arrNew))
    getObj()
}

function objectSort(obj) {
    var temp = [];
    for (var i in obj) {
        temp.push(obj[i])
    }
    return temp
}

