import { ICreature } from "creature/ICreature";
import { FacingDirection } from "Enums";
import Mod from "mod/Mod";
import IPlayer from "Player/IPlayer";
import { ITile } from "tile/ITerrain";
import { BindCatcherApi } from "newui/BindingManager";
export default class DeveloperTools extends Mod {
    private elementDialog;
    private keyBindDialog;
    private keyBindSelectLocation;
    private elementContainer;
    private elementInner;
    private elementDayNightTime;
    private elementReputationValue;
    private elementWeightBonusValue;
    private inspection;
    private isPlayingAudio;
    private audioToPlay;
    private isCreatingParticle;
    private particleToCreate;
    private dictionary;
    private selectAction;
    private setTimeAction;
    private setReputationAction;
    private setWeightBonusAction;
    private refreshStatsAction;
    private killAllCreaturesAction;
    private unlockRecipesAction;
    private reloadShadersAction;
    private noclipAction;
    private toggleTilledAction;
    private teleportToHostAction;
    private tameCreatureAction;
    private data;
    private globalData;
    onInitialize(saveDataGlobal: any): any;
    onUninitialize(): any;
    onLoad(saveData: any): void;
    onSave(): any;
    onGameStart(isLoadingSave: boolean): void;
    isPlayerSwimming(player: IPlayer, isSwimming: boolean): boolean;
    onShowInGameScreen(): void;
    onGameTickEnd(): void;
    canClientMove(): false | undefined;
    onBindLoop(bindPressed: true | undefined, api: BindCatcherApi): true | undefined;
    canCreatureAttack(creature: ICreature, enemy: IPlayer | ICreature): boolean;
    onMove(player: IPlayer, nextX: number, nextY: number, tile: ITile, direction: FacingDirection): boolean | undefined;
    onNoInputReceived(player: IPlayer): void;
    private generateSelect(enums, objects, className, labelName);
    private updateSliders();
}
