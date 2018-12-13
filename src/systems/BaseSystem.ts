import Entity from '../Entity';
import Events from '../events';
import {
  ComponentMapKey,
  EVENT_BRAND,
  EventMapKey,
  IComponentMap,
  IEntityComponentSystem,
  IEventMap
} from '../types';
import { getInstanceMethodNames, isEventHandler } from '../utils';

class BaseSystem<S extends IEntityComponentSystem> {
  protected system: S;

  public constructor(system: S) {
    this.system = system;
  }

  public log(message: string) {
    this.eventBroadcast(Events.DISPLAY_CHAT_EVENT, message);
  }

  public entityQuery = <T extends Entity>(query: IQuery | null): T[] => {
    if (query) {
      const entities = this.system.getEntitiesFromQuery(query);
      return entities.map((e: IEntityObject) => Entity.from(this.system, e)) as T[];
    }
    return [];
  };

  public eventOn = <K extends EventMapKey>(
    event: K,
    callback: (data: IEventMap[K]) => void
  ) => {
    this.system.listenForEvent(event, callback);
  };

  public eventBroadcast = <K extends EventMapKey>(event: K, ...data: Array<IEventMap[K]>) => {
    for (const item of data) {
      this.system.broadcastEvent(event, item);
    }
  };

  public registerComponent = <K extends ComponentMapKey>(name: K, obj: IComponentMap[K]) => {
    this.system.registerComponent(name, obj);
  };

  public registerQuery = () => {
    const q = this.system.registerQuery();
    if (q) {
      return q;
    } else {
      throw new Error('Failed to register query.');
    }
  };

  public bindEvents(bind: any) {
    for (const key of getInstanceMethodNames(bind, BaseSystem)) {
      const fn = bind[key];
      if (isEventHandler(fn)) {
        // ftge
        this.eventOn((fn as any)[EVENT_BRAND], fn.bind(bind));
      }
    }
  }
}

export default BaseSystem;
