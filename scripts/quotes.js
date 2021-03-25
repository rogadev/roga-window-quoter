"use strict";

/**
 * @author Ryan Paranich
 */

var lastClickedBtn;
var currentLineItem;

class LineItem {
  constructor(code, name, price, screens) {
    this.code = code;
    this.name = name;
    this.price = price;
    this.screens = screens;
    this.count = 1;
  }

  increaseCount = function () {
    this.count++;
    console.log(this.count);
  };
}

window.addEventListener("load", () => {
  setupPaneButtons();
  document
    .getElementById("menu-cancel")
    .addEventListener("click", () => (window.location.href = "index.html"));
});

function setupPaneButtons() {
  var paneButtons = document.querySelectorAll(".pane");
  for (let i = 0; i < paneButtons.length; i++) {
    let price = getCookie(`paneType${i}`);
    let name = prices[i].name;
    let code = prices[i].code;
    let screens = prices[i].screens;
    console.log(price);

    paneButtons[i].setAttribute("data-price", price);
    paneButtons[i].setAttribute("data-name", name);
    paneButtons[i].setAttribute("data-code", code);
    paneButtons[i].setAttribute("data-screens", screens);

    paneButtons[i].addEventListener("click", (e) => buttonClicked(e));
    let buttonText = document.createTextNode(name);
    paneButtons[i].appendChild(buttonText);
  }
}

function buttonClicked(e) {
  if (lastClickedBtn === e.target.dataset.code) {
    currentLineItem.increaseCount();
  } else {
    currentLineItem = new LineItem(
      e.target.dataset.code,
      e.target.dataset.name,
      e.target.dataset.price,
      e.target.dataset.screens
    );
    lastClickedBtn = e.target.dataset.code;
  }
}
