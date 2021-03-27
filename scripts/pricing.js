"use strict";

/**
 * pricing.js
 * @author  Ryan Paranich   <rparanich@northislandcollege.ca>
 * Handles the pricing page features and functions. Using session storage to store adjusted
 * pricing, while using a default price list as a base line.
 */

window.addEventListener("load", () => {
  constructPricing();
});

/**
 * Constructs all of the pricing you see on the pricing page, including the name plates for each input box,
 * as well as the values within the pricing page. This construction also includes the event listeners for
 * each input box.
 */
function constructPricing() {
  var namePlates = document.querySelectorAll("div.tooltip");
  var inputPrices = document.querySelectorAll("input.price");
  var startQuote = document.getElementById("save-and-build");

  for (let i = 0; i < namePlates.length; i++) {
    // adds the name
    namePlates[i].innerHTML = prices[i].name;
    // adds the tooltip text
    let toolTipText = document.createElement("span");
    toolTipText.className = "tooltiptext";
    let toolTipTextNode = document.createTextNode(prices[i].description);
    toolTipText.appendChild(toolTipTextNode);
    namePlates[i].appendChild(toolTipText);
  }

  for (let i = 0; i < inputPrices.length; i++) {
    inputPrices[i].value = prices[i].value.toFixed(2);
    inputPrices[i].addEventListener("blur", () => {
      inputPrices[i].value = Number.parseFloat(inputPrices[i].value).toFixed(2);
    });
    inputPrices[i].addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        e.target.blur();
        inputPrices[i].value = Number.parseFloat(inputPrices[i].value).toFixed(
          2
        );
      }
    });
  }

  startQuote.addEventListener("click", () => {
    for (let i = 0; i < inputPrices.length; i++) {
      prices[i].value = inputPrices[i].value;
      setCookie(`paneType${i}`, inputPrices[i].value, 1);
    }
    window.location.href = "count.html";
  });
}
