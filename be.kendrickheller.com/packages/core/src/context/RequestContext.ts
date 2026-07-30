import { AsyncLocalStorage } from 'node:async_hooks';

export interface UserContext {
  userId?: string | number;
  loginName?: string;
  roles?: string[];
}

export class RequestContext {
  private static storage = new AsyncLocalStorage<UserContext>();

  public static run(context: UserContext, callback: () => void) {
    this.storage.run(context, callback);
  }

  public static get(): UserContext | undefined {
    return this.storage.getStore();
  }

  public static getLoginName(): string | undefined {
    return this.get()?.loginName;
  }
}
