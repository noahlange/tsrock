import Entity, { EntityType } from '../Entity';
import Items from '../items';
import { EntityMapKey, IEntityMap } from '../types';
import { keys } from '../utils';
import BaseSystem from './BaseSystem';

/*
tslint:disable: member-ordering
  - ordered dependency issue - public members need access to private members.
*/

abstract class ServerSystem {
  private system: IVanillaServerSystem = server.registerSystem(0, 0);
  private base: BaseSystem<IVanillaServerSystem> = new BaseSystem(this.system);

  public entities = {
    create: this.entityCreate,
    from: this.entityFrom,
    query: this.base.entityQuery
  };

  public events = {
    broadcast: this.base.eventBroadcast,
    on: this.base.eventOn
  };

  public register = {
    component: this.base.registerComponent,
    query: this.base.registerQuery
  };

  public constructor() {
    /*
     * can't have arrow property functions with overloads. we're casting
     * because TypeScript only uses the first overload for bound functions
     */
    this.entities.create = this.entityCreate.bind(this) as any;
    this.entities.from = this.entityFrom.bind(this) as any;

    if (this.update) {
      this.system.update = this.update.bind(this);
    }
    if (this.shutdown) {
      this.system.shutdown = this.shutdown.bind(this);
    }
    this.system.initialize = this._initialize.bind(this);
  }

  public initialize?(): void;
  public update?(): void;
  public shutdown?(): void;

  private entityCreate(entities: Partial<Record<EntityMapKey, number>>): Entity[];
  private entityCreate(entity: EntityMapKey): Entity;
  private entityCreate(
    id: Partial<Record<EntityMapKey, number>> | EntityMapKey
  ): Entity | Entity[] {
    if (typeof id === 'string') {
      const isItem = Object.keys(Items).includes(id);
      const e = this.system.createEntity(
        isItem ? EntityType.ItemEntity : EntityType.Entity,
        id
      );
      if (!e) {
        throw new Error(`Failed to create entity ${id}`);
      } else {
        return Entity.from(this.system, e);
      }
    } else {
      return keys(id).reduce(
        (carry, key) => {
          const isItem = Object.keys(Items).includes(key);
          const type = isItem ? EntityType.ItemEntity : EntityType.Entity;
          const entities = Array(id[key])
            .fill(0)
            .map(i => {
              const e = this.system.createEntity(type, key);
              if (e) {
                return Entity.from(this.system, e);
              } else {
                return null;
              }
            })
            .filter(f => f !== null);

          return carry.concat(entities as Entity[]);
        },
        [] as Entity[]
      );
    }
  }

  private entityFrom<K extends EntityMapKey>(object: IEntityObject): IEntityMap[K] {
    return Entity.from(this.system, object);
  }

  private _initialize() {
    this.base.bindEvents(this);
    if (this.initialize) {
      this.initialize();
    }
  }
}

export default ServerSystem;
