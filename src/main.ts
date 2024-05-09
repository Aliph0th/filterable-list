import { DEBOUNCE_DELAY, filterElement } from './constants';
import { debounce } from './helpers.js';
import { IFilterEvent } from './interfaces/filterEvent';
import { IState } from './interfaces/state';
import './style.css';
import { update } from './update';

const state: IState = {
   filter: '',
   records: [],
   position: 0,
   cachedUsers: {},
   isAllFetched: false,
   isFetching: false
};

filterElement.addEventListener(
   'input',
   debounce((e: IFilterEvent) => {
      state.filter = e.target.value;
      update(state, true);
   }, DEBOUNCE_DELAY)
);

window.addEventListener('scroll', () => {
   if (state.isAllFetched || state.isFetching) {
      return;
   }
   if (Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      update(state);
   }
});

update(state);
