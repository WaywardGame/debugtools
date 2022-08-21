import { Events, IEventEmitter } from "event/EventEmitter";
import { Quality } from "game/IObject";
import { ItemType } from "game/item/IItem";
import Component from "ui/component/Component";
import { ADD_ITEM_ALL, ADD_ITEM_RANDOM } from "../../action/AddItemToInventory";
interface IAddItemToInventoryEvents extends Events<Component> {
    execute(type: ItemType | typeof ADD_ITEM_RANDOM | typeof ADD_ITEM_ALL, quality: Quality, quantity: number): any;
}
export default class AddItemToInventory extends Component {
    event: IEventEmitter<this, IAddItemToInventoryEvents>;
    static INSTANCE: AddItemToInventory | undefined;
    static init(): AddItemToInventory;
    private readonly dropdownItemType;
    private readonly dropdownItemQuality;
    private readonly rangeItemQuantity;
    private readonly wrapperAddItem;
    private constructor();
    releaseAndRemove(): void;
    private willRemove;
    private changeItem;
    private addItem;
}
export {};
