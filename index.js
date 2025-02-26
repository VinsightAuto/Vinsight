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
                        width: 640,
                        height: 480,
                        facingMode: "environment" // Use rear camera
                    }
                },
                decoder: {
                    readers: ["code_128_reader"] // VIN barcodes use Code 128
                }
            }, function(err) {
                if (err) {
                    console.error("QuaggaJS Error:", err);
                    alert("Error initializing barcode scanner.");
                    return;
                }
                Quagga.start();
            });

            // Process barcode when detected
            Quagga.onDetected(function(result) {
                let scannedVin = result.codeResult.code;
                document.getElementById("vin-input").value = scannedVin;

                // Stop scanner after successful scan
                Quagga.stop();
                stream.getTracks().forEach(track => track.stop());
                video.remove();
            });

        })
        .catch((err) => {
            alert("Error accessing camera: " + err.message);
            console.error("Camera error:", err);
        });
});
