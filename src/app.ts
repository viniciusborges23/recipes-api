import express, { Application } from 'express';
import bodyParser from 'body-parser';

interface AppConfig {
  port: string, controllers: any[]
}

class App {
  public app: Application;

  public port: string;

  constructor({ port, controllers }: AppConfig) {
    this.app = express();
    this.port = port;

    this.middlewares();
    this.controllers(controllers);
  }

  private middlewares() {
    this.app.use(bodyParser.json());
  }

  private controllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });

    this.app.get('*', (_, res) => res.sendStatus(405));
    this.app.put('*', (_, res) => res.sendStatus(405));
    this.app.delete('*', (_, res) => res.sendStatus(405));
    this.app.post('*', (_, res) => res.sendStatus(405));
  }

  public listen() {
    // eslint-disable-next-line
    this.app.listen(this.port, () => console.log(`Running on http://localhost:${this.port}`));
  }
}

export default App;
