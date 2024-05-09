export interface ICreateElementOptions {
   type: keyof HTMLElementTagNameMap;
   classNames?: string[];
   innerHTML?: string;
   children?: HTMLElement[];
   attributes?: Record<string, string | number>;
}
