import { Resolver } from "../../src/services/Resolver/Resolver";
import { inject, injectable } from "tsyringe";
import { ResolverException } from "../../src/services/Exceptions/ResolverException";

describe("Resolver", () => {
  it("should resolve a provider if exists", () => {
    @injectable()
    class TestClass {
      public test: string;
      constructor(@inject("test") test: string) {
        this.test = test;
      }
    }

    const provider = { test: { useValue: "test" } };
    Resolver.register(provider);
    const testClass = Resolver.resolve(TestClass);
    expect(testClass.test).toBe("test");
  });

  it("should throw an error if the provider does not exist", () => {
    @injectable()
    class TestClass {
      public test: string;
      constructor(@inject("dsa") test: string) {
        this.test = test;
      }
    }

    expect(() => {
      Resolver.resolve(TestClass);
    }).toThrowError(ResolverException);
  });

  it("should throw an error if the class does have injectable decorator", () => {
    class TestClass {
      public test: string;
      constructor(@inject("dsa") test: string) {
        this.test = test;
      }
    }

    expect(() => {
      Resolver.resolve(TestClass);
    }).toThrowError(ResolverException);
  });
});
