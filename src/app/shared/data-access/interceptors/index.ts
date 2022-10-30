import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiPrefixInterceptor } from "./api-prefix.interceptor";
import { BearerTokenInterceptor } from "./bearer-token.interceptor";

export const interceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiPrefixInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BearerTokenInterceptor,
    multi: true,
  },
];
