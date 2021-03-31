"use strict";

/**
 *
 */

const $app = $("div#app");
const $lineItems = $("tbody");
const $tableFoot = $("tfoot");

var defaultValues;
const deleteIcon = "<i class='far fa-trash'</i>";
var lastButtonClicked;
var currentLineItem;

class Board {
  renderSquare = function (i) {
    let square = new Square(i);
    return square.render();
  };

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

class Square {
  constructor(i) {
    this.i = i;
    this.cookieExists = doesCookieExist(`paneType${i}`);
    this.code = defaultPrices[i].code;
    this.size = defaultPrices[i].size;
    this.height = defaultPrices[i].height;
    this.price = this.cookieExists
      ? getCookie(`paneType${i}`)
      : Number.parseFloat(defaultPrices[i].value).toFixed(2);
  }

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

  getPrice = function () {
    let each = Number.parseFloat(this.each);
    let count = Number.parseFloat(this.count);
    return Number.parseFloat(each * count).toFixed(2);
  };

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

window.addEventListener("load", () => {
  defaultValues = defaultPrices;
  let board = new Board();
  $app.append(board.render());
  $("thead").append(`
    <tr>
        <th>Height</th>
        <th>Size</th>
        <th>Each</th>
        <th># of</th>
        <th>Price</th>
        <th></th>
    </tr>`);
  let $buttons = $("button.pane");
  $buttons.on("click", squareClick);
});

function squareClick(e) {
  e.preventDefault();
  if (e.target === lastButtonClicked) {
    $("tr:eq(1)").remove();
    currentLineItem.count++;
    $lineItems.prepend(currentLineItem.render());
    lastButtonClicked = e.target;
  } else {
    currentLineItem = new LineItem(e.target.dataset.i);
    $lineItems.prepend(currentLineItem.render());
    $("td.delete:eq(0)").on("click", (e) => deleteRow(e));
    lastButtonClicked = e.target;
  }
  updateTableFoot();
}

function updateTableFoot() {
  let count = 0;
  let totalPrice = 0;
  let data = document.querySelectorAll("td.delete");

  for (let item of data) {
    count += Number.parseInt(item.dataset.count);
    totalPrice += Number.parseFloat(item.dataset.price);
  }

  $tableFoot.html(`
  <tr>
    <td class="emptyCell"></td>
    <td class="emptyCell"></td>
    <td class="emptyCell"></td>
    <td>${count}</td>
    <td>$${totalPrice.toFixed(2)}</td>
    <td class="emptyCell"></td>
  </tr>`);
}

function deleteRow(e) {
  $(e.currentTarget)
    .parent()
    .hide(800, () => {
      $(e.currentTarget).parent().remove();
      updateTableFoot();
    });
}
