document.getElementById("scan-vin").addEventListener("click", function() {
    document.getElementById("scanner-container").style.display = "block";
    startScanner();
});

document.getElementById("close-scanner").addEventListener("click", function() {
    document.getElementById("scanner-container").style.display = "none";
    Quagga.stop();
});

function startScanner() {
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            },
            target: document.querySelector("#scanner-video")
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "upc_reader"]
        }
    }, function(err) {
        if (err) {
            console.error("Error initializing Quagga:", err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(result) {
        let vin = result.codeResult.code;
        document.getElementById("vin-input").value = vin;
        Quagga.stop();
        document.getElementById("scanner-container").style.display = "none";
        alert("VIN Scanned: " + vin);
    });
}
