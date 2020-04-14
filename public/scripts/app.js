const app = angular.module('w-Now', []);

app.controller('w-NowController', ['$http', '$scope', '$compile', function($http, $scope, $compile) {
  this.temp;
  this.tempF;
  this.tempC;
  this.currTemp;

  const controller = this;

  this.getWeather = function() {
    const _this = this;
    $http({
      method: 'GET',
      url: '/api/weather'
    }).then(function({ data }) {
      const date = new Date();
      const hour = date.getHours();

      controller.temp = data.main.temp;
      controller.renderElems(data.weather[0].id, controller.temp, hour);
    }).catch(function(err){
      _this.renderSVG('#error-msg');
      console.log(err);
    });
  };

  this.renderElems = function(code, temp, hour) {
    this.renderCondition(code, hour);
    this.convertTempUnit(temp);
  };

  this.renderCondition = function(code, hour) {
    let time;

    if (hour >= 6 && hour <= 18) {
      time = 'day';
      $('body').css({
        'background-color' : '#ADD8E6'
      });
    } else {
      time = 'night';
      $('body').css({
        'background-color' : '#022078'
      });
    }

    // Use time to concat a string that renders the correct SVG
    if (code >= 300 && code < 400) {
      this.renderSVG('#cloudy, #drizzle-rain');
    } else if ((code >= 200 && code < 300) || (code >= 500 && code < 600)) {
      this.renderSVG('#dark-clouds, #drizzle-rain');
      $('.drops').addClass('heavy');
      if (code >= 200 && code < 300) {
        this.renderSVG('#lightning');
      }
    } else if (code >= 600 && code < 700) {
      this.renderSVG('#cloudy, #snow');
    } else if (code >= 700 && code < 800) {
      this.renderSVG('#atmosphere');
    } else if (code >= 800 && code < 900) {
      if (code === 800) {
        this.renderSVG('#clear-' + time);
      } else if (code === 801) {
        this.renderSVG('#few-clouds-' + time);
      } else if (code === 802) {
        this.renderSVG('#scattered-clouds');
      } else if (code === 803 || code === 804) {
        this.renderSVG('#cloudy');
      }
    } else if (code >= 900 && code < 1000) {
      if (code === 900 || code === 902 || code >= 960 && code <= 962) {
        this.renderSVG('#extreme-storm');
      } else if (code === 905 || code >= 956 && code <= 959) {
        this.renderSVG('#windy');
      }
    };
  };

  this.renderSVG = function(condition) {
    $(condition).css({ 'display' : 'block' });
  };

  this.convertTempUnit = function(temp) {
    this.tempF = Math.floor(((temp - 273.15) * 1.8) + 32);
    this.tempC = Math.floor(temp - 273.15);

    this.assignDefaultTemp(this.tempF);
  };

  this.assignDefaultTemp = function(temp) {
    this.currTemp = temp;
    this.toggleSelected('F');
  };

  this.toggleTemp = function(unit) {
    if (unit === 'F') {
      this.currTemp = this.tempF;
    } else if (unit === 'C') {
      this.currTemp = this.tempC;
    }
    this.toggleSelected(unit);
  }

  this.toggleSelected = function(unit) {
    $('.temp' + unit).addClass('selected');

    if (unit !== 'F') {
      $('.tempF').removeClass('selected');
    } else if (unit !== 'C') {
      $('.tempC').removeClass('selected');
    }
  };

  this.getWeather();
}]);
