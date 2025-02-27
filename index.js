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

            // Initialize QuaggaJS for barcode scanning
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: video, // Attach video stream
                    constraints: {
                        width: 1280, // High resolution for better detection
                        height: 720,
                        facingMode: "environment"
                    }
                },
                decoder: {
                    readers: ["code_128_reader"] // VIN barcodes use Code 128
                },
                locate: true,
                numOfWorkers: 2, // Optimized for mobile performance
                locator: {
                    patchSize: "medium", // Can be "x-small", "small", "medium", "large", "x-large"
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

            // Add a visual indicator for debugging
            Quagga.onProcessed(function(result) {
                let drawingCtx = Quagga.canvas.ctx.overlay;
                let drawingCanvas = Quagga.canvas.dom.overlay;

                if (result) {
                    if (result.boxes) {
                        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                        result.boxes.forEach((box) => {
                            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                                color: "blue",
                                lineWidth: 2
                            });
                        });
                    }
                    if (result.codeResult && result.codeResult.code) {
                        drawingCtx.font = "24px Arial";
                        drawingCtx.fillStyle = "red";
                        drawingCtx.fillText(result.codeResult.code, 10, 20);
                    }
                }
            });

            // Process barcode when detected
            Quagga.onDetected(function(result) {
                let scannedVin = result.codeResult.code;
                document.getElementById("vin-input").value = scannedVin;

                // Stop scanner after successful scan
                Quagga.stop();
                stream.getTracks().forEach(track => track.stop());
                video.remove();
                alert("VIN Scanned: " + scannedVin); // Alert to confirm detection
            });

        })
        .catch((err) => {
            alert("Error accessing camera: " + err.message);
            console.error("Camera error:", err);
        });
});
