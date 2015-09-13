var app = angular.module('w-Now', []);

app.controller('w-NowController', ['$http', '$scope', function($http, $scope) {

  this.unitDefault = "F";
  var controller = this;

  this.getLocation = function() {
    console.log("getting current location...");
    var url = "http://freegeoip.net/json/?callback=JSON_CALLBACK";
    $http.jsonp(url)
  .success(function (data) {
        console.log("this is the location data received...", data);

        var long = data.longitude,
            lat  = data.latitude;

        console.log(lat, long);

        controller.currWeather(lat, long);
    }).error(function (data) {
      console.log("Error", data);
    });
  };

  this.currWeather = function(lat, long) {
    console.log("getting current weather data...");
    $http.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long)
      .success(function (data) {
        console.log("data received...", data);
        var date               = new Date(),
            hour               = date.getHours();

        controller.temp = data.main.temp;
        controller.renderElems(data.weather[0].id, controller.temp, hour);
      });
  };

  this.renderElems = function(code, temp, hour) {
    this.renderCondition(code, hour);
    this.renderTemp(temp);
  };

  this.renderCondition = function(code, hour) {
    console.log("rendering conditions");
    // console.log(code);
    var time;

    if (hour >= 6 && hour <= 18) {
      time = "day";
    } else {
      time = "night";
    }

    if (code >= 200 && code < 300) {
      console.log("rendering", time, "thunderstorm svg...");
    } else if (code >= 300 && code < 400) {
      console.log("rendering", time, "drizzle svg...");
    } else if (code >= 500 && code < 600) {
      console.log("rendering", time, "rain svg...");
    } else if (code >= 600 && code < 700) {
      console.log("rendering", time, "snow svg...");
    } else if (code >= 700 && code < 800) {
      console.log("rendering", time, "atmosphere svg...");
    } else if (code >= 800 && code < 900) {
      console.log("rendering", time, "clouds svg...");
    } else if (code >= 900 && code < 1000) {
      this.renderSpecialConditions(code);
    }
  };

  this.renderTemp = function(temp) {
    // console.log("rendering Temp...temp is", temp);
  };

  this.switchTempUnit = function(unit) {

    if (unit !== this.unitDefault) {
      //convert unit first in render temp? 
    }
  };

  this.getLocation();

}]);
