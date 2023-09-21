"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $('#episodesList');
const $searchForm = $("#searchForm");
const apiUrl = 'http://api.tvmaze.com/search/shows?';
const defaultImage = 'https://tinyurl.com/tv-missing';



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  let showArray = [];

  const params = new URLSearchParams({ q: term });
  const response = await fetch(`${apiUrl}${params}`);
  const showData = await response.json();

  for (let item of showData) {//TODO: you can accomplish this logic using a map
    let { id, name, summary, image } = item.show;

    if (image === null) {
      image = {
        original: defaultImage
      };
    }
    showArray.push({ id, name, summary, image });
  }
  return showArray;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const srcImage = show.image.original;

    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${srcImage}
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes episode">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  //console.log(shows);
  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 * { id, name, season, number }
 */
async function getEpisodesOfShow(showId) {
  const response = await fetch(`http://api.tvmaze.com/shows/${showId}/episodes`);
  const episodeData = await response.json();

  let episodeArray = episodeData.map(({ id, name, season, number }) =>
    ({ id, name, season, number }));

  return episodeArray;//TODO: better var name is episodes

}

/**
 * Given array of episodes
 * append each episode information to DOM
 */
function displayEpisodes(episodes) {
  $episodesList.empty();
  $episodesArea.show();

  for (const episode of episodes) {

    const $episode = $(`
    <li>${episode.name}, Season: ${episode.season}, Episode: ${episode.number}</li> //TODO:Format to resemble actual li in html form
    `);

    $episodesList.append($episode);
  }

}

/**
 * Handles episode search using the show ID
 * displays resulting episode information in DOM
 */
async function getEpisodesAndDisplay(showID) {
  const episodes = await getEpisodesOfShow(showID);
  displayEpisodes(episodes);
}

/**
 * Handles click of episodes button,
 * get the showID from accessing show ID data attribute in the DOM,
 * then passes ID to conductor function to display results
 */
$('#showsList').on('click', '.Show', function handleEpisodesButton() {
  const showId = (this.dataset.showId);
  getEpisodesAndDisplay(showId);
});

