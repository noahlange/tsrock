import 'minecraft-scripting-types-client';
import 'minecraft-scripting-types-server';

import Blocks from './reference/blocks';
import Components from './reference/components';
import Entities from './reference/entities';
import Events from './reference/events';
import Items from './reference/items';

export interface IEntityMap extends Record<Entities, Entity> {}
export interface IBlockMap extends Record<Blocks, Entity> {}
export interface IItemMap extends Record<Items, Entity> {}
export interface IBuiltInComponentMap {
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
}

export interface IBuiltInEventMap {
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
}

export interface IComponentMap extends IBuiltInComponentMap {
  [key: string]: any;
}
export interface IEventMap extends IBuiltInEventMap {
  [key: string]: any;
}

import Client from './systems/ClientSystem';
import Server from './systems/ServerSystem';

import { on } from './decorators';
import Entity from './Entity';

export { Client, Server, Entity, Blocks, Items, Components, Entities, Events, on };
