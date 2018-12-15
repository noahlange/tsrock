import { IComponentMap, IEventMap } from '../';
import { bind, EVENT_BRAND } from '../decorators';
import Entity from '../Entity';
import { IEntityComponentSystem } from '../types';
import { getInstanceMethodNames, isEventHandler, keys } from '../utils';

class BaseSystem<S extends IEntityComponentSystem> {
  protected system: S;

  public constructor(system: S) {
    this.system = system;
  }

  @bind
  public entityQuery<T extends Entity>(query: IQuery | null): T[] {
    if (query) {
      const entities = this.system.getEntitiesFromQuery(query);
      return entities.map((e: IEntityObject) => Entity.from(this.system, e)) as T[];
    }
    return [];
  }

  @bind
  public eventOn<K extends keyof IEventMap>(
    event: K & string,
    callback: (data: IEventMap[K]) => void
  ) {
    this.system.listenForEvent(event, callback);
  }

  @bind
  public eventBroadcast<K extends keyof IEventMap>(
    event: K & string,
    ...data: Array<IEventMap[K]>
  ) {
    for (const item of data) {
      this.system.broadcastEvent(event, item);
    }
  }

  @bind
  public registerComponents<K extends keyof IComponentMap>(
    components: { [P in K]: Partial<IComponentMap[P]> }
  ): void {
    for (const id of keys(components)) {
      if (typeof id === 'string') {
        this.registerComponent(id, components[id]);
      }
    }
  }

  @bind
  public registerComponent<K extends keyof IComponentMap>(
    name: K & string,
    obj: IComponentMap[K]
  ) {
    this.system.registerComponent(name, obj);
  }

  @bind
  public registerQuery() {
    const q = this.system.registerQuery();
    if (q) {
      return q;
    } else {
      throw new Error('Failed to register query.');
    }
  }

  public bindEvents(instance: any) {
    for (const key of getInstanceMethodNames(instance, instance.constructor)) {
      const fn = instance[key];
      if (isEventHandler(fn)) {
        // ftge
        this.eventOn((fn as any)[EVENT_BRAND], fn.bind(instance));
      }
    }
  }
}

export default BaseSystem;
