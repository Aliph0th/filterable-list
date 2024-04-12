import { API_URL } from './constants.js';

export function debounce(fn, ms) {
   let timeout;
   return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, arguments), ms);
   };
}

export function createElement({
   type,
   classNames = [],
   innerText = '',
   children = [],
   attributes = {}
}) {
   const element = document.createElement(type);
   element.innerText = innerText;
   if (classNames.length) {
      element.className = classNames.join(' ');
   }
   if (children.length) {
      element.append(...children);
   }
   Object.entries(attributes).forEach(([key, value]) => {
      if (key && value) {
         element.setAttribute(key, value);
      }
   });
   return element;
}

export function mergeDataForUser(posts, { id, name, email, phone }) {
   const userPosts = posts.filter(post => post.userId === id);
   return {
      id,
      name,
      email,
      phone,
      posts: userPosts
   };
}

export const escaped = string => {
   return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
};

export async function fetchData(url, query = {}) {
   const filteredQuery = Object.entries(query).reduce((accum, [key, value]) => {
      if (value) {
         accum[key] = escaped(value.toString());
      }
      return accum;
   }, {});
   try {
      const response = await fetch(`${url}?${new URLSearchParams(filteredQuery)}`);
      return await response.json();
   } catch (error) {
      console.error(error);
   }
}

export async function mergeData(posts, state) {
   const merged = [];
   const uniqueIDs = new Set(posts.map(post => post.userId));
   for (const id of uniqueIDs) {
      let user = state.cachedUsers[id];
      if (!user) {
         user = await fetchData(`${API_URL}/users/${id}`);
         state.cachedUsers[id] = user;
      }
      merged.push(mergeDataForUser(posts, user));
   }
   return merged;
}
