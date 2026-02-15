
// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require('https');

const url = "https://script.google.com/macros/s/AKfycbyBUfzE-wi986gYo1CyAuKy_JAeESfHy4HgmiNR-vUQaKzuPd4OUnJjg8XTT3EPvkOd/exec";

// Mock implementation of logic in route.ts
const simulateProxy = (text) => {
    try {
        // 1. Try JSON
        try {
            const jsonData = JSON.parse(text);
            console.log("Parsed as JSON directly");
            return { type: 'JSON', data: jsonData };
        } catch (e) {
            // Ignore
        }

        // 2. Try JSONP
        console.log("Checking for JSONP pattern...");
        const jsonMatch = text.match(/callback\(([\s\S]*)\)/);
        if (jsonMatch) {
            console.log("JSONP pattern matched!");
            return { type: 'JSONP', data: JSON.parse(jsonMatch[1]) };
        }
        console.log("No match found.");
        return { type: 'ERROR', data: null };
    } catch (e) {
        console.error("Simulation exception:", e);
        return { type: 'EXCEPTION', data: e.message };
    }
};

function testFetch() {
  console.log("Starting https.get...");
  https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    
    // Follow redirect if 3xx
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log("Redirecting to:", res.headers.location);
        https.get(res.headers.location, (res2) => {
            handleResponse(res2);
        });
        return;
    }

    handleResponse(res);

  }).on('error', (e) => {
    console.error(e);
  });
}

function handleResponse(res) {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            console.log("Response end. Length:", rawData.length);
            console.log("Preview:", rawData.substring(0, 100));
            const result = simulateProxy(rawData);
            console.log("Proxy simulation result:", result.type);
            if (result.data && result.data.tamu) {
                console.log("Data Tamu count:", result.data.tamu.length);
            } else if (result.data) {
                console.log("Data keys:", Object.keys(result.data));
            }
        } catch (e) {
            console.error(e.message);
        }
    });
}

testFetch();
