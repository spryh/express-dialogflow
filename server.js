var express = require("express");
var bodyParser = require("body-parser");
var requestPromise = require("request-promise");

var app = express();

var port = process.env.PORT || 3000;
var ip = process.env.IP || "127.0.0.1";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", function(req, res) {
  var response = "";

  if (req.body.result.action == "checkVote") {
    console.log("*******Vote*******");
    var age = req.body.result.parameters.age.amount;
    if (age >= 18) {
      response = `Yes, you can vote at ${age}`;
    } else {
      response = `No, you can't vote at ${age}`;
    }
    console.log(response);
    res.json({
      speech: response,
      displayText: response
    });

  } else if (
    req.body.result.action in { Add: "", Subtract: "", Mult: "", Div: "" }) {
    console.log("*******Math*******");
    var num1 = parseFloat(req.body.result.parameters.number1);
    var num2 = parseFloat(req.body.result.parameters.number2);

    if (req.body.result.action == "Add") {
      var sum = num1 + num2;
      var response = `The sum of ${num1} and ${num2} is ${sum}`;
    } else if (req.body.result.action == "Subtract") {
      var diff = num1 - num2;
      var response = `The difference of ${num1} and ${num2} is ${diff}`;
    } else if (req.body.result.action == "Mult") {
      var mult = num1 * num2;
      var response = `The product of ${num1} and ${num2} is ${mult}`;
    } else if (req.body.result.action == "Div") {
      var div = num1 / num2;
      var response = `${num1} divided by ${num2} is ${div}`;
    }
    console.log(response);
    res.json({
      speech: response,
      displayText: response
    });

  } else if (req.body.result.action == "getWeather") {
    console.log("*******Weather*******");
    var city = encodeURIComponent(req.body.result.parameters.city);
    const APP_ID = "284662c8a7d8adc1b60123a3b3dd95d0";

    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_ID}`;
    console.log(url)

    var request = {
      uri: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_ID}`,
      // qs: {
      //   q: "" + city,
      //   appid: APP_ID
      // },
      headers: {"User-Agent": "Request-Promise"},
      json: true
    };

    requestPromise(request)
      .then(responseJSON => {
        console.log(JSON.stringify(responseJSON.name));
        var temp = Math.round(((9/5)*(responseJSON.main.temp - 273.15)) + 32);
        response = `The temperature in ${decodeURI(city)} is ${temp} degrees farenheit.`;
        console.log(response);
        res.json({
          speech: response,
          displayText: response
        });
      })
      .catch(err => {
        // API call failed...
      });
  } else {
    console.log("*******OTHER*******");
  }
});

app.listen(port, ip);
