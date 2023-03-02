import "reflect-metadata";
import { container } from "tsyringe";
import { InjectionToken, ValueProvider } from "tsyringe/dist/typings/providers";

type Registable = {
  [key: string]: ValueProvider<unknown>;
};

export class Resolver {
  static resolve<T>(target: InjectionToken<T>): T {
    container.register("test", { useValue: "test" });
    return container.resolve(target);
  }

  static register(registers: Registable): void {
    Object.entries(registers).forEach(([token, provider]) => {
      container.register(token, provider);
    });
  }
}
