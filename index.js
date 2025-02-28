document.getElementById("scan-vin").addEventListener("click", () => {
    document.getElementById("scanner-container").style.display = "block";
    startScanner();
});

document.getElementById("close-scanner").addEventListener("click", () => {
    document.getElementById("scanner-container").style.display = "none";
    Quagga.stop();
});

function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#scanner-video"),
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "upc_reader"] // VIN barcodes are typically Code 128
        }
    }, function(err) {
        if (err) {
            console.error("Quagga initialization failed: ", err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((data) => {
        const vin = data.codeResult.code;
        document.getElementById("vin-input").value = vin;
        alert("VIN Scanned: " + vin);
        Quagga.stop();
        document.getElementById("scanner-container").style.display = "none";
    });
}
