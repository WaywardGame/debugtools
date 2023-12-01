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

import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler, eventManager } from "@wayward/game/event/EventManager";
import { EquipType } from "@wayward/game/game/entity/IHuman";
import Player from "@wayward/game/game/entity/player/Player";
import Item from "@wayward/game/game/item/Item";
import { IItemReference } from "@wayward/game/game/item/ItemReference";
import Mod from "@wayward/game/mod/Mod";
import Button from "@wayward/game/ui/component/Button";
import GameEndMenu from "@wayward/game/ui/screen/screens/menu/menus/GameEndMenu";
import DebugTools from "../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../IDebugTools";
import Heal from "../action/Heal";
import { PlayerState } from "@wayward/game/game/entity/player/IPlayer";

export default class AccidentalDeathHelper {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private buttonAdded?: boolean = false;
	private deathInventory?: Item[];
	private equippedItems?: Record<EquipType, IItemReference>;

	public deregister(): void {
		delete this.equippedItems;
		delete this.deathInventory;

		eventManager.deregisterEventBusSubscriber(this);
	}

	@EventHandler(EventBus.LocalPlayer, "die")
	protected onDie(player: Player): void {
		if (this.DEBUG_TOOLS.hasPermission()) {
			this.deathInventory = [...player.inventory.containedItems];
			this.equippedItems = player.equippedReferences.entries()
				.toObject(([equipType, itemRef]) => [equipType, itemRef.raw()]);
		}
	}

	@EventHandler(GameEndMenu, "show")
	protected onShowGameEndMenu(menu: GameEndMenu): void {
		if (this.DEBUG_TOOLS.hasPermission() && menu.gameEndData.state === PlayerState.Dead && this.buttonAdded === false) {
			this.buttonAdded = true;
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
