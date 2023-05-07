import { Registable } from "@xkairo/scrapy-interfaces";
import "reflect-metadata";
import {
  container,
  InjectionToken,
  isClassProvider,
  isValueProvider,
} from "tsyringe";
import { ResolverException } from "../Exceptions/ResolverException";

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
