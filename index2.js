const { nextISSTimesForMyLocation } = require('./iss_promised');

//callback function to convert risetime to universal standard format and print the next pass times
const printPassTimes = function(passTimes) {
  for(const pass of passTimes) {
    const dateTime = new Date();
    dateTime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
  }
}

nextISSTimesForMyLocation()
  .then((passTimes) => {
    console.log(passTimes);
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });