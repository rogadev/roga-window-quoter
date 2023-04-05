'use strict'

/**
 * @file main.js
 * @description This file contains JavaScript code that is intended to be applied throughout the website. Currently,
 * this code only includes handling the brand-title click event.
 * @lastmodified 2023-04-05
 */

// When the brand-title is clicked, redirect the user to the index.html page
document
  .querySelector('.brand-title')
  .addEventListener('click', () => (window.location.href = 'index.html'))
