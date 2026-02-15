
const url = "https://script.google.com/macros/s/AKfycbyBUfzE-wi986gYo1CyAuKy_JAeESfHy4HgmiNR-vUQaKzuPd4OUnJjg8XTT3EPvkOd/exec";

async function testFetch() {
  try {
    console.log("Fetching: " + url);
    const response = await fetch(url);
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Content-Type:", response.headers.get("content-type"));
    console.log("Body preview (first 500 chars):");
    console.log(text.substring(0, 500));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testFetch();
