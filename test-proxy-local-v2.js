
const url = "https://script.google.com/macros/s/AKfycbyBUfzE-wi986gYo1CyAuKy_JAeESfHy4HgmiNR-vUQaKzuPd4OUnJjg8XTT3EPvkOd/exec";

// Mock implementation of logic in route.ts
const simulateProxy = (text) => {
    try {
        // 1. Try JSON
        try {
            const jsonData = JSON.parse(text);
            return { type: 'JSON', data: jsonData };
        } catch (e) {
            // Ignore
        }

        // 2. Try JSONP
        const jsonMatch = text.match(/callback\(([\s\S]*)\)/);
        if (jsonMatch) {
            return { type: 'JSONP', data: JSON.parse(jsonMatch[1]) };
        }
        return { type: 'ERROR', data: null };
    } catch (e) {
        return { type: 'EXCEPTION', data: e.message };
    }
};

async function testFetch() {
  console.log("Starting fetch...");
  try {
    const response = await fetch(url);
    console.log("Fetch complete. Status:", response.status);
    const text = await response.text();
    console.log("Text length:", text.length);
    console.log("Preview:", text.substring(0, 50));
    
    const result = simulateProxy(text);
    console.log("Proxy simulation result:", result.type);
    if (result.data && result.data.tamu) {
        console.log("Data Tamu count:", result.data.tamu.length);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testFetch();
