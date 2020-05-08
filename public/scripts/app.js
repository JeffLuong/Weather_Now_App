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

  this.getCondition = function(code, time) {
    let condition = `#clear-${time}`;
    // Use time to concat a string that renders the correct SVG
    if (code >= 300 && code < 400) {
      return '#cloudy, #drizzle-rain';
    } else if ((code >= 200 && code < 300) || (code >= 500 && code < 600)) {
      condition = '#dark-clouds, #drizzle-rain';
      if (code >= 200 && code < 300) {
        return `${condition}, #lightning`;
      }
      return condition;
    } else if (code >= 600 && code < 700) {
      return '#cloudy, #snow';
    } else if (code >= 700 && code < 800) {
      return '#atmosphere';
    } else if (code >= 800 && code < 900) {
      if (code === 800) {
        return condition;
      } else if (code === 801) {
        return `#few-clouds-${time}`;
      } else if (code === 802) {
        return '#scattered-clouds';
      } else if (code === 803 || code === 804) {
        return '#cloudy';
      }
      return condition;
    } else if (code >= 900 && code < 1000) {
      if (code === 900 || code === 902 || code >= 960 && code <= 962) {
        return '#extreme-storm';
      } else if (code === 905 || code >= 956 && code <= 959) {
        return '#windy';
      }
      return condition;
    }
    return condition;
  }

  this.renderCondition = function(code, hour) {
    const time = hour >= 6 && hour <= 18 ? 'day' : 'night';
    const condition = this.getCondition(code, time);

    if (condition.includes('#dark-clouds')) {
      $('.drops').addClass('heavy');
    }

    this.renderSVG(condition);
    $('body').css({ 'background-color': time === 'day' ? '#ADD8E6' : '#022078' });
  };

  this.renderSVG = function(condition) {
    $(condition).addClass('is-visible');
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
