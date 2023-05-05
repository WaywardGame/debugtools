import { IContainer } from "game/item/IItem";
import Component from "ui/component/Component";
import ItemDropdown from "ui/component/dropdown/ItemDropdown";
export default class AddItemToInventory extends Component {
    private readonly containerSupplier;
    static itemDropdown?: ItemDropdown<"None" | "Random" | "All">;
    private readonly dropdownItemType;
    private readonly dropdownItemQuality;
    private readonly rangeItemQuantity;
    private readonly wrapperAddItem;
    constructor(containerSupplier: () => IContainer | undefined);
    private changeItem;
    private addItem;
}
