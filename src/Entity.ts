import { IComponentMap } from './';
import { bind } from './decorators';
import { IEntityComponentSystem } from './types';
import { keys } from './utils';

export enum EntityType {
  ItemEntity = 'item_entity',
  Entity = 'entity'
}

type Changes<K extends keyof IComponentMap> =
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

  @bind
  private addComponent<K extends keyof IComponentMap>(
    key: K & string,
    initial?: Partial<IComponentMap[K]>
  ) {
    const cmp = this.system.createComponent<IComponentMap[K]>(this.entity, key);
    // @ts-ignore typings for applyComponentChanges are incorrect.
    // tslint:disable-next-line
    this.system.applyComponentChanges(this.entity, Object.assign(cmp, initial));
    if (!cmp) {
      throw new Error(`Failed to create component ${key} on entity ${this.id}`);
    }
  }

  @bind
  private addComponents<K extends keyof IComponentMap>(
    components: { [P in K]: Partial<IComponentMap[P]> }
  ): void {
    for (const id of keys(components)) {
      if (typeof id === 'string') {
        this.addComponent(id, components[id]);
      }
    }
  }

  @bind
  private getComponent<K extends keyof IComponentMap>(component: K & string): IComponentMap[K] {
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
  @bind
  private getComponents<K extends keyof IComponentMap>(
    ...components: Array<K & string>
  ): IComponentMap[K] {
    return components.map(c => this.getComponent(c));
  }

  @bind
  private hasComponent<K extends keyof IComponentMap>(component: K & string): boolean {
    return this.system.hasComponent(this.entity, component);
  }

  @bind
  private hasComponents<K extends keyof IComponentMap>(
    ...components: Array<K & string>
  ): boolean {
    return components.every(c => this.hasComponent(c));
  }

  @bind
  private updateComponents<K extends keyof IComponentMap>(
    components: { [P in K]: Changes<P> }
  ): void {
    for (const id of keys(components)) {
      if (typeof id === 'string') {
        this.updateComponent(id, components[id]);
      }
    }
  }

  @bind
  private updateComponent<K extends keyof IComponentMap>(
    component: K & string,
    changes: Changes<K>
  ): void {
    const cmp = this.system.getComponent<IComponentMap[K]>(this.entity, component);
    if (typeof changes === 'function') {
      changes = (changes as any)(cmp);
    }
    // @ts-ignore type definition error
    // tslint:disable-next-line
    this.system.applyComponentChanges(this.entity, Object.assign(cmp, changes));
  }

  @bind
  private removeComponent<K extends keyof IComponentMap>(component: K & string): void {
    this.system.destroyComponent(this.entity, component);
  }

  @bind
  private removeComponents<K extends keyof IComponentMap>(
    ...components: Array<K & string>
  ): void {
    components.forEach(c => this.removeComponent(c));
  }
}
