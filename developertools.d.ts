/// <reference path="mod-reference/modreference.d.ts" />
/// <reference path="inspection.d.ts" />
import { IInspectionMessageDelegate, IInspectionMessages } from "./inspection";
export default class Mod extends Mods.Mod implements IInspectionMessageDelegate {
    inspectionMessages: IInspectionMessages;
    private dialog;
    private modRefreshSection;
    private keyBind;
    private noclipEnabled;
    private noclipDelay;
    private inMove;
    private container;
    private inner;
    private inspection;
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
    canCreatureAttack(creatureId: number, creature: Creature.ICreature): boolean;
    onMove(nextX: number, nextY: number, tile: Terrain.ITile, direction: FacingDirection): boolean;
    onNoInputReceived(): void;
    updateDialogHeight(): void;
    testFunction(): number;
    private generateSelect(enums, objects, className, labelName);
}
