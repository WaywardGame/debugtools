import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
export declare enum AddItemToInventoryEvent {
    Execute = "Execute"
}
export default class AddItemToInventory extends Component {
    private static INSTANCE;
    static get(api: UiApi): AddItemToInventory;
    private readonly dropdownItemType;
    private readonly dropdownItemQuality;
    private readonly wrapperAddItem;
    private constructor();
    releaseAndRemove(): void;
    private willRemove;
    private changeItem;
    private addItem;
}
