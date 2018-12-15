import { IEventMap } from './';
import ClientSystem from './systems/ClientSystem';
import ServerSystem from './systems/ServerSystem';
import { Handler } from './types';

export const EVENT_BRAND = '__event';

function brand(object: any, value: string | boolean = true) {
  Object.defineProperty(object, EVENT_BRAND, { value });
  return object;
}

function decorate<E extends keyof IEventMap>(event: E & string) {
  return <
    T extends (ServerSystem | ClientSystem) & { [P in keyof T]: T[P] },
    K extends keyof T
  >(
    prototype: T,
    key: K,
    descriptor: any
  ): void | any => {
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

/**
 * Okay, tl;dr— given the name of an event E, we'll do a lookup in the Entity map for the
 * corresponding event signature. It'll throw a TS error of the method's signature does not
 * match the one in IEventMap. It won't give us any type inference in the method, which is a
 * bummer, but c'est la vie.
 *
 * If this is being called as a decorator factory, we should see this event as the first arg
 * with a returned function. If it's being called as a property wrapper, the event is the first
 * arg and the handler is the second.
 */
export function on<E extends keyof IEventMap>(
  event: E
): <T extends (ServerSystem | ClientSystem) & { [P in keyof T]: T[P] }, K extends keyof T>(
  target: T,
  key: K
) => TypedPropertyDescriptor<
  IEventMap[E] extends never ? () => void : (data: IEventMap[E]) => void
>;
export function on<E extends keyof IEventMap>(event: E, handler: Handler): Handler;
export function on<E extends keyof IEventMap>(event: E & string, handler?: Handler): Handler {
  if (typeof handler === 'function') {
    // return the branded handler.
    return brand(handler, event);
  } else {
    // return a decorator
    return <
      T extends (ServerSystem | ClientSystem) & { [P in keyof T]: T[P] },
      K extends keyof T
    >(
      target: T,
      key: K,
      descriptor: TypedPropertyDescriptor<
        IEventMap[E] extends never ? () => void : (data: IEventMap[E]) => void
      >
    ) => {
      decorate(event)(target, key, descriptor);
      return descriptor;
    };
  }
}
