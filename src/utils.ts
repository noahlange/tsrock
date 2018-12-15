import { IEventMap } from './';
import { EVENT_BRAND } from './decorators';

type EventHandler<K extends keyof IEventMap> = { [EVENT_BRAND]: keyof IEventMap } & ((
  ...data: Array<IEventMap[K]>
) => void);

export const keys = <T extends object, K extends keyof T>(o: T) => Object.keys(o) as K[];

/**
 * Based on electrum-utils' implementation: return an array of keys corresponding to methods on
 * the object's prototype.
 * https://github.com/epsitec-sa/electrum-utils/blob/master/src/get-instance-method-names.js
 */
export function getInstanceMethodNames<T extends object, K extends keyof T = keyof T>(
  obj: T,
  stop: any
): K[] {
  const array: K[] = [];
  let proto = Object.getPrototypeOf(obj);
  while (proto && proto !== stop) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      if (name !== 'constructor') {
        if (hasMethod(proto, name)) {
          array.push(name as K);
        }
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return array;
}

export function hasMethod<T extends object>(obj: T, name: keyof T): boolean {
  const desc = Object.getOwnPropertyDescriptor(obj, name);
  return !!desc && typeof desc.value === 'function';
}

export function isEventHandler<K extends keyof IEventMap>(fn: unknown): fn is EventHandler<K> {
  return typeof fn === 'function' && EVENT_BRAND in fn;
}
