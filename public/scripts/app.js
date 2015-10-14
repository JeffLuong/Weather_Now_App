console.log("app.js loaded...");
var app = angular.module('w-Now', []);

app.controller('w-NowController', ['$http', '$scope', '$compile', function($http, $scope, $compile) {

  this.temp;
  this.tempF;
  this.tempC;
  this.currTemp;
  this.urlKey = "c4a7a0b1db1f6b2be70ba3d035152ad7";

  var controller = this;

  this.getLocation = function() {
    console.log("getting current location...");
    var url = "https://freegeoip.net/json/?callback=JSON_CALLBACK";
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
    $http.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=" + this.urlKey)
      .success(function (data) {
        console.log("data received...", data);
        var date = new Date(),
            hour = date.getHours();

        controller.temp = data.main.temp;
        controller.renderElems(data.weather[0].id, controller.temp, hour);
      });
  };

  this.renderElems = function(code, temp, hour) {
    this.renderCondition(code, hour);
    this.convertTempUnit(temp);
  };

  this.renderCondition = function(code, hour) {
    console.log("rendering conditions", code);
    var time;

    if (hour >= 6 && hour <= 18) {
      time = "day";
      $('body').css({
        'background-color' : '#ADD8E6'
      });
    } else {
      time = "night";
      $('body').css({
        'background-color' : '#022078'
      });
    }

    // Use time to concat a string that renders the correct SVG
    if (code >= 300 && code < 400) {
      this.renderSVG("#cloudy, #drizzle-rain");
    } else if ((code >= 200 && code < 300) || (code >= 500 && code < 600)) {
      this.renderSVG("#dark-clouds, #drizzle-rain");
      $(".drops").addClass("heavy");
      if (code >= 200 && code < 300) {
        this.renderSVG("#lightning");
      }
    } else if (code >= 600 && code < 700) {
      this.renderSVG("#cloudy, #snow");
    } else if (code >= 700 && code < 800) {
      this.renderSVG("#atmosphere");
    } else if (code >= 800 && code < 900) {
      if (code === 800) {
        this.renderSVG("#clear-" + time);
      } else if (code === 801) {
        this.renderSVG("#few-clouds-" + time);
      } else if (code === 802) {
        this.renderSVG("#scattered-clouds");
      } else if (code === 803 || code === 804) {
        this.renderSVG("#cloudy");
      }
    } else if (code >= 900 && code < 1000) {
      if (code === 900 || code === 902 || code >= 960 && code <= 962) {
        this.renderSVG("#extreme-storm");
      } else if (code === 905 || code >= 956 && code <= 959) {
        this.renderSVG("#windy");
      }
    };
  };

  this.renderSVG = function(condition) {
    $(condition).css({
      "display" : "block"
    });
  };

  this.convertTempUnit = function(temp) {
    this.tempF = Math.floor(((temp - 273.15) * 1.8) + 32);
    this.tempC = Math.floor(temp - 273.15);

    this.assignDefaultTemp(this.tempF);
  };

  this.assignDefaultTemp = function(temp) {
    this.currTemp = temp;
    this.toggleSelected("F");
  };

  this.toggleTemp = function(unit) {
    if (unit === "F") {
      this.currTemp = this.tempF;
    } else if (unit === "C") {
      this.currTemp = this.tempC;
    }
    this.toggleSelected(unit);
  }

  this.toggleSelected = function(unit) {
    $('.temp' + unit).addClass('selected');

    if (unit !== "F") {
      $('.tempF').removeClass('selected');
    } else if (unit !== "C") {
      $('.tempC').removeClass('selected');
    }
  };


  this.getLocation();

}]);
