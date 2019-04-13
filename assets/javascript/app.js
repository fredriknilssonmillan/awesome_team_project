


// First: Make sure to link jQuery in html file

// Query to get current IP from IPIFY API + Console LOG
var queryIP = "https://api.ipify.org?format=json";
console.log(queryIP);

// Fixed known IP belonging to Denver Colorado, in order to use ir later for the "Select Location" logic
const fixedIP = "154.16.91.131";

// API Key for GEO API (reverse code the IP to get object with location details i.e. city, region, lat&lng, etc...)
const apiKeyIP = "at_knMW8P4hXMF72fVn0z8jG2ZnwPsAy";

// Query for GEO API + Console LOG
var queryURLGeoIP = "https://geo.ipify.org/api/v1?" + apiKeyIP + "&ipAddress=" + fixedIP + "&=json";
console.log("queryURLGeoIP: " + queryURLGeoIP);
// -------------------------------------------------------------------------------------------------------------
// Code Snippet for CURRENT LOCATION logic
// AJAX Function to call the current public IP, and the a second AJAX Function within to call the reverse code from the current IP

$("#current").on("click", currentIPLocation);


function currentIPLocation() {
    $.ajax({
        url: queryIP, method: "GET"
    })
        .done(function (response) {
            console.log("Current Public IP: " + response.ip);
            var currentIP = response.ip;
            $(function () {
                $.ajax({
                    url: "https://geo.ipify.org/api/v1",
                    dataType: "json",
                    data: { apiKey: apiKeyIP, ipAddress: currentIP },
                    success: function (data) {
                        console.log(data);
                        console.log("Current City: " + data.location.city);
                        console.log("Current Region: " + data.location.region);
                        console.log("Current Country: " + data.location.country);
                        console.log("Current Latitude: " + data.location.lat);
                        console.log("Current Longitude: " + data.location.lng);
                        console.log("Current Zip Code: " + data.location.postalCode);
                    }
                });
            });
        })
}

// 2 different API Keys (same one) just sintaxis purposes, from BreweryDB API
const apikey = "/?key=9968a2f544553322a8a49f3fb2916c09";
const apikey2 = "&key=9968a2f544553322a8a49f3fb2916c09";

// Partial for query from BreweryDB API
var baseURL = "http://sandbox-api.brewerydb.com/v2/";

// Complement portion for random beer query + concatenation + Console LOG
var randomBeer = "beer/random";
var queryURLrandom = baseURL + randomBeer + apikey;
console.log(queryURLrandom);
var locations = [];

$("#random").on("click", random);

function random() {
    $.ajax({
        url: queryURLrandom, method: "GET"
    })
        .done(function (response) {
            console.log("Name: " + response.data.name);
            console.log("Category: " + response.data.style.category.name);
            console.log("Alcohol by volume(abv): " + response.data.abv + "%");
            console.log("International Bitterness Units(ibu): " + response.data.ibu);
            console.log("Style: " + response.data.style.name);
            console.log("Style description: " + response.data.style.description);
            var beerID = response.data.id;
            var auxiliaryFields = "&withBreweries=Y&withSocialAccounts=Y&withIngredients=Y";
            var queryURLbeerByID = baseURL + "beer/" + beerID + apikey + auxiliaryFields;
            console.log(queryURLbeerByID);
            $.ajax({
                url: queryURLbeerByID, method: "GET"
            })
                .done(function (response) {
                    var selectedBeer = $("<p>").text("Selected Beer: " + response.data.name);
                    $("#resultscontainer").append(selectedBeer);
                    if (response.data.hasOwnProperty("labels")) {
                        $("#resultscontainer").append("<img src=" + response.data.labels.large + ">");
                    }
                })
            console.log("Beer ID: " + beerID);
            var breweryByBeerID = "beer/" + beerID + "/breweries";
            var queryURLbrewery = baseURL + breweryByBeerID + apikey;
            console.log(queryURLbrewery);
            $.ajax({
                url: queryURLbrewery, method: "GET"
            })
                .done(function (response) {
                    console.log("Brewery: " + response.data[0].name);
                    var breweryID = response.data[0].id;
                    console.log("Brewery ID: " + breweryID);
                    var locationByBreweryID = "brewery/" + breweryID + "/locations";
                    var queryURLlocations = baseURL + locationByBreweryID + apikey;
                    console.log(queryURLlocations);
                    $.ajax({
                        url: queryURLlocations, method: "GET"
                    })
                        .done(function (response) {
                            console.log(response.data.length);
                            for (i = 0; i < response.data.length; i++) {
                                locations.push(response.data[i].id);
                                // console.log(response.data[i].id);
                            }
                            console.log(locations);
                            console.log(locations.length);
                            var randomIndex = Math.floor(Math.random() * locations.length);
                            console.log(randomIndex);
                            var winnerID = locations[randomIndex];
                            console.log(winnerID);
                            var winnerByLocationID = "location/" + winnerID;
                            var queryURLwinner = baseURL + winnerByLocationID + apikey;
                            console.log(queryURLwinner);
                            $.ajax({
                                url: queryURLwinner, method: "GET"
                            })
                                .done(function (response) {
                                    console.log("Random Location: " + response.data.locality + ", " + response.data.region + ", " + response.data.country.isoCode);
                                    console.log("Latitude: " + response.data.latitude);
                                    console.log("Longitude: " + response.data.longitude);
                                    var selectedLocation = $("<p>").text("Selected Location: " + response.data.locality + ", " + response.data.region + ", " + response.data.country.isoCode);
                                    $("#resultscontainer").append(selectedLocation);
                                })
                        })
                })
        })
}

$("#resultscontainer").hide();

$(".action").click(function () {

    $("#searchcontainer").hide();
    $("#resultscontainer").show(500);

})



