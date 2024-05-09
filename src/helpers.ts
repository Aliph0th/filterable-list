import { API_URL } from './constants';
import { ICreateElementOptions } from './interfaces/createElement';
import { IPost } from './interfaces/post';
import { IUser } from './interfaces/user';
import { IRecord } from './interfaces/record';
import { IState } from './interfaces/state';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce(fn: (...args: any) => any, ms: number) {
   let timeout: number;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   return function (...args: Parameters<typeof fn>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), ms);
   };
}

export function createElement({
   type,
   classNames = [],
   innerHTML = '',
   children = [],
   attributes = {}
}: ICreateElementOptions) {
   const element: HTMLElement = document.createElement(type);
   element.innerHTML = innerHTML;
   if (classNames.length) {
      element.className = classNames.join(' ');
   }
   if (children.length) {
      element.append(...children);
   }
   Object.entries(attributes).forEach(([key, value]) => {
      if (key && value) {
         element.setAttribute(key, value.toString());
      }
   });
   return element;
}

export function mergeDataForUser(posts: IPost[], { id, name, email, phone }: IUser): IRecord {
   const userPosts = posts.filter(post => post.userId === id);
   return {
      id,
      name,
      email,
      phone,
      posts: userPosts
   };
}

export const escaped = (string: string) => {
   return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
};

export async function fetchData<T extends IPost | IPost[] | IUser | IUser[]>(
   url: string,
   query: Record<string, string | number> = {}
): Promise<T | undefined> {
   const filteredQuery = Object.entries(query).reduce<Record<string, string>>(
      (accum, [key, value]) => {
         if (value) {
            accum[key] = escaped(value.toString());
         }
         return accum;
      },
      {}
   );
   try {
      const response = await fetch(`${url}?${new URLSearchParams(filteredQuery)}`);
      return (await response.json()) as T;
   } catch (error) {
      console.error(error);
   }
}

export async function getUserById(id: number, state: IState): Promise<IUser | undefined> {
   let user = state.cachedUsers[id];
   if (!user) {
      const fetchedUser = await fetchData<IUser>(`${API_URL}/users/${id}`);
      if (fetchedUser) {
         user = fetchedUser;
      }
   }
   return user;
}

export async function mergeData(posts: IPost[], state: IState) {
   const merged: IRecord[] = [];
   const uniqueIDs = new Set(posts.map(post => post.userId));
   for (const id of uniqueIDs) {
      const user = await getUserById(id, state);
      if (user) {
         state.cachedUsers[id] = user;
         merged.push(mergeDataForUser(posts, user));
      }
   }
   return merged;
}
