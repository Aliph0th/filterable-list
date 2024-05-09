export interface IFilterEvent extends Event {
   target: EventTarget & { value: string };
}
