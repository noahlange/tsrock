// tslint:disable: max-classes-per-file
import Components from './components';
import Entities from './entities';
import Entity from './Entity';
import Events from './events';
import Items from './items';

export interface IEntityComponentSystem extends ISystem<any> {
  createComponent<T>(entity: IEntityObject, componentName: string): T;
  hasComponent<T>(entity: IEntityObject, componentName: string): T;
  getComponent<T>(entity: IEntityObject, componentName: string): T;
  listenForEvent<T>(id: string, callback: (e: T) => void): boolean | null;
  broadcastEvent<T>(id: string, data: T): boolean | null;
  registerQuery(): IQuery | null;
  getEntitiesFromQuery(query: IQuery): IEntityObject[];
}

export const EVENT_BRAND = '__event__';

export type EventMapKey = keyof IEntityMap & string;
export type ComponentMapKey = keyof IEntityMap & string;
export type EntityMapKey = keyof IEntityMap & string;
export type ItemMapKey = keyof IEntityMap & string;

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

export interface IComponentMap {
  [Components.ATTACK]: IAttackComponent;
  [Components.COLLISION]: ICollisionBoxComponent;
  [Components.DAMAGE]: IDamageSensorComponent;
  [Components.EQUIPMENT]: IEquipmentComponent;
  [Components.EQUIPPABLE]: IEquippableComponent;
  [Components.EXPLODE]: IExplodeComponent;
  [Components.HEALABLE]: IHealableComponent;
  [Components.HEALTH]: IHealthComponent;
  [Components.INTERACT]: IInteractComponent;
  [Components.INVENTORY]: IInventoryComponent;
  [Components.LOOK]: ILookAtComponent;
  [Components.NAMEABLE]: INameableComponent;
  [Components.POSITION]: IPositionComponent;
  [Components.ROTATION]: IRotationComponent;
  [Components.SHOOTER]: IShooterComponent;
  [Components.SPAWN]: ISpawnEntityComponent;
  [Components.TELEPORT]: ITeleportComponent;
  [Components.MOLANG]: IMoLangComponent;
  [key: string]: any;
}

export interface IEntityMap {
  [Items.IRON_HELMET]: Entity;
  [Items.IRON_CHESTPLATE]: Entity;
  [Items.IRON_LEGGINGS]: Entity;
  [Items.IRON_BOOTS]: Entity;
  [Items.IRON_SWORD]: Entity;
  [Items.IRON_AXE]: Entity;
  [Items.TRIDENT]: Entity;
  [Items.BOW]: Entity;
  [Items.ARROW]: Entity;
  [Entities.CHICKEN]: Entity;
  [Entities.VINDICATOR]: Entity;
  [Entities.LLAMA]: Entity;
  [Entities.BLAZE]: Entity;
  [Entities.OCELOT]: Entity;
  [Entities.SKELETON]: Entity;
  [Entities.ZOMBIE]: Entity;
  [Entities.CREEPER]: Entity;
  [Entities.ZOMBIE_PIGMAN]: Entity;
  [Entities.GHAST]: Entity;
  [Entities.SLIME]: Entity;
  [Entities.EVOKER]: Entity;
  [Entities.PLAYER]: Entity;
  [Entities.VILLAGER]: Entity;
  [key: string]: any;
}

export interface IEventMap {
  [Events.ENTITY_CREATED]: IEntityCreatedEventData;
  [Events.ENTITY_DEATH]: IEntityDeathEventData;
  [Events.ENTITY_RIDING_START]: IEntityStartRidingEventData;
  [Events.ENTITY_RIDING_STOP]: IEntityStopRidingEventData;
  [Events.ENTITY_TICK]: IEntityTickEventData;
  [Events.ENTITY_PLAYER_ATTACK_ACTOR]: IPlayerAttackedActorEventData;
  [Events.DISPLAY_CHAT_EVENT]: string;
  [Events.EXECUTE_COMMAND]: string;
  [Events.SPAWN_PARTICLE_ENTITY]: ISpawnParticleAttachedEntityParameters;
  [Events.SPAWN_PARTICLE_WORLD]: IServerSpawnParticleInWorldParameters;
  [Events.DISPLAY_CHAT_EVENT]: string;
  [Events.EXECUTE_COMMAND]: string;
  [Events.LOAD_UI]: string;
  [Events.UNLOAD_UI]: string;
  [Events.SEND_UI_EVENT]: IUIEventParameters;
  [Events.SPAWN_PARTICLE_WORLD]: IServerSpawnParticleInWorldParameters;
  [Events.SPAWN_PARTICLE_ENTITY]: ISpawnParticleAttachedEntityParameters;
  [Events.CLIENT_ENTERED_WORLD]: { player: IEntityObject };
  [Events.HIT_RESULT_CHANGED]: IHitResultChangedEvent;
  [Events.HIT_RESULT_CONTINUOUS]: IHitResultContinuousEvent;
  [Events.PICK_HIT_RESULT_CHANGED]: IPickHitResultChangedEvent;
  [Events.PICK_HIT_RESULT_CONTINUOUS]: IPickHitResultContinuousEvent;
  [Events.UI_EVENT]: IUIEventParameters;
  [key: string]: any;
}
