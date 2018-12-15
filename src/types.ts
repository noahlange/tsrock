// tslint:disable: max-classes-per-file
import { IEventMap } from './';

export interface IEntityComponentSystem extends ISystem<any> {
  createComponent<T>(entity: IEntityObject, componentName: string): T;
  hasComponent<T>(entity: IEntityObject, componentName: string): T;
  getComponent<T>(entity: IEntityObject, componentName: string): T;
  listenForEvent<T>(id: string, callback: (e: T) => void): boolean | null;
  broadcastEvent<T>(id: string, data: T): boolean | null;
  registerQuery(): IQuery | null;
  getEntitiesFromQuery(query: IQuery): IEntityObject[];
}

export type Handler = (...args: any[]) => any;

export type TypedMethod<E extends keyof IEventMap> = IEventMap[E] extends never
  ? () => void
  : (data: IEventMap[E]) => void;

declare global {
  // tslint:disable-next-line: no-empty-interface
  interface IQuery {}

  class IVanillaServerSystem {
    public createComponent<T>(entity: IEntityObject, componentName: string): T;
    public hasComponent<T>(entity: IEntityObject, componentName: string): T;
    public getComponent<T>(entity: IEntityObject, componentName: string): T;
    public listenForEvent<T>(id: string, callback: (e: T) => void): boolean | null;
    public broadcastEvent<T>(id: string, data: T): boolean | null;
    public registerQuery(): IQuery | null;
    public getEntitiesFromQuery(query: IQuery): IEntityObject[];
  }

  class IVanillaClientSystem {
    public createComponent<T>(entity: IEntityObject, componentName: string): T;
    public hasComponent<T>(entity: IEntityObject, componentName: string): T;
    public getComponent<T>(entity: IEntityObject, componentName: string): T;
    public listenForEvent<T>(id: string, callback: (e: T) => void): boolean | null;
    public broadcastEvent<T>(id: string, data: T): boolean | null;
    public registerQuery(): IQuery | null;
    public getEntitiesFromQuery(query: IQuery): IEntityObject[];
  }
}
