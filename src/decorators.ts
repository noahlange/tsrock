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

/**
 * https://github.com/andreypopp/autobind-decorator
 * shamelessly torn from this library, released under the MIT license
 */
export function bind(target: any, key: string, descriptor: PropertyDescriptor) {
  const { constructor } = target;
  let { value: fn } = descriptor;
  return {
    configurable: true,
    get() {
      if (this === target) {
        return fn;
      }
      if (
        this.constructor !== constructor &&
        Object.getPrototypeOf(this).constructor === constructor
      ) {
        return fn;
      }
      const bound = fn.bind(this);
      Object.defineProperty(this, key, {
        get() {
          return bound;
        },
        set(value: any) {
          fn = value;
          delete this[key];
        }
      });
      return bound;
    },
    set(value: Handler) {
      fn = value;
    }
  };
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
