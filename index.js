document.getElementById("scan-vin").addEventListener("click", () => {
    const scannerContainer = document.getElementById("scanner-container");
    scannerContainer.style.display = "block";

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            const video = document.getElementById("scanner-video");
            video.srcObject = stream;
            video.play();
            initQuagga();
        })
        .catch(err => {
            alert("Camera access denied or unavailable.");
            console.error("Camera error:", err);
        });
});

document.getElementById("close-scanner").addEventListener("click", () => {
    const scannerContainer = document.getElementById("scanner-container");
    scannerContainer.style.display = "none";
    stopCamera();
});

function stopCamera() {
    let video = document.getElementById("scanner-video");
    let stream = video.srcObject;
    if (stream) {
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    video.srcObject = null;
}

function initQuagga() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById("scanner-container"),
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        decoder: {
            readers: ["code_128_reader"]
        },
        locate: true
    }, function(err) {
        if (err) {
            console.error("QuaggaJS initialization failed:", err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(data => {
        document.getElementById("vin-input").value = data.codeResult.code;
        alert("VIN Scanned: " + data.codeResult.code);
        stopCamera();
        document.getElementById("scanner-container").style.display = "none";
        Quagga.stop();
    });
}
