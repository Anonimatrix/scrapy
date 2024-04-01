# Scrapy

## Sobre el proyecto

Este proyecto tiene la idea de facilitar los scraps a sitios web ofreciendo una solucion modularizada para que parte del proceso en estos.
Esto tambien permitira el uso de inversion de dependencias.
Los tipos de modulos son los siguientes:
    -Uploaders
    -Processors
    -Services
    -Scrapers

Ejemplo basico de scrap:

```typescript
    import Scraper, { Uploaders, Processors, ExceptionsHandlers } from "@xkairo/scrapy";
    import path from "path";
    import { RandomScraper } from "path-to-your-scraper";

    const filepath = path.join(__dirname, "result.csv");
    const config = {
      uploaders: [Uploaders.LocalUploader],
      processors: [Processors.CsvProcessor],
      scrapers: [RandomScraper],
      services: [Puppeteer],
      providers: [
        puppeteerProvider,
        {
          filepath: {
            useValue: filepath,
          },
        },
      ],
      exceptionHandler: ExceptionHandler,
    };

    const scraper = new Scraper(config);

    await scraper.init();
```

## Creacion de modulos propios

En caso de querer crear un modulo para su uso en el paquete sin necesidad de tener que requerir la libreria puede usar el paquete diseñado para esto [Scrapy interfaces](<https://www.npmjs.com/package/@xkairo/scrapy-interfaces>), esta permitira el desarrollo del mismo sin tener que requerir toda esta libreria.

## Inyeccion de dependencias

Este paquete hace uso de la libreria tsyring para resolver la inyeccion de dependencias.
Podra utilizar herramientas de la misma para proveer valores/instancias en las clases creadas.
Ejemplo de inyeccion:

```typescript
    constructor(@inject("filepath") private filepath: string) {}
```

y tendra que pasar dentro de la configuracion un array providers con los valores a inyectar

```typescript
    providers: [{
        filepath: {
            useValue: filepath,
        }
        otherDataToInject: {
            useClass: Class
        }
    }],
```

### Scrapers

Estas clases seran las que se encarguen de obtener y devolver el objeto que cumpla con la interfaz cargada. Su implementacion puede ser distinta dependiendo del caso. Estas deben usar el decorador *injectable* e implementar la interfaz *PageScraperInterface*.
La libreria no trae ninguna implementacion de esta por defecto por lo que debera ser creada
Un ejemplo de creacion:

```typescript
@injectable()
export class PageScraper implements PageScraperInterface<UserInterface> {
  async scrap() {
    //Scrap logic
    return [
      {
        name: "test",
      },
    ];
  }
}
```

### Uploaders

Estos son los encargados del manejo del stream una vez finalizado su scrap y procesamiento, siendo el responsable del guardado de los datos.
Ejemplo de creacion:

```typescript
@injectable()
export class LocalUploader implements UploaderInterface {
    // In this class you need to inject filepath
  constructor(@inject("filepath") private filepath: string) {}
  /**
   * Uploads a file in system location
   */
  async upload(data: Readable): Promise<void> {
    const filepath = this.filepath;
    //Get dir of file path
    const dir = parse(filepath).dir;
    //Create dir if it doesn't exist recursively
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    //Create write stream and pipe data to it
    const ws = fs.createWriteStream(filepath);
    data.pipe(ws);

    return new Promise((resolve, reject) => {
      ws.on("finish", () => {
        resolve();
      });
      ws.on("error", (err) => {
        reject(err);
      });
    });
  }
}
```

Note el uso de *injectable* y de su interfaz

### Processors

Estos son los encargados de procesar los datos obtenidos por el scraper y retornarlos como un stream, pudiendo convertir los objetos en el formato de archivo que desee. Estos deben implementar la interfaz *ProcessorInterface* y usar el decorador *injectable*.
Ejemplo de creacion:

```typescript
@injectable()
export class CsvProcessor<T extends object> implements ProcessorInterface<T> {
  readonly extension = ".csv";
  /**
   * Process data to csv stream
   * @param { UserResultInterface[] } data Array of users to be processed
   * @returns { Readable }
   */
  public async process(data: T[]): Promise<Readable> {
    //Parse data to csv and save it to tmp file
    await new ObjectToCsv(data).toDisk(tmpPath);
    //Convert temp file to stream
    const stream = fs.createReadStream(tmpPath);
    //Delete file when stream is closed
    stream.on("close", () => {
      fs.unlinkSync(tmpPath);
    });
    return stream;
  }
}
```

### Services

Estos son los encargados de proveer la funcionalidad necesaria para el scraper, como por ejemplo el uso de puppeteer. Se pueden usar los providers para inyectar valores en estos. Pueden ser inyectados en cualquiera de los otros modulos con la inyeccion de dependencias y esa es su principal funcionalidad. Estos no necesitan una interfaz y usar el decorador *injectable*.

#### Puppeteer

En anteriores versiones este servicio se encontraba incluido en la version base. Debido a un peso innecesario en caso de no utilizarlo se decidio extraerlo a otra libreria [Scrapy Puppeteer Plugin](https://github.com/Anonimatrix/scrapy-puppeteer-plugin)

Scrapy Puppeteer Plugin provee la funcionalidad de puppeteer. Permite el uso de plugins de *puppeteer-extra-plugin* y unicamente es una capa sobre el modulo de puppeteer.

## Manejo de errores

Este paquete provee una clase que se encarga de manejar los errores que se puedan dar en el proceso de scrap. Ya existe una por defecto, pero puede hacer su propia implementacion. Esta clase debe implementar la interfaz *ExceptionHandlerInterface* y usar el decorador *injectable*.
Caso de creacion:

```typescript
export class ExceptionHandler implements ExceptionHandlerInterface {
  handle(exception: Exception): void {
    // Log the exception
    console.error("Error", exception.message);

    // If the exception has a cry function, call it
    exception.cry && exception.cry();

    // If the exception is fatal, stop the process
    if (exception.needStop) {
      process.exit(1);
    }
  }
}
```
