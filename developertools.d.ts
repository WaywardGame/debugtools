/// <reference path="mod-reference/modreference.d.ts" />
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
declare class Mod extends Mods.Mod implements IInspectionMessageDelegate {
    private dialog;
    private keyBind;
    private noclipEnabled;
    private noclipDelay;
    private inMove;
    private container;
    private inner;
    private inspection;
    InspectionMessages: IInspectionMessages;
    private data;
    onInitialize(saveDataGlobal: any): any;
    onLoad(saveData: any): void;
    onSave(): any;
    onUnload(): void;
    onGameStart(isLoadingSave: boolean): void;
    isPlayerSwimming(player: Player, isSwimming: boolean): boolean;
    onShowInGameScreen(): void;
    onTurnComplete(): void;
    onMouseDown(event: JQueryEventObject): boolean;
    onKeyBindPress(keyBind: KeyBind): boolean;
    canMonsterAttack(monsterId: number, monster: IMonster): boolean;
    onMove(nextX: number, nextY: number, tile: ITile, direction: FacingDirection): boolean;
    onNoInputReceived(): void;
    updateDialogHeight(): void;
    private generateSelect(enums, objects, className, labelName);
}
