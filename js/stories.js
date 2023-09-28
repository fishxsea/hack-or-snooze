'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

async function storySubmission(e) {
  e.preventDefault();

  const $formTitle = $('#title').val();
  const $formAuthor = $('#author').val();
  const $formUrl = $('#url').val();
  const username = currentUser.username;

  const formInformation = {
    title: $formTitle,
    author: $formAuthor,
    url: $formUrl,
    username,
  };

  const story = await storyList.addStory(formInformation);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
}
$submitStoryForm.on('submit', storySubmission);
/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="heart">♥</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// checks for heart click
$allStoriesList.on('click', '.heart', function () {
  const article = $(this).parent()[0];
  const articleId = article.id;
  const userFavorites = currentUser.favorites;
  $(this).toggleClass('favorited');

  // Adds and removes favorites
  // Checks if most recently hearted story has the class of favorited
  // If not it adds it to favorites
  if ($(this).hasClass('favorited')) {
    for (let story of storyList.stories) {
      if (story.storyId === articleId) {
        // adds the story to favorite array of currentUser object
        currentUser.addFavorite(story);
      }
    }
  } else {
    // Checks if most recently unhearted story has the class of favorited
    // If it does, it removes it from favorites

    for (let story of userFavorites) {
      if (story.storyId === articleId) {
        // removes the story from favorite array of currentUser object
        userFavorites.splice(userFavorites.indexOf(story), 1);
      }
    }
  }

  // check if the favorites list has favorites in it.
  // if it does then append them to favorites list in html and clear favorites
  // html out
  $favoritedStories.empty();
  if (userFavorites.length !== 0) {
    for (let story of userFavorites) {
      $favoritedStories.append(generateStoryMarkup(story));
    }
  }
});

// remove favorites
$favoritedStories.on('click', '.heart', function () {
  const article = $(this).parent()[0];
  const articleId = article.id;
  const userFavorites = currentUser.favorites;

  // loops through all stories and removes red heart and favorited story
  $allStoriesList.find('li').each(function () {
    const id = $(this).attr('id');
    const heart = $(this).find('span');
    if (id === articleId) {
      heart.toggleClass('favorited');
      article.remove();
      for (let story of userFavorites) {
        if (story.storyId === articleId) {
          // removes the story from favorite array of currentUser object
          userFavorites.splice(userFavorites.indexOf(story), 1);
        }
      }
    }
  });
});
