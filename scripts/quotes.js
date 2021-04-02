"use strict";

/**
 * @file  count.js
 * @author  Ryan Paranich <rparanich@northislandcollege.ca>
 *
 * NIC DGL113 W21
 *
 * This file build the general structure and functionality into our "build quote" or "count" page. This
 * page is responsible for allowing the user to use their preset default or custom price list to count
 * up panes of various height and size. It creates a live list for the user to view as they count panes
 * and size up the job. The user can also delete line items from the count if they've made a mistake or
 * wish to change the type of pane counted.
 */

const $btnBoard = $("div#buttonBoard");
const $lineItems = $("tbody");
const $tableFoot = $("tfoot"); //todo: remove and replace

const $ctrlBoard = $("div#summaryBoard");

const deleteIcon = "<i class='far fa-trash'</i>";
var lastButtonClicked;
var currentLineItem;

/**
 * @class Board
 * This class represents the button board for our pane counting. It structures the
 * board to follow a set convention and adds data attributes as required for the
 * program to function as intended.
 */
class Board {
  /**
   * Render this individual square. A "square" is the button that represents a
   * specific pane type.
   * @param {Number} i  Unique square identifier.
   * @see   Square      Class used to define a square.
   * @returns           Set HTML string for injection into the page.
   */
  renderSquare = function (i) {
    let square = new Square(i);
    return square.render();
  };

  /**
   * Renders the full layout of the button board, including each individual
   * "square", or button representing a specific pane type.
   * @returns Set HTML string for injection into the page.
   */
  render = function () {
    let content = "";
    content += `<div class="btn-board">
            <h2>Special</h2>
            <div class="button-container">
                ${this.renderSquare(0)}
                ${this.renderSquare(1)}
                ${this.renderSquare(2)}
            </div>
            <h2>High Level</h2>
            <div class="button-container">
                ${this.renderSquare(3)}
                ${this.renderSquare(4)}
                ${this.renderSquare(5)}
            </div>
            <h2>Mid Level</h2>
            <div class="button-container">
                ${this.renderSquare(6)}
                ${this.renderSquare(7)}
                ${this.renderSquare(8)}
            </div>
            <h2>Ground Level</h2>
            <div class="button-container">
                ${this.renderSquare(9)}
                ${this.renderSquare(10)}
                ${this.renderSquare(11)}
            </div>
        </div>
        `;
    return content;
  };
}

/**
 * @class Square
 * @constructor
 *    @param  {Number}  i Unique identifier or iteration.
 * A "square" is a button that represents a specific pane type in our array of
 * buttons within our button board. This class defines how these squares work
 * and what content is stored within them.
 */
class Square {
  constructor(i) {
    this.i = i;
    this.cookieExists = doesCookieExist(`paneType${i}`);
    this.code = defaultValues[i].code;
    this.size = defaultValues[i].size;
    this.height = defaultValues[i].height;
    this.price = this.cookieExists
      ? getCookie(`paneType${i}`)
      : Number.parseFloat(defaultValues[i].value).toFixed(2);
  }

  /**
   * Generates the HTML string to render this square in the dom.
   * @returns {String}  HTML string representing this square.
   */
  render = function () {
    let content = "";

    content += `
        <button class="pane" data-i="${this.i}">
            ${this.size}
        </button>
        `;

    return content;
  };
}

/**
 * @constructor Takes the parameter i, representing the pane type. These types
 * are stored in the defaultValues array. @see default_pricing.js
 */
class LineItem {
  constructor(i) {
    let ea = doesCookieExist(`paneType${i}`)
      ? getCookie(`paneType${i}`)
      : defaultValues[i].value;
    this.code = defaultValues[i].height;
    this.title = defaultValues[i].size;
    this.each = Number.parseFloat(ea).toFixed(2);
    this.count = 1;
  }

  /**
   * Get and return the current price of this line item.
   * @returns {Number} Returns the 0.00 fixed float representing the price of
   * this line item. Price is the price-per-item (each) times number of items (count).
   */
  getPrice = function () {
    let each = Number.parseFloat(this.each);
    let count = Number.parseFloat(this.count);
    return Number.parseFloat(each * count).toFixed(2);
  };

  /**
   * Generates the HTML string needed to render this line item.
   * @returns {String} HTML string required to represent this line item in the DOM.
   */
  render = function () {
    let content = "";
    content += `
        <tr>
            <td>${this.code}</td>
            <td>${this.title}</td>
            <td>$${this.each}</td>
            <td>${this.count}</td>
            <td>$${this.getPrice()}</td>
            <td
              class="delete"
              data-count="${this.count}"
              data-price="${this.getPrice()}">
                ${deleteIcon}
              </td>
        </tr>
        `;
    return content;
  };
}

/**
 * We need to ensure the page has loaded to run the following...
 */
window.addEventListener("load", () => {
  // Create & render button board.
  const BUTTON_BOARD = new Board();
  $btnBoard.append(BUTTON_BOARD.render());
  // Create and render table Head
  createTableHead($("thead"));
  // Set up click event listeners for button board buttons.
  $("button.pane").on("click", squareClick);

  updateCtrlBoard($ctrlBoard);

  // Update (or, more accurately, create) the table footer.
  updateTableFoot();
});

/**
 * Creates the table head row using a template. Broken out into a function for code readability.
 * @param {Element} ele The jQuery element where to append the template.
 */
function createTableHead(ele) {
  $(ele).append(`
  <tr>
      <th>Height</th>
      <th>Size</th>
      <th>Each</th>
      <th># of</th>
      <th>Price</th>
      <th>Del</th>
  </tr>`);
}

/**
 * A "square" refers to one of our buttons that corresponds to counting one of that particular type of
 * pane. We evaluate to see if this was the same button we clicked last. If it is, we increase the count,
 * otherwise, we increase the current count. In turn, we either create a new line item or update the
 * existing line item with the corresponding data. Lastly, we want to attach our event listener to the
 * delete button to handle deleting a given line item, and update our totals in the table footer.
 * @param {Event} e Our click event.
 */
function squareClick(e) {
  if (e.target === lastButtonClicked) {
    $("tr:eq(1)").remove();
    currentLineItem.count++;
    $lineItems.prepend(currentLineItem.render());
    lastButtonClicked = e.target;
  } else {
    currentLineItem = new LineItem(e.target.dataset.i);
    $lineItems.prepend(currentLineItem.render());
    lastButtonClicked = e.target;
  }
  // Set up delete icon click even listener.
  $("td.delete:eq(0)").on("click", (e) => deleteRow(e));
  // Update table footer with our new totals.
  updateTableFoot();
}

function getPaneCount() {
  let paneCount = 0;
  let dataElements = document.querySelectorAll("td.delete");
  for (let element of dataElements) {
    paneCount += Number.parseInt(item.dataset.count);
  }
  return paneCount;
}

function getGrandTotal() {
  let grandTotal = 0;
  let dataElements = document.querySelectorAll("td.delete");
  for (let element of dataElements) {
    grandTotal += Number.parseInt(item.dataset.price);
  }
  return grandTotal.toFixed(2);
}

/**
 * When we add and delete line items from our list, we want to update the total panes counted and total price
 * of the service. These totals are displayed in our table footer. Calling this function rerenders thes
 * updated values.
 */
function updateTableFoot() {
  /* Apply data to our table footer template */
  $tableFoot.html(`
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td>${getPaneCount()}</td>
    <td>$${getGrandTotal()}</td>
    <td></td>
  </tr>`);
}

/**
 * When we click on the trach can for a given line item, we want to delete the row from our list
 * of line items, and recalculate our totals in the table footer.
 * @param {Event} e jQuery event object.
 */
function deleteRow(e) {
  /* To avoid bugs where deleting the top line item and then tapping the same pane type creates,
  we simply reset the last button clicked and current line item. */
  currentLineItem = "";
  lastButtonClicked = "";
  /* Play a fade effect on the current line item, then remove it from the list. Update totals.*/
  $(e.currentTarget)
    .parent()
    .hide(600, () => {
      $(e.currentTarget).parent().remove();
      updateTableFoot();
    });
}

function updateCtrlBoard($location) {
  let paneCount = document.createElement("div");
  let grandTotal = document.createElement("div");
  let reviewAndSendButton = document.createElement("button");

  paneCount.innerHTML = getPaneCount();
  grandTotal.innerHTML = "$" + getGrandTotal();
  reviewAndSendButton.innerHTML = "Review & Send";

  paneCount.setAttribute("class", "paneCount");
  grandTotal.setAttribute("class", "grandTotal");
  reviewAndSendButton.setAttribute("class", "reviewAndSendButton");

  $location.append(paneCount, grandTotal, reviewAndSendButton);
}
