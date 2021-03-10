import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WidgetApiService } from "../../shared/services/integrations/widget-api.service";
import { CapableWidget } from "../capable-widget";
import { ScalarWidgetApi } from "../../shared/services/scalar/scalar-widget.api";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";


@Component({
    selector: "my-edumeet-widget-wrapper",
    templateUrl: "edumeet.component.html",
    styleUrls: ["edumeet.component.scss"],
})
export class EdumeetWidgetWrapperComponent extends CapableWidget implements OnInit, OnDestroy {


    public iframeUrl: SafeUrl = null;

    private domain: string;
    private conferenceId: string;
    private displayName: string;
    private avatarUrl: string;
    private userId: string;
    private sanitizer: DomSanitizer

    // @ts-ignore
    constructor(activatedRoute: ActivatedRoute, private widgetApi: WidgetApiService, sanitizer: DomSanitizer) {
        super();
        this.supportsAlwaysOnScreen = true;

        let params: any = activatedRoute.snapshot.queryParams;

        this.domain = params.domain;
        this.conferenceId = params.conferenceId || params.confId;
        this.displayName = params.displayName;
        this.avatarUrl = params.avatarUrl;
        this.userId = params.userId;

        this.sanitizer = sanitizer


        // Set the widget ID if we have it
        ScalarWidgetApi.widgetId = params.widgetId;

        ScalarWidgetApi.sendSetAlwaysOnScreen(true);
    }

    public ngOnInit() {
        super.ngOnInit();

        const params = {
            displayName: this.displayName,
            avatarUrl: this.avatarUrl,
            userId: this.userId,
            autoJoin: 'true'
        }
        const queryString = Object.keys(params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');

        const url = `https://${this.domain}/${this.conferenceId}?${queryString}`
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

