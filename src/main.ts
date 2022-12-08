import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppConfig } from './app/shared/config/config.model';

(async () => {
  const config = (await fetch('assets/config/app.config.json').then((res) =>
    res.json(),
  )) as AppConfig;
  if (config.isProduction) {
    enableProdMode();
  }
  void AppComponent.bootstrap(config);
})();
