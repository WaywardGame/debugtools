export interface IInspectionMessages {
    QueryInspection: number;
    QueryObjectNotFound: number;
}
export interface IInspectionMessageDelegate {
    inspectionMessages: IInspectionMessages;
}
export declare class Inspection {
    private bQueryInspection;
    private messageDelegate;
    private inspectors;
    constructor(messageDelegate: IInspectionMessageDelegate);
    isQueryingInspection(): boolean;
    queryInspection(): void;
    update(): void;
    inspect(mouseX: number, mouseY: number, createDialog: any): void;
}
