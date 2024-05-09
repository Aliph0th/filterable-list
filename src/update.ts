import { DEFAULT_LIMIT, FIRST_LOAD_LIMIT, API_URL } from './constants';
import { fetchData, mergeData } from './helpers';
import { IPost } from './interfaces/post';
import { IState } from './interfaces/state';
import { renderSpinner, render, removeSpinners } from './renderer';

export async function update(state: IState, filterWasUpdated = false) {
   removeSpinners();
   renderSpinner(filterWasUpdated);
   if (filterWasUpdated) {
      state.position = 0;
      state.isAllFetched = false;
   }
   state.isFetching = true;
   const limit = state.position ? DEFAULT_LIMIT : FIRST_LOAD_LIMIT;
   fetchData<IPost[]>(`${API_URL}/posts`, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      title_like: state.filter,
      _start: state.position,
      _limit: limit
   })
      .then(posts => {
         if (!posts?.length) {
            state.isAllFetched = true;
            return [];
         }
         return mergeData(posts, state);
      })
      .then(records => {
         state.records =
            records.length && !filterWasUpdated ? [...state.records, ...records] : records;
         render(state, filterWasUpdated);
         state.position += limit;
      })
      .catch(reason => console.error(reason))
      .finally(() => (state.isFetching = false));
}
