document.getElementById("scan-button").addEventListener("click", () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera access is not supported on this device.");
        return;
    }

    let scannerContainer = document.createElement("div");
    scannerContainer.id = "scanner-container";
    scannerContainer.style.position = "fixed";
    scannerContainer.style.top = "0";
    scannerContainer.style.left = "0";
    scannerContainer.style.width = "100vw";
    scannerContainer.style.height = "100vh";
    scannerContainer.style.background = "rgba(0, 0, 0, 0.8)";
    scannerContainer.style.display = "flex";
    scannerContainer.style.justifyContent = "center";
    scannerContainer.style.alignItems = "center";
    scannerContainer.style.zIndex = "1000";
    
    let closeButton = document.createElement("button");
    closeButton.textContent = "Close Scanner";
    closeButton.style.position = "absolute";
    closeButton.style.top = "20px";
    closeButton.style.right = "20px";
    closeButton.style.padding = "10px 15px";
    closeButton.style.background = "#ff0000";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    
    closeButton.addEventListener("click", () => {
        Quagga.stop();
        scannerContainer.remove();
    });

    scannerContainer.appendChild(closeButton);
    document.body.appendChild(scannerContainer);

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerContainer,
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["code_128_reader"]
        }
    }, (err) => {
        if (err) {
            console.error("Error initializing Quagga:", err);
            alert("Failed to initialize barcode scanner.");
            scannerContainer.remove();
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((result) => {
        let vin = result.codeResult.code;
        if (vin.length >= 17) {
            document.getElementById("vin-input").value = vin;
            alert("VIN Scanned: " + vin);
            Quagga.stop();
            scannerContainer.remove();
        }
    });
});
