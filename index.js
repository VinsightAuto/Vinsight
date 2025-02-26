// Load QuaggaJS (Barcode Scanner)
document.addEventListener("DOMContentLoaded", function() {
    let scanButton = document.getElementById("scan-button");
    let vinInput = document.getElementById("vin-input");

    scanButton.addEventListener("click", function() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Your browser does not support camera access.");
            return;
        }

        // Create a video element for live streaming
        let video = document.createElement("video");
        video.setAttribute("playsinline", true);
        document.body.appendChild(video);

        // Initialize QuaggaJS
        Quagga.init({
            inputStream: {
                type: "LiveStream",
                constraints: {
                    facingMode: "environment"
                }
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
            }
        }, function(err) {
            if (err) {
                console.error("QuaggaJS error:", err);
                alert("Error initializing scanner");
                return;
            }
            Quagga.start();
        });

        // Process barcode when detected
        Quagga.onDetected(function(result) {
            let scannedVin = result.codeResult.code;
            vinInput.value = scannedVin
