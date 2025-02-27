document.getElementById("scan-button").addEventListener("click", () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support camera access.");
        return;
    }

    // Open the camera stream
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            let video = document.createElement("video");
            video.setAttribute("playsinline", true);
            video.style.position = "fixed";
            video.style.top = "50%";
            video.style.left = "50%";
            video.style.transform = "translate(-50%, -50%)";
            video.style.width = "100%";
            video.style.height = "100%";
            document.body.appendChild(video);
            video.srcObject = stream;
            video.play();

            // Create a scan overlay (rectangle)
            let overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "30%";
            overlay.style.left = "50%";
            overlay.style.transform = "translate(-50%, -50%)";
            overlay.style.width = "80%";
            overlay.style.height = "20%";
            overlay.style.border = "4px solid red";
            overlay.style.borderRadius = "5px";
            overlay.style.zIndex = "9999";
            document.body.appendChild(overlay);

            // Initialize QuaggaJS with better barcode detection settings
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: video,
                    constraints: {
                        width: 1280, // High resolution for better detection
                        height: 720,
                        facingMode: "environment"
                    }
                },
                decoder: {
                    readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
                },
                locate: true,
                numOfWorkers: 2,
                frequency: 10, // Force continuous scanning
                locator: {
                    patchSize: "medium",
                    halfSample: false
                }
            }, function(err) {
                if (err) {
                    console.error("QuaggaJS Error:", err);
                    alert("Error initializing barcode scanner.");
                    return;
                }
                Quagga.start();
            });

            // Add debugging logs to check if Quagga is recognizing anything
            Quagga.onProcessed(function(result) {
                let drawingCtx = Quagga.canvas.ctx.overlay;
                let drawingCanvas = Quagga.canvas.dom.overlay;

                if (result) {
                    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                    if (result.boxes) {
                        result.boxes.forEach((box) => {
                            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                                color: "blue",
                                lineWidth: 2
                            });
                        });
                    }
                }
            });

            // Process barcode when detected
            Quagga.onDetected(function(result) {
                console.log("Barcode detected:", result.codeResult.code);
                let scannedVin = result.codeResult.code;
                document.getElementById("vin-input").value = scannedVin;

                // Stop scanner after successful scan
                Quagga.stop();
                stream.getTracks().forEach(track => track.stop());
                video.remove();
                overlay.remove();
                alert("VIN Scanned: " + scannedVin);
            });

        })
        .catch((err) => {
            alert("Error accessing camera: " + err.message);
            console.error("Camera error:", err);
        });
});
