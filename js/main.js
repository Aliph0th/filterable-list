import {
   API_URL,
   DEBOUNCE_DELAY,
   DEFAULT_LIMIT,
   filterElement,
   loadMoreBtn
} from './constants.js';
import { debounce, fetchData, mergeData } from './helpers.js';
import { render, renderSpinner } from './renderer.js';

const state = {
   filter: '',
   records: [],
   position: 0,
   cachedUsers: {}
};

function update(filterWasUpdated = false) {
   if (filterWasUpdated) {
      state.position = 0;
   }
   fetchData(`${API_URL}/posts`, {
      title_like: state.filter,
      _start: state.position,
      _limit: DEFAULT_LIMIT
   })
      .then(posts =>
         mergeData(posts, state).then(merged => {
            state.records = filterWasUpdated ? merged : [...state.records, ...merged];
            render(state.records);
            state.position += DEFAULT_LIMIT;
         })
      )
      .catch(reason => console.error(reason) /*TODO:*/);
}
filterElement.addEventListener(
   'input',
   debounce(e => {
      state.filter = e.target.value;
      update(true);
   }, DEBOUNCE_DELAY)
);

loadMoreBtn.addEventListener('click', () => {
   state.page++;
   update();
});

update();
