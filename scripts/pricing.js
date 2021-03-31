"use strict";

/**
 * pricing.js
 * @author  Ryan Paranich   <rparanich@northislandcollege.ca>
 * Handles the pricing page features and functions. Using session storage to store adjusted
 * pricing, while using a default price list as a base line.
 */

/**
 * Making sure we have fully loaded the page before constructing our pricing table.
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
  var inputPrices = $("input.price");
  var startQuote = document.getElementById("save-and-build");

  populateTooltips();

  /* Fill in values into the input boxes. If we have cookie values saved, use those. Else, use default values. */
  for (let i = 0; i < inputPrices.length; i++) {
    inputPrices[i].value = doesCookieExist(`paneType${i}`)
      ? getCookie(`paneType${i}`)
      : defaultPrices[i].value.toFixed(2);

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
      setCookie(`paneType${i}`, inputPrices[i].value, 1);
    }
    window.location.href = "count.html";
  });
}

/**
 * Loops through our array of name plates (the text centered above each price input box) and attach the
 * respective tooltip to be displayed upon hovering over a name plate. Tap instead of hover, on mobile.
 */
function populateTooltips() {
  var namePlates = $("div.tooltip");
  for (let i = 0; i < namePlates.length; i++) {
    // adds the name
    namePlates[i].innerHTML = defaultPrices[i].name;
    // adds the tooltip text
    let toolTipText = document.createElement("span");
    toolTipText.className = "tooltiptext";
    let toolTipTextNode = document.createTextNode(defaultPrices[i].description);
    toolTipText.appendChild(toolTipTextNode);
    namePlates[i].appendChild(toolTipText);
  }
}
