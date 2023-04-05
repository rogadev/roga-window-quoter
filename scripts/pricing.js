'use strict'

// Wait for the DOM to be fully loaded before constructing the pricing table
document.addEventListener('DOMContentLoaded', constructPricing)

/**
 * Constructs all of the pricing on the pricing page, including the name plates for each input box,
 * as well as the values within the pricing page. This construction also includes the event listeners for
 * each input box.
 */
function constructPricing() {
  const inputPrices = Array.from(document.querySelectorAll('input.price'))
  const startQuoteButton = document.getElementById('save-and-build')
  const savePricingButton = document.getElementById('save-and-return')
  const resetPricingButton = document.getElementById('set-to-defaults')

  // Populate tooltips for each name plate
  populateTooltips()

  // Set input values to cookie values, or default values if cookies don't exist
  setInputValues(inputPrices)

  // Add event listeners to each input box
  addInputListeners(inputPrices)

  // Add event listener to reset pricing to default values
  resetPricingButton.addEventListener('click', () => {
    resetInputValues(inputPrices)
  })

  // Add event listener to start a new quote with the current price list
  startQuoteButton.addEventListener('click', () => {
    saveInputValuesToCookies(inputPrices)
    window.location.href = 'new-quote.html'
  })

  // Add event listener to save the current price list to cookies and return home
  savePricingButton.addEventListener('click', () => {
    saveInputValuesToCookies(inputPrices)
    window.location.href = 'index.html'
  })
}

/**
 * Populates the tooltips for each name plate with the respective description
 */
function populateTooltips() {
  const namePlates = Array.from(document.querySelectorAll('div.tooltip'))

  namePlates.forEach((namePlate, i) => {
    // Add the name
    namePlate.innerHTML = defaultValues[i].size
    // Add the tooltip text
    const toolTipText = document.createElement('span')
    toolTipText.className = 'tooltiptext'
    const toolTipTextNode = document.createTextNode(
      defaultValues[i].description
    )
    toolTipText.appendChild(toolTipTextNode)
    namePlate.appendChild(toolTipText)
  })
}

/**
 * Sets the values of the input boxes to the corresponding cookie values, or default values if cookies don't exist
 * @param {Array} inputPrices - Array of input boxes to set values for
 */
function setInputValues(inputPrices) {
  inputPrices.forEach((input, i) => {
    input.value = doesCookieExist(`paneType${i}`)
      ? getCookie(`paneType${i}`)
      : defaultValues[i].value.toFixed(2)
  })
}

/**

Adds event listeners to each input box to commit changes when a user either blurs the field or presses the "return"
key while focused on the input field.
*/
for (let i = 0; i < inputPrices.length; i++) {
  // Looks for cookies. If we have cookies, use these values. Otherwise, use default values.
  inputPrices[i].value = doesCookieExist(`paneType${i}`)
    ? getCookie(`paneType${i}`)
    : defaultValues[i].value.toFixed(2)
  // Adds event listener for blur
  inputPrices[i].addEventListener('blur', () => {
    inputPrices[i].value = Number.parseFloat(inputPrices[i].value).toFixed(2)
  })
  // Adds event listener for "return" key press
  inputPrices[i].addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  })
}
/**
  
  Event listener for the "set to defaults" button. Clicking this button will set all input boxes to their
  default values.
  */
resetPricing.addEventListener('click', () => {
  for (let i = 0; i < inputPrices.length; i++) {
    inputPrices[i].value = defaultValues[i].value.toFixed(2)
  }
})
/**
  
  Event listener for the "save and build" button. Clicking this button will save all current pricing values
  to cookies and navigate to the new-quote page.
  */
startQuote.addEventListener('click', () => {
  for (let i = 0; i < inputPrices.length; i++) {
    setCookie(`paneType${i}`, inputPrices[i].value, 1)
  }
  window.location.href = 'new-quote.html'
})
/**
  
  Event listener for the "save and return" button. Clicking this button will save all current pricing values
  to cookies and navigate back to the index page.
  */
savePricing.addEventListener('click', () => {
  for (let i = 0; i < inputPrices.length; i++) {
    setCookie(`paneType${i}`, inputPrices[i].value, 1)
  }
  window.location.href = 'index.html'
})
/**
  
  Populates the tooltips for each input box. Loops through our array of name plates (the text centered above each
  price input box) and attaches the respective tooltip to be displayed upon hovering over a name plate. Tap instead
  of hover, on mobile.
  */
function populateTooltips() {
  var namePlates = $('div.tooltip')
  for (let i = 0; i < namePlates.length; i++) {
    // Adds the name
    namePlates[i].innerHTML = defaultValues[i].size
    // Adds the tooltip text
    let toolTipText = document.createElement('span')
    toolTipText.className = 'tooltiptext'
    let toolTipTextNode = document.createTextNode(defaultValues[i].description)
    toolTipText.appendChild(toolTipTextNode)
    namePlates[i].appendChild(toolTipText)
  }
}
