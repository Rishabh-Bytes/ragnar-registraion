import { Injectable } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

    @Injectable({
        providedIn: 'root',
      })
    
    export class UtilsService {

        constructor(private sanitizer: DomSanitizer) {}

        getTrustedHtml(html:any): SafeHtml {
          return this.sanitizer.bypassSecurityTrustHtml(html);
        }

        getYear(): Array<number> /* number[] */ {
            const years = [];
            for (let year = new Date().getFullYear()+1; year >= 2005; year--) {
                years.push(year);
            }
            return years;
        }
    }
