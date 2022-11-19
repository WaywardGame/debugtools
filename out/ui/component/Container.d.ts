import { IContainer } from "game/item/IItem";
import Component from "ui/component/Component";
export default class Container extends Component {
    static INSTANCE: Container | undefined;
    static init(): Container;
    static appendTo(component: Component, host: Component, containerSupplier: () => IContainer | undefined): Promise<void>;
    private readonly wrapperContainedItems;
    private readonly rangeBulkDurability;
    private containerSupplier?;
    private items;
    constructor();
    releaseAndRemove(): void;
    refreshItems(): void;
    private willRemove;
    private getContainer;
    private clear;
    private applyBulkDurability;
}
