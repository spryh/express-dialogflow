var express = require("express");
var bodyParser = require("body-parser");
var requestPromise = require("request-promise");
var Themeparks = require("themeparks");

var app = express();

var port = process.env.PORT || 3000;
var ip = process.env.IP || "127.0.0.1";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", function(req, res) {
  var response = "I didn't get that. What did you say?";

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
        console.log("API call failed.")
      });
  } else if (req.body.result.action == "whatParks") {


//---------------------------------------
// 
// Find a park library
// 
//---------------------------------------

var response ="I can check wait times for "
var parkList = ""
var parksToFind = "World Florida"

var parksFuncArr = [];

for (var park in Themeparks.Parks) {
    var parkName = String(new Themeparks.Parks[park]().Name)
    parksFuncArr.push([parkName,`Themeparks.Parks.${park}`])
    if (parkName.indexOf(parksToFind) >=0) {
      parkList += `${parkName.split(' -')[0]}, `

    }
}

response += parkList.replace(/,(?=[^,]*$)/, '.')
response = `${response.replace(/,(?=[^,]*$)/, ' and')}`
response += `Which park are you interested in?`
console.log(response)
      res.json({
        speech: response,
        displayText: response
      })


    } else if (req.body.result.action == "getRideWait") {

//---------------------------------------
// 
// Park Selector
// 
//---------------------------------------

var parkToFindUnique = req.body.result.parameters.parkName
var selectedParkName = "Server Error"

if ("Magic Kingdom".indexOf(parkToFindUnique) >=0) {
selectedParkName = "Magic Kingdom"
var selectedPark = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
} 

else if ("Epcot".indexOf(parkToFindUnique) >=0) {
selectedParkName = "Epcot"
var selectedPark = new Themeparks.Parks.WaltDisneyWorldEpcot()}

else if ("Animal Kingdom".indexOf(parkToFindUnique) >=0) {
  selectedParkName = "Animal Kingdom"
  var selectedPark = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom()}

else if ("Hollywood Studios".indexOf(parkToFindUnique) >=0) {
selectedParkName = "Hollywood Studios"
var selectedPark = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios()}

console.log(`Server: ${selectedParkName} API registered.`)

//---------------------------------------
// 
// Find opening status and closing time
// 
//---------------------------------------

var timeToFind = "Closing"
var parkStatus = "Operating"

selectedPark.GetOpeningTimes()
.then((times) =>{
    parkStatus = times[0].type            // get only today's time, the first from the list
    var oTS = times[0].openingTime
    var cTS = times[0].closingTime
    var parkOpenHr = new Date(oTS.substring(0, oTS.lastIndexOf("-"))).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
    var parkCloseHr = new Date(cTS.substring(0, cTS.lastIndexOf("-"))).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
    
    if (parkStatus == "Operating") { 
        response = `${selectedParkName}`
        if (timeToFind == "Opening") {
          response += ` will open at ${parkOpenHr} Florida time today. `
          } 
        else if (timeToFind == "Closing") { 
                response += ` is open until ${parkCloseHr} Florida time today. `
                }        
    }
    else { 
        response = `${selectedParkName} is closed today. I'm sorry.`
        console.log(response)
        res.json({speech: response, displayText: response})

    }
}, console.error)


//---------------------------------------
// 
// Find wait times for a ride in the park
// 
//---------------------------------------

.then((rides) =>{

    var textToFind = req.body.result.parameters.rideName
    console.log(`Server: ${textToFind} ride requested.`)
    var nowTime = new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: false})
    console.log (nowTime)

if (parkStatus == "Operating") {
    selectedPark.GetWaitTimes()
    
    .then(rides =>{
        for(var i=0, ride; ride=rides[i++];) {
            if (ride.name.indexOf(textToFind) >=0) {
                if (ride.waitTime < 1) { response += `${ride.name.replace(/\"/g, '')} has no wait right now!`}
                else {response += `${ride.name.replace(/\"/g, '')} has a ${ride.waitTime} minute wait.`}
            }
        }
        console.log(response)
        res.json({speech: response, displayText: response})
    }, console.error);
    }
}, console.error);

} else if (req.body.result.action == "getAllRides") {
  var disneyMagicKingdom = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();
  
  // access wait times by Promise
  disneyMagicKingdom.GetWaitTimes().then(function(rides) {
      // print each wait time
      for(var i=0, ride; ride=rides[i++];) {
          console.log(ride.name)// + ": " + ride.waitTime + " minutes wait");
      }
  }, console.error);
  
  } else {
    console.log("Server: Intent not found");
  }
});

app.listen(port, ip);