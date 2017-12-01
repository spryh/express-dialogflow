var express = require("express");
var bodyParser = require("body-parser");

var app = express();

var port = process.env.PORT || 3000;
var ip = process.env.IP || "127.0.0.1";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", function(req, res) {
  console.log(req.body);
  var response = "";

  if (req.body.result.action == "checkVote") {
    var age = req.body.result.parameters.age;
    console.log(age);

    if (age.amount >= 18) {
      response = "Yes";
    } else {
      response = "No";
    }
  } 
  
  else if (req.body.result.action == "Add") {
    var num1 = parseFloat(req.body.result.parameters.number1);
    var num2 = parseFloat(req.body.result.parameters.number2);

    var sum = num1 + num2;

    var response = `The sum of ${num1} and ${num2} is ${sum}`;
  }

  else if (req.body.result.action == "Subtract") {
    var num1 = parseFloat(req.body.result.parameters.number1);
    var num2 = parseFloat(req.body.result.parameters.number2);

    var diff = num1 - num2;

    var response = `The difference of ${num1} and ${num2} is ${diff}`;
  }

  else if (req.body.result.action == "Mult") {
    var num1 = parseFloat(req.body.result.parameters.number1);
    var num2 = parseFloat(req.body.result.parameters.number2);

    var mult = num1 - num2;

    var response = `The difference of ${num1} and ${num2} is ${mult}`;
  }

  else if (req.body.result.action == "Div") {
    var num1 = parseFloat(req.body.result.parameters.number1);
    var num2 = parseFloat(req.body.result.parameters.number2);

    var div = num1 - num2;

    var response = `The difference of ${num1} and ${num2} is ${div}`;
  }

  res.json({
    speech: response,
    displayText: response
  })

});

app.listen(port, ip);
