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
  // For this example, provide a mocked http service returning min and max values that have to be used in the component
  getAllRanges() {
    return get('/ranges');
  },
  // Provide a mocked http service that returns the array of numbers
  getAllFixedRanges() {
    return get('/fixedRanges');
  }
}