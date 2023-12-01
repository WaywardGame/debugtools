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
import { Quality } from "@wayward/game/game/IObject";
import { IContainer } from "@wayward/game/game/item/IItem";
import Item from "@wayward/game/game/item/Item";
import ItemManager from "@wayward/game/game/item/ItemManager";
import Tile from "@wayward/game/game/tile/Tile";
import Button from "@wayward/game/ui/component/Button";
import Component from "@wayward/game/ui/component/Component";
import Details from "@wayward/game/ui/component/Details";
import Dropdown from "@wayward/game/ui/component/Dropdown";
export declare enum ContainerClasses {
    ContainedItemDetails = "debug-tools-container-contained-item-details",
    ItemDetails = "debug-tools-container-contained-item-details-item",
    Paginator = "debug-tools-container-contained-item-details-paginator",
    PaginatorButton = "debug-tools-container-contained-item-details-paginator-button",
    PaginatorPrev = "debug-tools-container-contained-item-details-paginator-button-prev",
    PaginatorNext = "debug-tools-container-contained-item-details-paginator-button-next",
    PaginatorInfo = "debug-tools-container-contained-item-details-paginator-info"
}
export default class Container extends Component {
    static INSTANCE: Container | undefined;
    static init(): Container;
    static appendTo(component: Component, host: Component, containerSupplier: () => IContainer | undefined): Promise<void>;
    static releaseAndRemove(): void;
    appendToHost(component: Component, host: Component, containerSupplier: () => IContainer | undefined): Promise<void>;
    private readonly wrapperContainedItems;
    private readonly rangeBulkDurability;
    private readonly rangeBulkDecay;
    private readonly dropdownBulkQuality;
    private readonly buttonBulkQualityApply;
    private containerSupplier?;
    private items;
    private page;
    constructor();
    showItem(item?: Item): ContainerItemDetails | undefined;
    refreshItems(): void;
    private getTotalPages;
    private getPageOf;
    private getItemsOfPage;
    private changeDisplayedItems;
    protected onContainerItemChange(itemManager: ItemManager, items: Item[], container?: IContainer, containerTile?: Tile): void;
    private willRemove;
    private getContainer;
    private clear;
    private applyBulkDurability;
    private applyBulkDecay;
    private applyBulkQuality;
}
export declare class ContainerItemDetails extends Details {
    private readonly itemRef;
    get item(): Item;
    readonly container?: Container;
    readonly dropdownQuality: Dropdown<Quality>;
    readonly buttonQualityApply: Button;
    constructor(item: Item);
    private applyDurability;
    private applyDecay;
    private applyQuality;
}
