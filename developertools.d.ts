/// <reference path="mod-reference/modreference.d.ts" />
declare class Mod extends Mods.Mod {
    private dialog;
    private keyBind;
    private noclipEnabled;
    private noclipDelay;
    private inMove;
    private container;
    private data;
    onInitialize(saveDataGlobal: any): any;
    onLoad(saveData: any): void;
    onSave(): any;
    onUnload(): void;
    onGameStart(isLoadingSave: boolean): void;
    isPlayerSwimming(player: Player, isSwimming: boolean): boolean;
    getPlayerSpriteBatchLayer(player: Player, batchLayer: SpriteBatchLayer): SpriteBatchLayer;
    onShowInGameScreen(): void;
    onKeyBindPress(keyBind: KeyBind): boolean;
    canMonsterAttack(monsterId: number, monster: IMonster): boolean;
    onMove(nextX: number, nextY: number, tile: ITile, direction: FacingDirection): boolean;
    onNoInputReceived(): void;
    private generateSelect(enums, objects, className, labelName);
}
