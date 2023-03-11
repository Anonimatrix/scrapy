import "reflect-metadata";
import { container } from "tsyringe";
import {
  ClassProvider,
  InjectionToken,
  isClassProvider,
  isValueProvider,
  ValueProvider,
} from "tsyringe";

export type Registable = {
  [key: string]: ValueProvider<unknown> | ClassProvider<unknown>;
};

export class Resolver {
  static resolve<T>(target: InjectionToken<T>): T {
    return container.resolve(target);
  }

  static register(registers: Registable): void {
    Object.entries(registers).forEach(([token, provider]) => {
      if (isClassProvider(provider)) {
        container.register(token, provider);
        return;
      }

      if (isValueProvider(provider)) {
        container.register(token, provider);
        return;
      }
    });
  }
}
