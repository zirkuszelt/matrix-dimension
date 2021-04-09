import { Component } from "@angular/core";
import { FE_JitsiWidget } from "../../../shared/models/integration";
// import { ToasterService } from "angular2-toaster";
import { DialogRef, ModalComponent } from "ngx-modialog";
import { WidgetConfigDialogContext } from "../widgets.component";
// import { AdminIntegrationsApiService } from "../../../shared/services/admin/admin-integrations-api.service";
// import { TranslateService } from "@ngx-translate/core";

@Component({
    templateUrl: "./presentation.component.html",
    styleUrls: ["./presentation.component.scss", "../config-dialog.scss"],
})
export class AdminWidgetPresentationConfigComponent implements ModalComponent<WidgetConfigDialogContext> {

    public isUpdating = false;
    public widget: FE_JitsiWidget;
    private originalWidget: FE_JitsiWidget;

    constructor(public dialog: DialogRef<WidgetConfigDialogContext>) {
        // this.translate = translate;
        this.originalWidget = dialog.context.widget;
        this.widget = JSON.parse(JSON.stringify(this.originalWidget));

    }

    public save() {

    }

    public toggleForcedJitsi() {
    }
}
