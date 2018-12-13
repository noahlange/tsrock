import { ComponentMapKey, IComponentMap, IEntityComponentSystem } from './types';
import { keys } from './utils';

export enum EntityType {
  ItemEntity = 'item_entity',
  Entity = 'entity'
}

type Changes<K extends ComponentMapKey> =
  | Partial<IComponentMap[K]>
  | ((prev: IComponentMap[K]) => Partial<IComponentMap[K]>);

export default class Entity {
  public static from(system: IEntityComponentSystem, entity: IEntityObject) {
    return new Entity(system, entity);
  }

  public component = {
    add: this.addComponent,
    get: this.getComponent,
    has: this.hasComponent,
    remove: this.removeComponent,
    update: this.updateComponent
  };

  public components = {
    add: this.addComponents,
    get: this.getComponents,
    has: this.hasComponents,
    remove: this.removeComponents,
    update: this.updateComponents
  };

  private system: IEntityComponentSystem;
  private entity: IEntityObject;

  private constructor(system: IEntityComponentSystem, e: IEntityObject) {
    this.system = system;
    this.entity = e;

    this.component.add = this.addComponent.bind(this) as any;
    this.component.get = this.getComponent.bind(this) as any;
    this.component.has = this.hasComponent.bind(this) as any;
    this.component.remove = this.removeComponent.bind(this) as any;
    this.component.update = this.updateComponent.bind(this) as any;

    this.components.add = this.addComponents.bind(this) as any;
    this.components.get = this.getComponents.bind(this) as any;
    this.components.has = this.hasComponents.bind(this) as any;
    this.components.remove = this.removeComponents.bind(this) as any;
    this.components.update = this.updateComponents.bind(this) as any;
  }

  public get id() {
    return this.entity.id;
  }

  public get identifier() {
    return this.entity.__identifier__;
  }

  public destroy(): void {
    this.system.destroyEntity(this.entity);
  }

  public isValid(): boolean {
    return this.system.isValidEntity(this.entity) || false;
  }

  private addComponent<K extends ComponentMapKey>(key: K, initial?: Partial<IComponentMap[K]>) {
    const cmp = this.system.createComponent<IComponentMap[K]>(this.entity, key);
    // @ts-ignore typings for apply are wrong.
    // tslint:disable-next-line
    this.system.applyComponentChanges(this.entity, Object.assign(cmp, initial));
    if (!cmp) {
      throw new Error(`Failed to create component ${key} on entity ${this.id}`);
    }
  }

  private addComponents<K extends ComponentMapKey>(
    components: { [P in K]: Partial<IComponentMap[P]> }
  ): void {
    for (const id of keys(components)) {
      this.addComponent(id, components[id]);
    }
  }

  private getComponent<K extends ComponentMapKey>(component: K): IComponentMap[K] {
    const res = this.system.getComponent(this.entity, component);
    if (res) {
      return res as IComponentMap[K];
    } else {
      throw new Error(
        `Fetched to fetch uninstantiated component "${component}" from entity ${
          this.entity.id
        }!`
      );
    }
  }

  // @todo figure out how to type this
  private getComponents<K extends ComponentMapKey>(...components: K[]): IComponentMap[K] {
    return components.map(c => this.getComponent(c));
  }

  private hasComponent<K extends ComponentMapKey>(component: K): boolean {
    return this.system.hasComponent(this.entity, component);
  }

  private hasComponents<K extends ComponentMapKey>(...components: K[]): boolean {
    return components.every(c => this.hasComponent(c));
  }

  private updateComponents<K extends ComponentMapKey>(
    components: { [P in K]: Changes<P> }
  ): void {
    for (const id of keys(components)) {
      this.updateComponent(id, components[id]);
    }
  }

  private updateComponent<K extends ComponentMapKey>(component: K, changes: Changes<K>): void {
    const cmp = this.system.getComponent<IComponentMap[K]>(this.entity, component);
    if (typeof changes === 'function') {
      changes = (changes as any)(cmp);
    }
    // @ts-ignore type definition error
    this.system.applyComponentChanges(
      this.entity,
      // tslint:disable-next-line
      Object.assign(cmp, changes)
    );
  }

  private removeComponent<K extends ComponentMapKey>(component: K): void {
    this.system.destroyComponent(this.entity, component);
  }

  private removeComponents<K extends ComponentMapKey>(...components: K[]): void {
    components.forEach(c => this.removeComponent(c));
  }
}
