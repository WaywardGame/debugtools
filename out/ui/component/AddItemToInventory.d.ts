import { IContainer } from "game/item/IItem";
import Component from "ui/component/Component";
export default class AddItemToInventory extends Component {
    private readonly containerSupplier;
    private readonly dropdownItemType;
    private readonly dropdownItemQuality;
    private readonly rangeItemQuantity;
    private readonly wrapperAddItem;
    constructor(containerSupplier: () => IContainer | undefined);
    private changeItem;
    private addItem;
}
