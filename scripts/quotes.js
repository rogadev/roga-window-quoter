"use strict";

/**
 * @author Ryan Paranich
 */

var lastClickedBtn;
var currentLineItem;
var lineItemList = [];
var $list = $("table.list");
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

  // Sets up the data attributes for each pane button. This is used later in our click event.
  $paneButtons.each(function (i) {
    let name = prices[i].name;
    $(this).text(name).attr("data-name", name);
    // Did we receive cookies from the browser? We should, but if not, use default price values.
    let cookiesExists = doesCookieExist(`paneType${i}`);
    let price = cookiesExists ? getCookie(`paneType${i}`) : prices[i].price;
    $(this)
      .attr("data-price", price)
      .attr("data-code", prices[i].code)
      .attr("data-screens", prices[i].screens);
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
    updateLineItems();
  }
  // If it's a new button we've clicked on, we want to start a new line item for this pane type.
  else {
    currentLineItem = new LineItem(
      e.target.dataset.code,
      e.target.dataset.name,
      e.target.dataset.each,
      e.target.dataset.screens
    );
    lineItemList.push(currentLineItem);
    updateLineItems();
    lastClickedBtn = e.target.dataset.code;
  }
}

/**
 * Update & render current line items.
 */
function updateLineItems() {
  /* If we delete all of our line items, we can end up with a list length of 0. If that happens
    we want to make sure we don't create a table/list full of null or undefined values. */
  if (lineItemList.length === 0) {
    $list.html("");
    return;
  }

  let runningPaneCount = 0;
  let runningPriceTotal = 0;

  let $paneCount = $("#paneCount");
  let $priceTotal = $("#paneCount");

  for (let i = 0; i < lineItemList.length; i++) {
    $paneCount += lineItemList[i].count;
    $priceTotal += "";
  }

  $paneCount.text(runningPaneCount);
  $priceTotal.text(runningPriceTotal);
}
