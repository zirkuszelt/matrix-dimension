import { DISABLE_AUTOMATIC_WRAPPING, WidgetComponent } from "../widget.component";
import { EditableWidget, WIDGET_EDUMEET } from "../../../shared/models/widget";
import { Component } from "@angular/core";
// import { FE_EdumeetWidget } from "../../../shared/models/integration";
// import { SessionStorage } from "../../../shared/SessionStorage";
import { NameService } from "../../../shared/services/name.service";
import * as url from "url";
import { TranslateService } from "@ngx-translate/core";


@Component({
    templateUrl: "edumeet.widget.component.html",
    styleUrls: ["edumeet.widget.component.scss"],
})
export class EdumeetWidgetConfigComponent extends WidgetComponent {

    // private jitsiWidget: FE_EdumeetWidget = <FE_EdumeetWidget>SessionStorage.editIntegration;

    constructor(private nameService: NameService, public translate: TranslateService) {
        super(WIDGET_EDUMEET, "Edumeet Video Conference", DISABLE_AUTOMATIC_WRAPPING, translate);
    }

    protected OnWidgetsDiscovered(widgets: EditableWidget[]) {
        for (const widget of widgets) {
            const templatedUrl = this.templateUrl(widget.url, widget.data);
            const parsedUrl = url.parse(templatedUrl, true);
            const conferenceId = parsedUrl.query["conferenceId"];
            const confId = parsedUrl.query["confId"];
            const domain = parsedUrl.query["domain"];
            let isAudioConf: string | boolean = <string>parsedUrl.query["isAudioConf"];
            let isAudioOnly: string | boolean = <string>parsedUrl.query["isAudioOnly"];

            // Convert isAudioConf to boolean
            if (isAudioConf === "true") isAudioConf = true;
            else if (isAudioConf === "false") isAudioConf = false;
            else if (isAudioConf && isAudioConf[0] === '$') isAudioConf = widget.data["isAudioConf"];
            else isAudioConf = null; // default

            // Convert isAudioOnly to boolean
            if (isAudioOnly === "true") isAudioOnly = true;
            else if (isAudioOnly === "false") isAudioOnly = false;
            else if (isAudioOnly && isAudioOnly[0] === '$') isAudioOnly = widget.data["isAudioOnly"];
            else isAudioOnly = null; // default

            if (confId) {
                // It's a legacy Dimension widget
                widget.data.conferenceId = confId;
            } else widget.data.conferenceId = conferenceId;

            if (domain) widget.data.domain = domain;
            else widget.data.domain = "letsmeet.no";

            if (isAudioConf !== null) {
                // It's a legacy Dimension widget
                widget.data.isAudioOnly = isAudioConf;
            } else widget.data.isAudioOnly = !!isAudioOnly;

            widget.data.conferenceUrl = "https://" + widget.data.domain + "/" + widget.data.conferenceId;
        }
    }

    protected OnNewWidgetPrepared(widget: EditableWidget): void {
        const name = this.nameService.getHumanReadableName();

        let rootUrl = "https://letsmeet.no/";
        // if (this.jitsiWidget.options && this.jitsiWidget.options.jitsiDomain) {
        //     rootUrl = "https://" + this.jitsiWidget.options.jitsiDomain + "/";
        // }

        widget.dimension.newData["conferenceUrl"] = rootUrl + name;
    }

    protected OnWidgetBeforeAdd(widget: EditableWidget) {
        this.setEdumeetUrl(widget);
    }

    protected OnWidgetBeforeEdit(widget: EditableWidget) {
        this.setEdumeetUrl(widget);
    }

    private setEdumeetUrl(widget: EditableWidget) {
        const jitsiUrl = url.parse(widget.dimension.newData.conferenceUrl);
        widget.dimension.newData.domain = jitsiUrl.host;
        widget.dimension.newData.conferenceId = jitsiUrl.path.substring(1);

        let widgetQueryString = url.format({
            query: {
                "conferenceId": "$conferenceId",
                "domain": "$domain",
                "isAudioOnly": "$isAudioOnly",
                "displayName": "$matrix_display_name",
                "avatarUrl": "$matrix_avatar_url",
                "userId": "$matrix_user_id",
            },
        });
        widgetQueryString = this.decodeParams(widgetQueryString, Object.keys(widget.dimension.newData).map(k => "$" + k));

        widget.dimension.newUrl = window.location.origin + "/edumeet/" + widgetQueryString;
    }
}
