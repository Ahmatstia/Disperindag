
const url = "https://script.google.com/macros/s/AKfycbyBUfzE-wi986gYo1CyAuKy_JAeESfHy4HgmiNR-vUQaKzuPd4OUnJjg8XTT3EPvkOd/exec";

async function testProxyLogic() {
  try {
    console.log("Fetching: " + url);
    const response = await fetch(url);
    const text = await response.text();
    console.log("Response length:", text.length);

    // Logic from route.ts
    let data;
    try {
        data = JSON.parse(text);
        console.log("Parsed as JSON directly");
    } catch (e) {
        console.log("Not valid JSON, trying JSONP regex...");
        const jsonMatch = text.match(/callback\(([\s\S]*)\)/);
        if (jsonMatch) {
            console.log("Matched JSONP regex!");
            data = JSON.parse(jsonMatch[1]);
            console.log("Parsed JSONP data successfully.");
             if (data.tamu && Array.isArray(data.tamu)) {
                console.log(`Found ${data.tamu.length} tamu records.`);
            } else {
                console.log("Data structure unexpected:", Object.keys(data));
            }
        } else {
            console.log("Failed to match JSONP regex.");
            console.log("First 100 chars:", text.substring(0, 100));
        }
    }

  } catch (err) {
    console.error("Test error:", err);
  }
}

testProxyLogic();
