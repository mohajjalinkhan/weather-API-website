require('dotenv').config()
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    //console.log(req.body.cityName)
    const query = req.body.cityName;
    const api_key = process.env.API
    const unit = "metric"
   
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + api_key + "&units=" + unit
    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {

            const weatherData = JSON.parse(data)
            const weathertemp = weatherData.main.temp
            const icon = weatherData.weather[0].icon
            const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            const weatherDescription = weatherData.weather[0].description
            res.write("<h1>Temperature in " + query + " " + weathertemp + " degrees celcius.</h1>")
            res.write("<h3>Weather Description: " + weatherDescription + " </h3>")
            res.write("<img src=" + imgURL + ">");
            
        })
    })

});


app.listen(process.env.PORT||3000, function () {
    console.log("Server is running on port 3000");
})