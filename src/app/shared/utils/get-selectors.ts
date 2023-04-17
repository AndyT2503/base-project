import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
export type StoreState<TStore> = TStore extends ComponentStore<infer TState>
  ? TState
  : {};

export type StoreSelectors<TStore, TState = StoreState<TStore>> = {
  [TSelectorKey in keyof TState as `${TSelectorKey & string}$`]: Observable<
    TState[TSelectorKey]
  >;
};

export function getSelectors<TStore extends ComponentStore<any>>(
  store: TStore,
): StoreSelectors<TStore> {
  return new Proxy({} as StoreSelectors<TStore>, {
    get(target, p, receiver) {
      const prop = p as string & keyof StoreSelectors<TStore>;
      if (
        !prop.endsWith('$') &&
        target[prop] !== null
      ) {
        return Reflect.get(target, p, receiver);
      }
      const stateProp = prop.slice(0, -1);
      return (target[prop] = store.select(
        (s) => s[stateProp],
      ) as StoreSelectors<TStore>[string & keyof StoreSelectors<TStore>]);
    },
  });
}

export class ComponentStoreWithSelectors<
  TState extends object,
> extends ComponentStore<TState> {
  readonly selectors = getSelectors<ComponentStore<TState>>(this);
}
