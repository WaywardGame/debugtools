interface IInspectionMessages {
    QueryInspection: number;
    QueryObjectNotFound: number;
}
interface IInspectionMessageDelegate {
    InspectionMessages: IInspectionMessages;
}
declare class Inspection {
    private bQueryInspection;
    private messageDelegate;
    private inspectors;
    constructor(messageDelegate: IInspectionMessageDelegate);
    isQueryingInspection(): boolean;
    queryInspection(): void;
    update(): void;
    inspect(mouseX: number, mouseY: number, createDialog: any): void;
}
declare abstract class Inspector {
    target: Object;
    private dialog;
    private dialogInfo;
    private dialogContainer;
    protected dataContainer: JQuery;
    protected attributes: {
        [index: string]: JQuery;
    };
    constructor(target: Object, id: string, title: string, mouseX: number, mouseY: number);
    abstract update(): void;
    createDialog(creator: Function): void;
}
declare class MonsterInspector extends Inspector {
    monster: IMonster;
    private monsterId;
    constructor(monsterId: number, mouseX: number, mouseY: number);
    update(): void;
}
