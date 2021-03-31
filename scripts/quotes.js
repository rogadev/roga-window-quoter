"use strict";

/**
 * @author Ryan Paranich
 */

var lastClickedBtn;
var currentLineItem;
var lineItemList = [];
var $list = $("tbody.list");
var trashIcon = '<i class="far fa-trash"></i>';

/**
 * This represents one line item on the quote's page. We're counting up our panes and we're making a line
 * item that represents the data that we're collecting about this job. A line item is added to an array
 * of line items and displayed on screen. It can be deleted and re-counted, if needed.
 */
class LineItem {
  constructor(code, name, each, screens) {
    this.code = code;
    this.name = name;
    this.each = each;
    this.screens = screens;
    this.count = 1; // at creation, we've "counted" our first pane for this line item.
    this.price = this.count * this.each;
  }
  // Each button press of any given pane type increases the count by 1.
  increaseCount = function () {
    this.count++;
    this.price = this.count * this.each;
  };
}

window.addEventListener("load", () => {
  setupPaneButtons();
  document
    .getElementById("menu-cancel")
    .addEventListener("click", () => (window.location.href = "index.html"));
});

/**
 * This sets up our buttons with a click event listener, as well as with all of the necessary data attributes
 * which we will use later to create line items for our quote, based on the button being clicked.
 */
function setupPaneButtons() {
  // adds event listener to all .pane buttons.
  let $paneButtons = $(".pane").on("click", buttonClicked);

  // Sets up the name & data attributes for each pane button. Dataset is used later in our click event.
  $paneButtons.each(function (i) {
    let thisCookie = getCookie(`paneType${i}`);
    let name = defaultPrices[i].name;

    $(this)
      .attr("data-price", thisCookie ? thisCookie : defaultPrices[i].price)
      .attr("data-code", defaultPrices[i].code)
      .attr("data-screens", defaultPrices[i].screens)
      .text(name)
      .attr("data-name", name);
  });
}

/**
 * Whenever one of our pane-counting buttons is clicked, we want to add one pane of that type to a list. We press the
 * same button repeatedly to count any number of the same type of pane multiple times. This creates a line item with
 * that number of panes, at the given price per pane, which is added to our quote total. Later, we count up the total
 * of each type of pane and build our final quote.
 * @param {Event} e
 */
function buttonClicked(e) {
  // If the last button we clicked is the same as this click, we want to keep increasing the count for that line item.
  if (lastClickedBtn === e.target.dataset.code) {
    currentLineItem.increaseCount();
    updateCurrentLineItem(currentLineItem.price);
  }
  // If it's a new button we've clicked on, we want to start a new line item for this pane type.
  else {
    currentLineItem = new LineItem(
      e.target.dataset.code,
      e.target.dataset.name,
      e.target.dataset.price,
      e.target.dataset.screens
    );
    lineItemList.push(currentLineItem);
    createNewLineItem(currentLineItem);
    lastClickedBtn = e.target.dataset.code;
  }
}

function updateCurrentLineItem(newPrice) {}

function createNewLineItem(lineItemData) {
  let content = `<tr><td>${lineItemData.code}</td>
                 <td>${lineItemData.name}</td>
                 <td>${lineItemData.each}</td>
                 <td>${lineItemData.count}</td>
                 <td>${lineItemData.price}</td>
                 <td>${trashIcon}</td></tr>`;

  $list.prepend(content);
}

/**
 * Update & render current line items.
 */
// function updateLineItems() {
//   /* If we delete all of our line items, we can end up with a list length of 0. If that happens
//     we want to make sure we don't create a table/list full of null or undefined values. */
//   if (lineItemList.length === 0) {
//     $list.html("");
//     return;
//   }

//   let paneCount = document.getElementById("totalCount");
//   let priceTotal = document.getElementById("totalPrice");

//   var runningPaneCount = 0;
//   var runningPriceTotal = 0;
//   let content = "";
//   for (let i = 0; i < lineItemList.length; i++) {
//     content += "<tr>";
//     runningPaneCount += Number.parseInt(lineItemList[i].count);
//     runningPriceTotal += Number.parseFloat(lineItemList[i].price);
//     content += `<> ${lineItemList[i].code} </>`;
//     content += `<td> ${lineItemList[i].name} </td>`;
//     content += `<td> ${lineItemList[i].each} </td>`;
//     content += `<td> ${lineItemList[i].count} </td>`;
//     content += `<td> ${Number.parseFloat(lineItemList[i].price).toFixed(
//       2
//     )} </td>`;
//     content += "<td class='trash'>" + trashIcon + "</td";
//     content += "</tr>";
//   }

//   $list.html(content);

//   paneCount.innerHTML = runningPaneCount;
//   priceTotal.innerHTML = Number.parseFloat(runningPriceTotal).toFixed(2);
// }
