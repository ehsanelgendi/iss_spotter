const request = require('request-promise-native');

//Returns: Promise of request for ip data, returned as JSON string
const fetchMyIP = function () {
  return request('https://api.ipify.org/?format=json');
};

//Returns: Promise of request for lat/lon
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};

//Returns: Promise of request for fly over data, returned as JSON string
const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

//Returns: Promise for fly over data for users location
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
}

module.exports = { nextISSTimesForMyLocation };