import { IRecord } from './record';
import { IUser } from './user';

export interface IState {
   filter: string;
   records: IRecord[];
   position: number;
   cachedUsers: Record<string, IUser>;
   isAllFetched: boolean;
   isFetching: boolean;
}
