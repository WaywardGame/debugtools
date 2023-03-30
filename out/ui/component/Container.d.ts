import { IContainer } from "game/item/IItem";
import Item from "game/item/Item";
import ItemManager from "game/item/ItemManager";
import Tile from "game/tile/Tile";
import Component from "ui/component/Component";
import Details from "ui/component/Details";
export declare enum ContainerClasses {
    ContainedItemDetails = "debug-tools-container-contained-item-details",
    ItemDetails = "debug-tools-container-contained-item-details-item"
}
export default class Container extends Component {
    static INSTANCE: Container | undefined;
    static init(): Container;
    static appendTo(component: Component, host: Component, containerSupplier: () => IContainer | undefined): Promise<void>;
    appendToHost(component: Component, host: Component, containerSupplier: () => IContainer | undefined): Promise<void>;
    private readonly wrapperContainedItems;
    private readonly rangeBulkDurability;
    private readonly rangeBulkDecay;
    private containerSupplier?;
    private items;
    constructor();
    releaseAndRemove(): void;
    refreshItems(): void;
    protected onContainerItemChange(items: ItemManager, item: Item, container?: IContainer, containerTile?: Tile): void;
    private willRemove;
    private getContainer;
    private clear;
    private applyBulkDurability;
    private applyBulkDecay;
}
export declare class ContainerItemDetails extends Details {
    private readonly itemRef;
    get item(): Item;
    constructor(item: Item);
    private applyDurability;
    private applyDecay;
}
