import { IDialogInfo } from "ui/IUi";
export declare class Inspection {
    private bQueryInspection;
    private inspectors;
    private dictionary;
    constructor(dictionary: number);
    isQueryingInspection(): boolean;
    queryInspection(): void;
    update(): void;
    inspect(mouseX: number, mouseY: number, createDialog: (dialogContainer: JQuery, dialogInfo: IDialogInfo) => JQuery): void;
}
