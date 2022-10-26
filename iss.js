const request = require('request');


const fetchMyIP = function (callback) {
  request('https://api.ipify.org/?format=json', (error, responce, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (responce.statusCode !== 200) {
      const msg = `Status code ${responce.statusCode} when fetching IP. Responce: ${body}`;
      callback(Error(msg), null);
      return;
    }

    //parse the returned body
    const ip = JSON.parse(body);
    callback(error, ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  request(`http://ipwho.is/${ip.ip}`, (error, responce, body) => {
    if (error) {
      callback(error, null);
      return;
    }    
    //parse the returned body
    const data = JSON.parse(body);

    //check if success is true or false
    if (!data.success) {
      const msg = `Success status is: ${data.success}. Server message is: ${data.message}`;
      callback(Error(msg), null);
      return;
    }
    // create an object to return the latitude and longitude values
    const latLong = { latitude: data.latitude, longitude: data.longitude };
    callback(error, latLong);
  });
};

const fetchISSFlyOverTimes = function (coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, responce, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (responce.statusCode !== 200) {
      const msg = `Status code ${responce.statusCode} when fetching IP. Responce: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //parse the returned body
    const data = JSON.parse(body);
    callback(null, data.response);
  })
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    
    if (error) {
      return callback(error, null);
    }
    
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };