import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Country } from "./types";

require("moment-duration-format")(moment);

fetch("https://restcountries.eu/rest/v2/all")
  .then(function(response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function(data) {
      ReactDOM.render(
        <App countries={data as ReadonlyArray<Country>} />,
        document.getElementById("root")
      );
    });
  })
  .catch(function(err) {
    console.log("Fetch Error :-S", err);
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
