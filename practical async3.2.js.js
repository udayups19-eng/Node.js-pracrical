// async.js
function fetchUserData() {
  console.log("Fetching data...");

  setTimeout(() => {
    console.log("Data received");
  }, 2000); // waits 2 seconds
}

fetchUserData();
