require('dotenv').config(); // Use dotenv to load environment variables
const API_KEY = process.env.TWELVE_DATA_API_KEY; // Get the API key from the environment variable
let chart;

// Event listener for selecting currency pairs
document.getElementById('pairSelect').addEventListener('change', function () {
    const selectedPair = this.value;
    fetchDataForSelectedPair(selectedPair);
});

// Fetch data for the selected currency pair
function fetchDataForSelectedPair(pair) {
    const url = `https://api.twelvedata.com/time_series?symbol=${pair}&interval=5min&apikey=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                const timeSeries = data.values;
                const labels = timeSeries.map(item => item.datetime);
                const prices = timeSeries.map(item => parseFloat(item.close));

                const support = Math.min(...prices);
                const resistance = Math.max(...prices);
                checkSupportResistance(prices[prices.length - 1], support, resistance);

                updateChart(labels, prices);
                document.getElementById('statusMessage').innerText = `Showing data for ${pair}`;
            } else {
                document.getElementById('statusMessage').innerText = "Failed to fetch data. Please try again later.";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('statusMessage').innerText = "Error fetching data. Please try again later.";
        });
}

// Update the chart with the new data
function updateChart(labels, prices) {
    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: prices,
                borderColor: '#4caf50',
                fill: false,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category',
                    labels: labels
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Check if the current price is near support or resistance levels
function checkSupportResistance(currentPrice, support, resistance) {
    let alertMessage = '';
    if (currentPrice <= support) {
        alertMessage = `Price is approaching support at ${support}.`;
    } else if (currentPrice >= resistance) {
        alertMessage = `Price is approaching resistance at ${resistance}.`;
    }

    document.getElementById('alertMessage').innerText = alertMessage;
}

// Screen recording functionality
let mediaRecorder;
let recordedChunks = [];

function startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                mediaRecorder.ondataavailable = function (event) {
                    recordedChunks.push(event.data);
                };

                mediaRecorder.onstop = function () {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'screen-recording.webm';
                    a.click();
                };
            })
            .catch(err => {
                console.log('Error starting screen recording: ', err);
            });
    } else {
        alert('Your browser does not support screen recording.');
    }
}
