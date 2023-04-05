'use strict'

/**
 * @file  count.js
 * @author  Ryan Paranich <rparanich@northislandcollege.ca>
 * Last Edit: 04/07/2021
 *
 * NIC DGL113 W21
 *
 * This file build the general structure and functionality into our "build quote" or "count" page. This
 * page is responsible for allowing the user to use their preset default or custom price list to count
 * up panes of various height and size. It creates a live list for the user to view as they count panes
 * and size up the job. The user can also delete line items from the count if they've made a mistake or
 * wish to change the type of pane counted.
 */

const $btnBoard = $('div#buttonBoard')
const $lineItems = $('tbody')
const $ctrlBoard = $('div#summaryBoard')
const clickSound = document.getElementById('clickSound')
const deleteIcon = "<i class='far fa-trash'</i>"

let lastButtonClicked
let currentLineItem

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
  renderSquare = (i) => {
    const square = new Square(i)
    return square.render()
  }
  /**
   * Renders the full layout of the button board, including each individual
   * "square", or button representing a specific pane type.
   * @returns Set HTML string for injection into the page.
   */
  render = () => {
    return `<div class="btn-board">
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
        `
  }
}

/**
 * @class Square
 * @constructor
 * @param  {Number}  i Unique identifier or iteration.
 *
 * A "square" is a button that represents a specific pane type in our array of
 * buttons within our button board. This class defines how these squares work
 * and what content is stored within them.
 */
class Square {
  constructor(i) {
    this.i = i
    this.cookieExists = doesCookieExist(`paneType${i}`)
    this.size = defaultValues[i].size
  }
  /**
   * Generates the HTML string to render this square in the DOM.
   * @returns {String}  HTML string representing this square.
   */
  render = function () {
    return `
        <button class="pane" data-i="${this.i}">
            ${this.size}
        </button>
        `
  }
}
