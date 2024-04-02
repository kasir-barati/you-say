#### Please note that all the packages that we have created here for our backend are not NestJS dynamic modules but they are also normal Nx packages

# What are the NestJS modules

Refs (read in the specified order to get the most out of this section):

1. [Modules](https://docs.nestjs.com/modules)
2. [Dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules)

A class annotated with a `@Module()` to provide the necessary metadata for organizing the application structure. Each module encapsulates a closely related set of features. Building blocks of a module:

- `providers`: **Will be instantiated** by the Nest injector and that may be shared at least across this module.
- `controllers`: Module's controllers
- `exports`: Here we are gonna list the `providers` that we want to make available to other modules. Meaning if you do not export anything you cannot expect them to be accessible in other modules.
- `imports`: OK, so we can have multiple modules in our application, defined their `providers`, `controllers` and what are their **APIs (`exports`)**. But how to employ their exported `providers`? `imports` is the answer.

#### So far we've understood that by utilizing modules we comply by [SOLID](https://en.wikipedia.org/wiki/SOLID) principles.

> [!NOTE]
> Before we forget to mention it let's add that modules in NestJS are [singletons](https://en.wikipedia.org/wiki/Singleton_pattern).

## Global modules

So we've come to realize that some modules such as auth, or logger needs to be accessible throughout the entire application. So that is when we annotate our module with `@Global()` decorator.

# Dynamic modules

Have you ever wondered how to create a customizable module that can be shared or reused across multiple applications? Well, this is where dynamic modules come into play. So what is customizable?

::: Register and configure providers dynamically

> [!TIP]
>
> 1. Statically defined properties (`exports`, `controllers`, `providers`, `imports`) are not overwritten by the dynamic ones specified in the `forRoot*`. Bur rather extend them.
> 2. If you want to register a dynamic module in the global scope, set the `global` property to true.

So here is how we can create a dynamic module:

1. Create a class that is annotated with `@Module()` decorator and optionally with `@Global()` decorator.
2. Create a **static** method called `forRoot*()` that returns the dynamic module(`DynamicModule` interface), this method could be called `register*()` too. Basically its name is not too important but by convention we call it either `register*()` or `forRoot*()`.
3. Pass down (`inject`) the `options` received in the form of arguments in the `forRoot*()` method to the services that needs to change their behavior according to the `options`;
   a. We are gonna utilize NestJS's [custom providers](https://docs.nestjs.com/fundamentals/custom-providers) to inject options
   b. We needs [JS Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) to ensure uniqueness of our custom provider.
