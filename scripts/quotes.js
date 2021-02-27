"use strict";

/**
 * index.js
 * @author Ryan Paranich   <rparanich@northislandcollege.ca>
 * DGL113 W21 North Island College
 * February 25, 2021
 */

const panePrices = {
  uk: 18.0,
  ul: 10.0,
  um: 8.0,
  us: 6.0,
  mf: 2.0,
  ml: 6.0,
  mm: 4.0,
  ms: 3.0,
  gf: 1.0,
  gl: 5.0,
  gm: 3.0,
  gs: 2.0,
};

/**
 * @class   LineItem    Represents each individual line item object in the quote.
 * @param   paneType    The shorthand string for the type of pane being represented on this line.
 * @param   numberOf    The number of this panes being reprsented on thisline.
 * @param   priceOfEach The price of each pane of this type represented on this line.
 * @property    price   The total price of this line item (number of panes * price of each)
 * @method      outputString()  Returns the HTML ready string for the table row this line item occupies.
 */
class LineItem {
  constructor(paneType) {
    (this.paneType = paneType),
      (this.numberOf = 1),
      (this.priceOfEach = this.getPriceOf(this.paneType));
    this.price = this.calculatePrice();
    this.outputString = function () {
      let output =
        "<tr>" +
        `<td>${this.paneType}</td>` +
        `<td>${this.numberOf}</td>` +
        `<td>${this.getPrice()}</td>` +
        `<td>${this.calculatePrice()}</td>` +
        "</tr>";
      return output;
    };
  }

  calculatePrice = function () {
    return Number.parseFloat(this.priceOfEach * this.numberOf).toFixed(2);
  };

  getPrice = function () {
    return Number.parseFloat(this.priceOfEach).toFixed(2);
  };

  getPriceOf = function (paneType) {
    for (let [key, value] of Object.entries(panePrices)) {
      if (paneType == key) {
        return value;
      }
    }
  };

  increasePaneCount = function () {
    this.numberOf++;
  };
}

/**
 * Main script to run on loading
 */
const entrySection = document.getElementById("current-entry-section");
const collectionSection = document.getElementById("entry-list-section");

// set up delete and counter button
document.querySelectorAll("button").forEach((element) => {
  if (element.classList.contains("delete")) {
    element.addEventListener("click", (e) => deleteLine(e.target));
  } else {
    element.addEventListener("click", (e) => countPane(e.target));
  }
});
// for use in button click events
var currentPaneSelected, lastPaneSelected;
// for use in line item entry updating
var currentLineItemTable = document.getElementById("current-line-item");
var quoteTable = document.getElementById("quote-table");
var quoteLineItems = [];
var currentLineItem = new LineItem();

/**
 * Toggles the display style of a given element between "block" and "none".
 * @param {string} elementId The element ID to be effected.
 */
function toggleDisplay(elementId) {
  let elementToToggle = document.getElementById(elementId);
  if (elementToToggle.style.display == "none") {
    elementToToggle.style.display = "block";
  } else {
    elementToToggle.style.display = "none";
  }
}

function countPane(element) {
  currentPaneSelected = element.id;

  if (lastPaneSelected == currentPaneSelected) {
    // Selection multiple of current pane. Increase current line item pane count.
    currentLineItem.increasePaneCount();
  } else {
    // Selecting a new pane time, so start a new line item.
    if (currentLineItem.paneType !== undefined)
      addLineItemToQuote(currentLineItem.outputString());
    currentLineItem = new LineItem(element.id);
  }

  updateCurrentLineItem();

  // lastly, set the last pane selected variable equal to this current selection
  lastPaneSelected = currentPaneSelected;
}

function addLineItemToQuote(newLineItem) {
  collectionSection.style.display = "block";

  let outputString = "";
  quoteLineItems.push(newLineItem);

  for (const lineItem of quoteLineItems) {
    outputString += lineItem;
  }

  quoteTable.innerHTML = outputString;
}

function updateCurrentLineItem() {
  entrySection.style.display = "block";
  // todo: output table header
  currentLineItemTable.innerHTML = currentLineItem.outputString();
}
