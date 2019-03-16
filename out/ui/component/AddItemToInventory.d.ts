import Component from "newui/component/Component";
export declare enum AddItemToInventoryEvent {
    Execute = "Execute"
}
export default class AddItemToInventory extends Component {
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
