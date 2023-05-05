import Player from "game/entity/player/Player";
import GameEndMenu from "ui/screen/screens/menu/menus/GameEndMenu";
import DebugTools from "../DebugTools";
export default class AccidentalDeathHelper {
    readonly DEBUG_TOOLS: DebugTools;
    private deathInventory?;
    private equippedItems?;
    protected onDie(player: Player): void;
    protected onShowGameEndMenu(menu: GameEndMenu): void;
}
