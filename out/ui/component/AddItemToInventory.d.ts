import { ExtendedEvents } from "event/EventEmitter";
import { Quality } from "game/IObject";
import { ItemType } from "item/IItem";
import Component from "newui/component/Component";
interface IAddItemToInventoryEvents {
    execute(type: ItemType, quality: Quality): any;
}
export default class AddItemToInventory extends Component {
    event: ExtendedEvents<this, Component, IAddItemToInventoryEvents>;
    private static INSTANCE;
    static init(): AddItemToInventory;
    private readonly dropdownItemType;
    private readonly dropdownItemQuality;
    private readonly wrapperAddItem;
    private constructor();
    releaseAndRemove(): void;
    private willRemove;
    private changeItem;
    private addItem;
}
export {};
