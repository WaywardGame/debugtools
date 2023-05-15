/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
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
