if (Meteor.isClient) {

  Meteor.startup(function() {
  });

  var DEFAULT_WINDSPEED = 10,
      DEFAULT_TEMP = 32;


  Template.windChillCalculator.invokeAfterLoad = function() {
      // slight delay to make sure all elements are loaded
      setTimeout(function() {updateWindChill(DEFAULT_WINDSPEED, DEFAULT_TEMP)}, 100);
  }

 
  Template.windSpeedControl.rendered = function() {
    $("#windSlider").slider({
      'range': false,
      'min': 0,
      'max': 60,
      'value': DEFAULT_WINDSPEED -1,
      'orientation': "horizontal",
      'slide': function(event, ui) {
        updateWindChill();
      }
    });
    $("#windScale").slider({
      'range': false,
      'min': 0,
      'max': 1,
      'orientation': 'horizontal',
      'stop': function(event, ui) {
        updateWindChill();
      }
    });
  }
 
  Template.tempControl.rendered = function() {
    $("#tempSlider").slider({
      'range': false,
      'min': -45,
      'max': 45,
      'value': DEFAULT_TEMP,
      'orientation': "horizontal",
      'slide': function(event, ui) {
        updateWindChill();
      },
    });
    $("#tempScale").slider({
      'range': false,
      'min': 0,
      'max': 1,
      'orientation': 'horizontal',
      'stop': function(event, ui) {
        updateWindChill();
      }
    });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


/************* the helper functions ************/

var toggleSliderStyle = function (tempScale) {
  if(tempScale === 'metric') {
    $('.ui-slider').css('background', 'blue');
  }
  else {
    $('.ui-slider').css('background', 'green');
  }
}

/**
  * @function updateWindChill
  *
  * @param {Number} speed wind speed
  * @param {Number} temp temperature
  *
  * Updates the contents of the calculator canvas
  */
var updateWindChill = function(speed, temperature) {
  var windSpeed = (speed ? speed : $("#windSlider").slider("value")) + 1,
      temperature = temperature ? temperature : $("#tempSlider").slider("value"),
      tempScale = $('#tempScale').slider('value') === 0 ? 'english' : "metric",
      windScale = $('#windScale').slider('value') === 0 ? 'english' : "metric",
      // default labels
      perHour = "MPH",
      degrees = "F",
      windChill = _calcWindChill(windSpeed, temperature),
      // output goes in a <canvas> element
      chillFill = "green",
      b_canvas = document.getElementById("calculator"),
      b_context = b_canvas.getContext("2d");

  if(tempScale === "metric") {
    perHour = "KPH";
    windSpeed = Math.round((windSpeed * 16)/10);
    degrees = "C";
    temperature = fahr2Cel(temperature);
    windChill = fahr2Cel(windChill);
    chillFill = "#000080";
  }
  toggleSliderStyle(tempScale);

  b_context.clearRect(0, 0, b_canvas.width, b_canvas.height);
  b_context.font = "bold 15px tahoma";
  b_context.textBaseline = "top";
  b_context.fillStyle = '#333333';
  b_context.fillText("Temp: " + temperature + " " + degrees, 8, 10);
  b_context.fillText("Wind: " + windSpeed + " " + perHour, 106, 10);

  b_context.font = "bold 20px tahoma";
  b_context.fillStyle = chillFill;  // now we can make the temp color change for hot and cold :)
  b_context.fillText("Windchill: " + windChill + " " + degrees, 33, 30);

}

/**
  * @function _calcWindChill
  *
  * @param {Number} windSpeed
  * @param {Number} temperature
  * @return {Number} windChill calculated wind chill factor for temperature and windspeed
  */
var _calcWindChill = function(windSpeed, temperature) {
  // too bad Javascript sucks with floating-point numbers
  var windChillTemperature = Math.floor((35.74 + .6215 * temperature - 35.75*Math.pow(windSpeed, 0.16) + (.4275*temperature*Math.pow(windSpeed, 0.16))));
  return windChillTemperature;
}


function fahr2Cel(temp) {
  return Math.round((temp - 32) * 5/9);
}

function temp2Color(temp) {
  //return "blue";
  var r = Math.round((255 - temp - 15) / 2),
      g, b;

  g = Math.round((255 - temp - 30) / 2);
  //g = Math.round(288.1221 * 1/g); //(Math.pow(g, 0.0755)));
  if (g < 0) { g = 128; }
  if (g > 255) { g = 255; }

    b = Math.round((255 - temp) / 2);

  if (b < 0) { b = 64; }
  if (b > 255) { b = 255; }

  //r = parseInt(r, 16);

  r = r.toString(16);

  g = g.toString(16);

  b = b.toString(16);
    console.log('red' + r);
    console.log('green' + g);
    console.log('blue' + b);

 
  fill =  '#' + r + g + b;
  return fill;
}
