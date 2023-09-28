'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

// Hides and shows an element
function hideShow(element) {
  if (element.is(':visible')) {
    element.hide();
  } else {
    element.show();
  }
}

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug('navAllStories', evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug('navLoginClick', evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on('click', navLoginClick);

function navSubmitClick(evt) {
  console.debug('navSubmitClick', evt);
  hideShow($submitStoryForm);
}

$navSubmit.on('click', navSubmitClick);

function navFavoritesClick() {
  hideShow($favoritedStories);
  hideShow($favoriteHeader);
}

$navFavorites.on('click', navFavoritesClick);
/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug('updateNavOnLogin');
  $('.main-nav-links').show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
