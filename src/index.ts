import Entity from './Entity';

import Blocks from './reference/blocks';
import Components from './reference/components';
import Entities from './reference/entities';
import Events from './reference/events';
import Items from './reference/items';

import Client from './systems/ClientSystem';
import Server from './systems/ServerSystem';

import { on } from './decorators';

export * from './maps';

export { Client, Server, Entity, Blocks, Items, Components, Entities, Events, on };
