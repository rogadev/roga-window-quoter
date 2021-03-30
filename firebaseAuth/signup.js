"use strict";

/**
 * @file    signup.js
 * @author  Ryan Paranich
 *
 */

// for testing
const $target = $("div.target");

const $email = $("#email");
const $password = $("#password");
const $pwConfirm = $("#confirm");
const $submit = $("button.submit");

$submit.on("click", printAtTarget);

function printAtTarget(e) {
  e.preventDefault();
  console.log($email.val(), $password.val(), $pwConfirm.val());
  $email.val("");
  $password.val("");
  $pwConfirm.val("");
}
