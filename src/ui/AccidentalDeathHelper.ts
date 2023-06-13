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

import { EventBus } from "event/EventBuses";
import { EventHandler } from "event/EventManager";
import { EquipType } from "game/entity/IHuman";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
import { IItemReference } from "game/item/ItemReference";
import Mod from "mod/Mod";
import Button from "ui/component/Button";
import GameEndMenu from "ui/screen/screens/menu/menus/GameEndMenu";
import DebugTools from "../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../IDebugTools";
import Heal from "../action/Heal";
import { PlayerState } from "game/entity/player/IPlayer";

export default class AccidentalDeathHelper {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private deathInventory?: Item[];
	private equippedItems?: Record<EquipType, IItemReference>;

	@EventHandler(EventBus.LocalPlayer, "die")
	protected onDie(player: Player) {
		if (this.DEBUG_TOOLS.hasPermission()) {
			this.deathInventory = [...player.inventory.containedItems];
			this.equippedItems = player.equippedReferences.entries()
				.toObject(([equipType, itemRef]) => [equipType, itemRef.raw()]);
		}
	}

	@EventHandler(GameEndMenu, "show")
	protected onShowGameEndMenu(menu: GameEndMenu) {
		if (this.DEBUG_TOOLS.hasPermission() && menu.gameEndData.state === PlayerState.Dead) {
			new Button()
				.event.subscribe("activate", () => {
					Heal.execute(localPlayer, localPlayer, this.deathInventory?.slice(), this.equippedItems ? { ...this.equippedItems } : undefined);
					delete this.deathInventory;
					delete this.equippedItems;
					menu.getScreen()?.menus.back();
				})
				.setText(translation(DebugToolsTranslation.RevertDeath))
				.appendTo(menu.content, { after: menu.continueAsGhostButton });
		}
	}
}
