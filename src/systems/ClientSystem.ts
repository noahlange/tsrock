import BaseSystem from './BaseSystem';

/*
tslint:disable: member-ordering
  - ordered dependency issue - public members need access to private members.
*/

abstract class ClientSystem {
  private system: IVanillaServerSystem = client.registerSystem(0, 0);
  private base: BaseSystem<IVanillaClientSystem> = new BaseSystem(this.system);

  public entities = {
    query: this.base.entityQuery
  };

  public register = {
    component: this.base.registerComponent,
    query: this.base.registerQuery
  };

  public events = {
    broadcast: this.base.eventBroadcast,
    on: this.base.eventOn
  };

  public constructor() {
    if (this.update) {
      this.system.update = this.update.bind(this);
    }
    if (this.shutdown) {
      this.system.shutdown = this.shutdown.bind(this);
    }
    this.system.initialize = this._initialize.bind(this);
  }

  public initialize?(): void;
  public update?(): void;
  public shutdown?(): void;

  private _initialize() {
    this.base.bindEvents(this);
    if (this.initialize) {
      this.initialize();
    }
  }
}

export default ClientSystem;
