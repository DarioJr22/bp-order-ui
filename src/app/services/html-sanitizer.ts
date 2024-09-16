import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
    providedIn:'root'
})

export class HtmlContent{

    sanitizerHTML(string){
        return this.sanitizerDom.bypassSecurityTrustResourceUrl(string)
    }

    constructor(private sanitizerDom:DomSanitizer){}
}
