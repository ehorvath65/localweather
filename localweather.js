$(function() {
    var darksky_api = "https://api.darksky.net/forecast/4e6cca0fe2052f9f2b8c230f148635a8/";
    var latitude = 0;
    var longitude = 0;
    var currently = "";
    var cels = true;

    navigator.geolocation.getCurrentPosition(success, error, options);
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(myPlace) {
        var crd = myPlace.coords;
        longitude = crd.longitude;
        latitude = crd.latitude;
        document.getElementById("coords").innerHTML = "latitude: " + latitude.toFixed(2) + " longitude: " + longitude.toFixed(2);
        locations();
        getWeather();
    }

    function error(err) {
        //console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    function locations() {
        var apiKey = "&key=929ff7ade8cc41e99b688b0ba3740134";
        $.getJSON(
            "https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + apiKey,
            function(data) {
                var components = data.results[0].components;
                var city = components.city;
                var postcode = components.postcode;
                var city_district = components.city_district;
                var suburb = components.suburb;
                var road = components.road;
                $("#location").html(postcode + " " + city + ", " + suburb);
            }
        );
    }

    function getWeather() {
        $.getJSON(darksky_api + latitude + ", " + longitude + "/?callback=?",
            function(data) {
                currently = data.currently;
                getShow();
            }
        );
    }

    function getShow() {
        $("#weather").html(currently.summary);
        console.log(currently);

        $("#temperature").html(
            Math.round((currently.temperature - 32) * 5 / 9) + " °C"
        );

        function celsius() {
            $("#temperature").html(
                Math.round((currently.temperature - 32) * 5 / 9) + " °C"
            );
            cels = true;
        }

        function fahrenheit() {
            $("#temperature").html(
                Math.round(currently.temperature) + " °F"
            );
            cels = false;
        }
        $("#temperature").click(function() {
            if (cels) {
                fahrenheit();
            } else {
                celsius();
            }
        });

        $("#uvIndex").html(
            "UV index: " + (currently.uvIndex)
        );

        $("#windSpeed").html(
            "Wind speed: " + (currently.windSpeed) + " m/s"
        );

        icon(currently);
    }

    function icon() {
        var skycons = new Skycons({
            monochrome: false,
            colors: {
                main: "#333333",
                moon: "#ffffb3",
                fog: "#78586F",
                fogbank: "#B4ADA3",
                cloud: "gainsboro",
                snow: "#7B9EA8",
                leaf: "#7B9EA8",
                rain: "lightblue",
                sun: "yellow"
            }
        });
        skycons.add("icon", currently.icon);
        skycons.play();
    }
});