import "reflect-metadata";
import { container } from "tsyringe";
import {
  ClassProvider,
  InjectionToken,
  isClassProvider,
  isValueProvider,
  ValueProvider,
} from "tsyringe";
import { ResolverException } from "../Exceptions/ResolverException";

export type Registable = {
  [key: string]: ValueProvider<unknown> | ClassProvider<unknown>;
};

export class Resolver {
  static resolve<T>(target: InjectionToken<T>): T {
    try {
      return container.resolve(target);
    } catch (e) {
      throw new ResolverException(
        `Could not resolve ${String(target)})} 
        Make sure that the class has the @injectable() decorator and that the provider is registered.`
      );
    }
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
