import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const script = document.createElement('script');
script.src = environment.authorizeNet.URL;
document.head.appendChild(script);

// tslint:disable-next-line: variable-name
const _affirm_config = environment.AFFIRM_CONFIG;
// tslint:disable-next-line: no-any
((l: any, g: any, m: any, e: any, a: any, f: any, b: any) => {
  // tslint:disable-next-line
  let d, c = l[m] || {},h = document.createElement(f), n = document.getElementsByTagName(f)[0],k = function (a:any, b:any, c:any) { return function () { a[b]._.push([c, arguments]) } };c[e] = k(c, e, 'set'); d = c[e]; c[a] = {}; c[a]._ = []; d._ = []; c[a][b] = k(c, a, b);a = 0; for (b = 'set add save post open empty reset on off trigger ready setProduct'.split(' ');a < b.length; a++)d[b[a]] = k(c, e, b[a]); a = 0; for (b = ['get', 'token', 'url', 'items'];a < b.length; a++)d[b[a]] = function () { }; h.async = !0; h.src = g[f];n.parentNode.insertBefore(h, n); delete g[f]; d(g); l[m] = c
})(window, _affirm_config, 'affirm', 'checkout', 'ui', 'script', 'ready');
  
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
