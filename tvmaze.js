"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
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
      }
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
 *      { id, name, season, number }
 */
/** Write a clear docstring for this function... */
async function getEpisodesOfShow(showId) {
  const response = await fetch(`http://api.tvmaze.com/shows/${showId}/episodes`);
  const episodeData = await response.json();

  let episodeArray = episodeData.map(({id, name ,season, number}) => ({id,name, season, number}))
  console.log(episodeArray);
}

function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design


$('#showsList').on('click', '.episode', function(){
  getEpisodesOfShow(139);
})
