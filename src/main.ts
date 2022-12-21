import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppConfig } from './app/shared/config/config.model';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

(async () => {
  const config = (await fetch(`assets/config/app-config.${environment.production ? 'prod' : 'dev'}.json`).then((res) =>
    res.json(),
  )) as AppConfig;
  void AppComponent.bootstrap(config);
})();
