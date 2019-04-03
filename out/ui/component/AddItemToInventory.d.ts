import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import { Quality } from "game/IObject";
import { ItemType } from "item/IItem";
import Component from "newui/component/Component";
interface IAddItemToInventoryEvents extends Events<Component> {
    execute(type: ItemType, quality: Quality): any;
}
export default class AddItemToInventory extends Component {
    event: IEventEmitter<this, IAddItemToInventoryEvents>;
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
