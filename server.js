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
    console.log("*******Vote*******")
    var age = req.body.result.parameters.age;
    console.log(age);

  //   if (age.amount >= 18) {
  //     response = "Yes";
  //   } else {
  //     response = "No";
  //   }
  } else if (req.body.result.action == "Add" ) {
    console.log("*******Math*******")
  //   var num1 = parseFloat(req.body.result.parameters.number1);|| "Subtract" || "Mult" || "Div"
  //   var num2 = parseFloat(req.body.result.parameters.number2);

  //   if (req.body.result.action == "Add") {
  //     var sum = num1 + num2;
  //     var response = `The sum of ${num1} and ${num2} is ${sum}`;
  //   } else if (req.body.result.action == "Subtract") {
  //     var diff = num1 - num2;
  //     var response = `The difference of ${num1} and ${num2} is ${diff}`;
  //   } else if (req.body.result.action == "Mult") {
  //     var mult = num1 * num2;
  //     var response = `The product of ${num1} and ${num2} is ${mult}`;
  //   } else if (req.body.result.action == "Div") {
  //     var div = num1 / num2;
  //     var response = `${num1} divided by ${num2} is ${div}`;
  //   }
  } else if (req.body.result.action == "getWeather" ) {
    console.log("*******Weather*******")
    var city = encodeURI(req.body.result.parameters.city);
    const APP_ID = "284662c8a7d8adc1b60123a3b3dd95d0";
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_ID}`;

    //console.log(url)
    // request(url, function(error, result, body) {
    //   console.log('TEMP:', JSON.parse(body).main.temp)   
    //   var temp = Math.round(JSON.parse(body).main.temp - 273.15);
    //   console.log('C TEMP:',temp)  
    //   var response = `The temperature in ${city} is ${temp} degrees celcius.`;
    //   console.log('Response:',response)  
    // });
    var request = {
      uri: "http://api.openweathermap.org/data/2.5/weather?",
      qs: {
        'q': city,
        'appid': APP_ID
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
  };
    requestPromise(request)
    .then(response => {
        console.log(response.main.temp);
        var temp = Math.round(response.main.temp - 273.15);
        var answer = `The temperature in ${city} is ${temp} degrees celcius.`;
        console.log(answer)   
    })
    .catch(err => {
        // API call failed...
    });

  } else {
    console.log("*******OTHER*******")
  }

  //console.log("******* JSON PAYLOAD *******/n",response)
  
  res.json({
    speech: response,
    displayText: response
  });
  //console.log(req.body);
});

app.listen(port, ip);
