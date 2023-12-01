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
import { IContainer } from "@wayward/game/game/item/IItem";
import Component from "@wayward/game/ui/component/Component";
import ItemDropdown from "@wayward/game/ui/component/dropdown/ItemDropdown";
export default class AddItemToInventory extends Component {
    private readonly containerSupplier;
    static itemDropdown?: ItemDropdown<"None" | "Random" | "All">;
    private static initItemDropdown;
    private readonly dropdownItemType;
    private readonly dropdownItemQuality;
    private readonly rangeItemQuantity;
    private readonly wrapperAddItem;
    constructor(containerSupplier: () => IContainer | undefined);
    private changeItem;
    private usingSearch;
    private addItem;
}
