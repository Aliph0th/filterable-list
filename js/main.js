import {
   API_URL,
   DEBOUNCE_DELAY,
   DEFAULT_LIMIT,
   filterElement,
   FIRST_LOAD_LIMIT
} from './constants.js';
import { debounce, fetchData, mergeData } from './helpers.js';
import {
   clearPostsElement,
   render,
   renderEndMessage,
   renderSpinner
} from './renderer.js';

const state = {
   filter: '',
   records: [],
   position: 0,
   cachedUsers: {},
   isAllFetched: false
};

function update(filterWasUpdated = false) {
   if (filterWasUpdated) {
      state.position = 0;
      state.isAllFetched = false;
   }
   const limit = state.position ? DEFAULT_LIMIT : FIRST_LOAD_LIMIT;
   renderSpinner();
   fetchData(`${API_URL}/posts`, {
      title_like: state.filter,
      _start: state.position,
      _limit: limit
   })
      .then(posts => {
         if (!posts.length) {
            state.isAllFetched = true;
            if (state.filter) {
               clearPostsElement();
            }
            renderEndMessage(
               state.filter ? 'По запросу ничего не найдено' : 'Постов больше нет'
            );
            return;
         }
         mergeData(posts, state).then(merged => {
            state.records = filterWasUpdated ? merged : [...state.records, ...merged];
            render(state.records);
            state.position += limit;
         });
      })
      .catch(reason => console.error(reason));
}
filterElement.addEventListener(
   'input',
   debounce(e => {
      state.filter = e.target.value;
      update(true);
   }, DEBOUNCE_DELAY)
);

window.addEventListener(
   'scroll',
   debounce(() => {
      if (state.isAllFetched) {
         return;
      }
      if (Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
         state.page++;
         update();
      }
   }, DEBOUNCE_DELAY)
);

update();
