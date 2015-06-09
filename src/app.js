//import 'bootstrap';
//import 'bootstrap/css/bootstrap.css!';

export class App {
  configureRouter(config, router){
    config.title = 'less2css';
    config.map([
      { route: [''],  moduleId: './main',      nav: true, title:'' }
    ]);

    this.router = router;
  }
}
