import BaseSystem from './systems/BaseSystem';
import { EVENT_BRAND, IEventMap } from './types';

type EMKey = keyof IEventMap & string;

export type Handler = (...args: any[]) => any;
export type TypedMethod<E extends EMKey> = IEventMap[E] extends never
  ? () => void
  : (data: IEventMap[E]) => void;

function brand(object: any, value: string | boolean = true) {
  Object.defineProperty(object, EVENT_BRAND, { value });
  return object;
}

function wrapper(handler: Handler, event: string): Handler {
  return brand(handler, event);
}


function decorate<E extends EMKey>(event: E) {
  return <
    T extends BaseSystem<any> & { [P in keyof T]: T[P] },
    K extends keyof T
  >(
    prototype: T,
    key: K,
    descriptor: TypedPropertyDescriptor<TypedMethod<E>>
  ): void | TypedPropertyDescriptor<TypedMethod<E>> => {
    const fn = typeof prototype === 'function';
    fn ? brand(prototype, event) : brand(prototype[key], event);
    return descriptor;
  };
}

export function on<E extends EMKey>(event: E): MethodDecorator;
export function on<E extends EMKey>(
  event: E,
  handler: Handler
): Handler;
export function on<E extends EMKey>(
  event: E,
  handler?: Handler
): Handler | MethodDecorator {
  if (typeof handler === 'function') {
    return wrapper(handler, event);
  } else {
    return <
      T extends BaseSystem<any> & { [P in keyof T]: T[P] },
      K extends keyof T
    >(
      target: T,
      key: K,
      descriptor: TypedPropertyDescriptor<TypedMethod<E>>
    ) => {
      decorate(event)(target, key, descriptor);
      return target;
    };
  }
}
