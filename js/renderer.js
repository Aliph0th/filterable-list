import { postsContainerElement, NO_POSTS } from './constants.js';
import { createElement } from './helpers.js';

export function removeSpinners() {
   const spinners = [...document.querySelectorAll('.spinner')];
   spinners.forEach(spinner => spinner.remove());
}

export function renderSpinner(insertFirst = false) {
   const spinner = createElement({
      type: 'div',
      classNames: ['spinner']
   });
   const position = insertFirst ? 'afterbegin' : 'beforeend';
   postsContainerElement.insertAdjacentElement(position, spinner);
}

export function render(state, filterWasUpdated = false) {
   if (state.records.length || filterWasUpdated) {
      postsContainerElement.innerHTML = '';
   }
   if (!state.records.length) {
      removeSpinners();
      postsContainerElement.appendChild(
         createElement({
            type: 'p',
            classNames: ['postsEnded'],
            innerText: NO_POSTS
         })
      );
      return;
   }

   for (const record of state.records) {
      const userElement = createElement({
         type: 'div',
         classNames: ['user'],
         children: [
            createElement({
               type: 'span',
               classNames: ['userName'],
               innerText: record.name
            }),
            createElement({
               type: 'span',
               classNames: ['userInfo'],
               innerText: `${record.phone} ${record.email}`
            })
         ]
      });
      const posts = record.posts.map(post =>
         createElement({
            type: 'div',
            classNames: ['postItem'],
            children: [
               createElement({
                  type: 'span',
                  classNames: ['title'],
                  innerText: post.title
               }),
               createElement({
                  type: 'p',
                  classNames: ['article'],
                  innerText: post.body.replaceAll('\n', ' ')
               })
            ]
         })
      );

      const postElement = createElement({
         type: 'div',
         classNames: ['post'],
         children: [userElement, ...posts],
         attributes: {
            style: `grid-template-rows: repeat(${record.posts.length}, 1fr);`
         }
      });

      postsContainerElement.appendChild(postElement);
   }
}
