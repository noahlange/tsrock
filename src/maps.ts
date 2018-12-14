import Blocks from './reference/blocks';
import Entities from './reference/entities';
import Items from './reference/items';

import Components from './reference/components';
import Events from './reference/events';

import Entity from './Entity';

export type IEntityMap = Record<Entities, Entity>;
export type IBlockMap = Record<Blocks, Entity>;
export type IItemMap = Record<Items, Entity>;

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
