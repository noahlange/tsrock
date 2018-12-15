/*
tslint:disable: member-ordering
  - ordered dependency issue - public members need access to private members
*/

import Entity, { EntityType } from '../Entity';

import Blocks from '../reference/blocks';
import Events from '../reference/events';
import Items from '../reference/items';

import { IEntityMap, IItemMap } from '../';
import { bind } from '../decorators';
import { keys } from '../utils';
import BaseSystem from './BaseSystem';

class ServerSystem {
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
    components: this.base.registerComponents,
    query: this.base.registerQuery
  };

  public constructor() {
    /*
     * can't have arrow property functions with overloads. we're casting
     * because TypeScript only uses the first overload for bound functions
     */
    if (this.update) {
      this.system.update = this.update.bind(this);
    }
    if (this.shutdown) {
      this.system.shutdown = this.shutdown.bind(this);
    }
    this.system.initialize = this._initialize;
  }

  public initialize?(): void;
  public update?(): void;
  public shutdown?(): void;

  private entityCreate(
    entities: Partial<Record<keyof (IEntityMap & IItemMap), number>>
  ): Entity[];
  private entityCreate(entity: keyof (IEntityMap & IItemMap)): Entity;
  @bind
  private entityCreate(
    id: Partial<Record<keyof (IEntityMap & IItemMap), number>> | keyof (IEntityMap & IItemMap)
  ): Entity | Entity[] {
    if (typeof id === 'string') {
      const isItem = Object.keys(Items).includes(id);
      const isBlock = Object.keys(Blocks).includes(id);
      if (isBlock) {
        throw new Error('Cannot instantiate entity of type "block"');
      }
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
            .fill(null)
            .map(() => {
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

  public log(message: string) {
    this.base.eventBroadcast(Events.DISPLAY_CHAT_EVENT, message);
  }

  @bind
  private entityFrom(object: IEntityObject): Entity {
    return Entity.from(this.system, object);
  }

  @bind
  private _initialize() {
    this.base.bindEvents(this);
    if (this.initialize) {
      this.initialize();
    }
  }
}

export default ServerSystem;
