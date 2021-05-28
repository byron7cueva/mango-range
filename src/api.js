const BASE_URL = "http://localhost:8081";

const options = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    method: "GET"
  }
}

async function get(endpoint) {
  const url = BASE_URL + endpoint;
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}


export const Api = {
  getAllRanges() {
    return get('/ranges');
  }
}