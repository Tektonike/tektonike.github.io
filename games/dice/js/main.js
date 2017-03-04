var balance = 0;
var _idGame = "";
var urlBalance = ""; //balance
var addressContract = "0x7776ec25d1d676d8656fb79ab96054ba13bf70b3"; // cotract //0x5af6988f3d44bfbe3580d25ac4f5d187486b007f
var betEth = 0.1; //0,2 ставка эфира
var mainet, openkey, privkey;
var chance = 5000;
var urlInfura = "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl";
var lastTx;
var startRoll = true;
var count;
var game = false;
// var maxBet = 2000;
/*
 * value - Дробное число.
 * precision - Количество знаков после запятой.
 */
function toFixed(value, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(value * precision) / precision;
}

function numToHex(num) {
    return num.toString(16);
}

function hexToNum(str) {
    return parseInt(str, 16);
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        console.log("localStorage_failed:", e);
        return false;
    }
}

function loadData() {
    if (isLocalStorageAvailable()) {
        mainet = localStorage.getItem('mainnet')
        openkey = localStorage.getItem('openkey')
        privkey = localStorage.getItem('privkey')
    }
    console.log("version 0.1") // VERSION !
    console.log("mainet:", mainet)
    console.log("openkey:", openkey)
    console.log("privkey:", privkey)
}

function setContract() {
    if (mainnet == "on") {
        urlInfura = "https://mainnet.infura.io/JCnK5ifEPH9qcQkX0Ahl";
        addressContract = "0xb7c90df0888fee75ecfc8e85ed35fcd6ea1f3370";
    }
}

function initGame() {
     $("#contract").append('<a target="_blank" href="https://testnet.etherscan.io/address/'+addressContract +'">To contract</a>' )
    TotalRolls();
    Refresh();
    loadData();
    GetLogs();
    // $.ajax({
    //     type: "POST",
    //     url: urlInfura,
    //     dataType: 'json',
    //     async: false,
    //     data: JSON.stringify({
    //         "id": 0,
    //         "jsonrpc": '2.0',
    //         "method": 'eth_getBalance',
    //         "params": [openkey, "latest"]
    //     }),
    //     success: function (d) {
    //         console.log("balance!: ", d.result, toFixed((Number(d.result) / 1000000000000000000), 4));
    //         //_balance = toFixed((Number(d.result) / 1000000000000000000), 4);
    //         //$("#balance").html(_balance);
    //         //$("#your-balance").val(_balance);
    //     }
    // })
    var data = "0xa87d942c";
    var params = {
        "from": openkey,
        "to": addressContract,
        "data": data
    };
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [params, "latest"]
        }),
        success: function (d) {
            count = hexToNum(d.result);
            console.log("old_count", count);
        }
    });
};

function button(status) {
    if (status) {
        $("#roll-dice").css({
            background: 'gray'
        });
    } else {
        $("#roll-dice").removeAttr('style');
    }
}

function disabled(status) {
    $("#slider-dice-one").slider({
        disabled: status
    });
    $("#slider-dice-two").slider({
        disabled: status
    });
    $("#amount-one").attr('readonly', status);
    $("#less-than-wins").attr('readonly', status);
    $("#roll-dice").attr('disabled', status);
    button(status);

}



function TotalRolls() {
    var data = "0x9e92c991";
    var params = {
        "from": openkey,
        "to": addressContract,
        "data": data
    };
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [params, "latest"]
        }),
        success: function (d) {
            count = hexToNum(d.result);
            $("#total-rolls").html(count);
        }
    });

};

setInterval(function () {
    balance = $("#balance").html();
    balance = +balance.substr(0, 6);
    if (balance < 0.1 && !game) {
        disabled(true);
        $("#label").text(" NO MONEY ");
    } 
    $("#your-balance").val(balance);
    $("#slider-dice-one").slider("option", "max", balance * 1000);
    console.log(balance);
}, 2000);
