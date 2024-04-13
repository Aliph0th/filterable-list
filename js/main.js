import {
   API_URL,
   DEBOUNCE_DELAY,
   DEFAULT_LIMIT,
   filterElement,
   FIRST_LOAD_LIMIT
} from './constants.js';
import { debounce, fetchData, mergeData } from './helpers.js';
import { render, renderSpinner } from './renderer.js';

const state = {
   filter: '',
   records: [],
   position: 0,
   cachedUsers: {},
   isAllFetched: false,
   isFetching: false
};

function update(filterWasUpdated = false) {
   renderSpinner(filterWasUpdated);
   if (filterWasUpdated) {
      state.position = 0;
      state.isAllFetched = false;
   }
   state.isFetching = true;
   const limit = state.position ? DEFAULT_LIMIT : FIRST_LOAD_LIMIT;
   fetchData(`${API_URL}/posts`, {
      title_like: state.filter,
      _start: state.position,
      _limit: limit
   })
      .then(posts => {
         if (!posts.length) {
            state.isAllFetched = true;
            return [];
         }
         return mergeData(posts, state);
      })
      .then(records => {
         state.records =
            records.length && !filterWasUpdated
               ? [...state.records, ...records]
               : records;
         render(state, filterWasUpdated);
         state.position += limit;
      })
      .catch(reason => console.error(reason))
      .finally(() => (state.isFetching = false));
}

const invokeUpdate = debounce(e => {
   state.filter = e.target.value;
   update(true);
}, DEBOUNCE_DELAY);

filterElement.addEventListener('keydown', e => {
   if (state.isFetching) {
      e.preventDefault();
      return;
   }
   invokeUpdate(e);
});

window.addEventListener('scroll', () => {
   if (state.isAllFetched || state.isFetching) {
      return;
   }
   if (Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      state.page++;
      update();
   }
});

update();
