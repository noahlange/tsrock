# tsrock

It's TypeScript, but for people who dig up rocks, e.g., miners. A wildly unstable and paper thin
but very sugary wrapper around the JS scripting API for _Minecraft: Bedrock Edition_. Could not
have been made without AtomicBlom's [extensive work](https://github.com/minecraft-addon-tools)
in generating some initial types from the documentation.

Obviously not recommended for "production" use. If the idea of frequent API breakage is not
appealing to your sensibilities, I would avoid this like the plague for at _least_ six months.

## Installation and building

```bash
npm i tsrock
```

## Systems

Systems made simple! Write methods like you normally would, decorate your event handlers, store
data on the class... all with the type-safety of TypeScript. Never misspell an event name ever
again! Hooray!

```typescript
import { Client, Events, on } from 'tsrock';
import { CustomEvents } from './events';

// extend client system
class MyClient extends Client {
  @on(Events.CLIENT_ENTERED_WORLD)
  public onClientEnteredWorld(e: IClientEnteredWorldEvent) {
    this.events.broadcast(CustomEvents.ON_CLIENT_JOINED, e.player);
    this.log('🎉');
  }
}

// boom, instantiated!
const mc = new MyClient();
```

## Entities & Components

Easily fetch, add, remove and update components on entities.

Registering new components is also a snap.

```typescript
import { Components, Server, on } from 'tsrock';
import { CustomEvents } from './events';
import { CustomComponents } from './components';

enum Feelings {
  CONTENT,
  AWESOME
}

class MyServer extends Server {

  @on(CustomEvents.ON_CLIENT_JOINED)
  public onClientJoined(e: IEntityObject) {
    const client = this.entities.from(e);
    client.components.add({
      [CustomComponents.MY_COMPONENT]: { feeling: Feelings.AWESOME }
      [Components.POSITION]: { x: 1, y: 15, z: 1 },
      [Components.NAME]: { name: 'I am falling!' }
    });
  }

  public initialize() {
    this.register.component(CustomComponents.MY_COMPONENT, { feeling: Feelings.CONTENT });
  }
}

const ms = new MyServer();
```

## Events

Listening for events is as easy as adding the `on()` decorator to any of your system's class
methods, or, for environments without decorators, wrapping a function property with that import.

```typescript
import { Components, Server, on } from 'tsrock';
import { CustomEvents, IBeforeWaveEvent, IFinishWaveEvent } from './events';

enum States {
  IDLE,
  BEFORE_GAME,
  BEFORE_WAVE,
  DURING_WAVE,
  FINISH_WAVE,
  FINISH_GAME
}

interface IServerData {
  wave: number;
  state: States
}

class MyServer extends Server {
  public data: IServerData = {
    wave: 1,
    state: States.IDLE
  };

  // ugly, but functional!
  public onFinishWave = on(CustomEvents.ON_FINISH_WAVE, (e: IFinishWaveEvent) => {
    this.log(`Finished wave #${e.wave}`);
    // do stuff!
  });

  // aw yeah, decorators! aw shucks, I'll need to rewrite these in six months!
  @on(CustomEvents.ON_BEFORE_WAVE)
  public onBeforeWave(e: IBeforeWaveEvent) {
    this.log(`Setting up wave #${e.wave}!`);
    // do stuff!
  }

  public update() {
    switch (this.data.state) {
      case States.BEFORE_WAVE:
        this.events.broadcast(CustomEvents.ON_BEFORE_WAVE, { wave: this.data.wave++; });
        return;
      case States.FINISH_WAVE:
        this.events.broadcast(CustomEvents.ON_FINISH_WAVE, { wave: this.data.wave });
        return;
      case GameState.IDLE:
      default:
        // no-op
        return;
    }
  }
}

const ms = new MyServer();
```
