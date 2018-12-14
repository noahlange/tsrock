import BaseSystem from './systems/BaseSystem';
import { EventMapKey, Handler, TypedMethod } from './types';

export const EVENT_BRAND = '__event';

function brand(object: any, value: string | boolean = true) {
  Object.defineProperty(object, EVENT_BRAND, { value });
  return object;
}

function decorate<E extends EventMapKey>(event: E) {
  return <T extends BaseSystem<any> & { [P in keyof T]: T[P] }, K extends keyof T>(
    prototype: T,
    key: K,
    descriptor: TypedPropertyDescriptor<TypedMethod<E>>
  ): void | TypedPropertyDescriptor<TypedMethod<E>> => {
    const fn = typeof prototype === 'function';
    fn ? brand(prototype, event) : brand(prototype[key], event);
    return descriptor;
  };
}

export function bind(target: any, key: string) {
  const fn = target[key];
  target[key] = function(...args: any[]) {
    return fn.apply(this, args);
  };
  return target;
}

export function on<E extends EventMapKey>(event: E): MethodDecorator;
export function on<E extends EventMapKey>(event: E, handler: Handler): Handler;
export function on<E extends EventMapKey>(
  event: E,
  handler?: Handler
): Handler | MethodDecorator {
  if (typeof handler === 'function') {
    return brand(handler, event);
  } else {
    return <T extends BaseSystem<any> & { [P in keyof T]: T[P] }, K extends keyof T>(
      target: T,
      key: K,
      descriptor: TypedPropertyDescriptor<TypedMethod<E>>
    ) => {
      decorate(event)(target, key, descriptor);
      return target;
    };
  }
}
