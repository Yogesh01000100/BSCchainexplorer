let options = {
    method: "GET"
};
let y = 0;
let d_status = 0;
//console.log(d_status);
var ct = 5;
let filter;
var arr = [];
var uniqueArray = [];
var bal_arr = new Array();

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}
//for (let w = 0; w < bal_arr.length; w++) {
//   console.log(bal_arr[w]);
//}
document.getElementById("requestStatus").textContent = "NOT CONNECTED";

function downloadCsv(filename, csvData) {
    const element = document.createElement("a");

    element.setAttribute("href", `data:text/csv;charset=utf-8,${csvData}`);
    element.setAttribute("SCAN_RESULT", filename);
    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}




let btn = document.getElementById("sendGetRequestBtn");
let loadingel = document.getElementById("loading");


let ele = document.getElementById("ftd");
btn.addEventListener("click", function() {
    loadingel.classList.remove("d-none");
    const url = "https://api.bscscan.com/api?module=account&action=txlistinternal&startblock=25944043&endblock=26836255&page=1&offset=10000&sort=asc&apikey=I6XJPSDTKIDNCK24XUURI65MHRFZ431U5J"
    fetch(url, options)
        .then(function(response) {
            return response.status;
        })
        .then(function(status) {
            document.getElementById("requestStatus").textContent = "Success! You are connected to the MAINNET!";
            //console.log(status);
            if (status == 200) {
                btn.textContent = "Connected";
                document.getElementById("stat").classList.add("btn-stat-suc");
            } else {
                document.getElementById("stat").classList.add("btn-stat");
            }
            loadingel.classList.add("d-none");
        });
    loadingel.classList.remove("d-none");
    fetch(url, options)
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            const parsedResponse = JSON.parse(data);
            for (let i = 0; i < parsedResponse.result.length; i++) {
                const firstTransaction = parsedResponse.result[i];
                arr.push({
                    "address": firstTransaction.from,
                    "timestamp": firstTransaction.timeStamp
                });
            }
            document.getElementById("httpResponse").textContent = "Click on Fetch data button to fetch data!";
            y = 1;
            if (y == 1) {

                uniqueArray = removeDuplicates(arr, "address");
                //console.log(uniqueArray[0]);
            }
            loadingel.classList.add("d-none");
        });
});


filter = document.createElement("button");
filter.classList.add("f-button");
filter.textContent = "Fetch data";
document.getElementById("ftd").appendChild(filter);
filter.addEventListener("click", function() {
    document.getElementById("httpResponse").textContent = " ";
    let uniqueId = null;
    let cent = uniqueArray.length;
    if (cent == 0) {
        ele.textContent = "Connect to Mainnet first! Reload page!";
        return;
    }
    let p = 0;
    let k = -1;
    uniqueId = setInterval(function() {
        let add = uniqueArray[p].address;
        const url = `https://api.bscscan.com/api?module=account&action=balance&address=${add}&tag=latest&apikey=I6XJPSDTKIDNCK24XUURI65MHRFZ431U5J`;
        fetch(url, options)
            .then(function(response) {
                return response.status;
            })
            .then(function(status) {
                document.getElementById("requestStatus").textContent = "IDLE";
            });
        fetch(url, options)
            .then(function(response) {
                return response.text();
            })
            .then(function(data) {
                const parsedResponse = JSON.parse(data);
                //console.log(parsedResponse.result);

                document.getElementById("httpResponse").textContent = "address: " + add + "\n" + "timestamp: " + uniqueArray[p].timestamp + " Balance: " + parsedResponse.result / 1000000000000000000;
                if ((parsedResponse.result / 1000000000000000000) > 2) {
                    bal_arr.push({
                        "timestamp": uniqueArray[p].timestamp,
                        "w_address": add,
                        "balance": parsedResponse.result / 1000000000000000000
                    });
                    k = k + 1;
                }
            });
        p = p + 1;
        if (100 * p / cent == 100) {
            ele.textContent = "Click on Download button below to download data in .csv format."
        } else if (100 * p / cent == "Infinity") {
            ele.textContent = "Connect to Mainnet first! Reload page! first connect then fetch";
        } else {
            ele.textContent = "Downloading... " + Number((100 * p) / cent).toFixed(2) + " %";
            document.getElementById("requestStatus").textContent = "Fetching...";
        }
        //console.log(bal_arr[k]);
        if (p == uniqueArray.length) {
            clearInterval(uniqueId);
            d_status = 1;
            //console.log(d_status);
            if (d_status == 1) {
                let dbtn = document.createElement("button");
                dbtn.classList.add("d-button");
                dbtn.id = "csv2";
                dbtn.textContent = "Download"
                document.getElementById("db").appendChild(dbtn);
                const btnDownloadCsv = document.getElementById("csv2");
                btnDownloadCsv.addEventListener("click", () => {
                    downloadCsv("dcode-test.csv", json2csv.parse(bal_arr));
                });
            }
            return;
        }
    }, 200);
});
