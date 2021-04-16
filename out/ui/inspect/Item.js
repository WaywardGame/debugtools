var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Dictionaries", "language/Translation", "mod/Mod", "ui/component/Button", "ui/component/Component", "ui/component/Text", "../../action/AddItemToInventory", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/AddItemToInventory", "../component/InspectInformationSection"], function (require, exports, Dictionaries_1, Translation_1, Mod_1, Button_1, Component_1, Text_1, AddItemToInventory_1, Remove_1, IDebugTools_1, Array_1, AddItemToInventory_2, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ItemInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            this.items = [];
            this.wrapperAddItem = new Component_1.default().appendTo(this);
            this.wrapperItems = new Component_1.default().appendTo(this);
        }
        getTabs() {
            return [
                [0, IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TabItemStack)],
            ];
        }
        setTab() {
            const addItemToInventory = AddItemToInventory_2.default.init().appendTo(this.wrapperAddItem);
            addItemToInventory.event.until(this, "remove", "switchAway")
                .subscribe("execute", this.addItem);
            return this;
        }
        update(position, tile) {
            this.position = position;
            const items = [...tile.containedItems || []];
            if (Array_1.areArraysIdentical(items, this.items))
                return;
            this.items = items;
            this.wrapperItems.dump();
            if (!this.items.length)
                return;
            this.setShouldLog();
            for (const item of this.items) {
                new Text_1.Paragraph()
                    .setText(() => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ItemName)
                    .get(Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, item, true).inContext(Translation_1.TextContext.Title)))
                    .appendTo(this.wrapperItems);
                new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                    .event.subscribe("activate", this.removeItem(item))
                    .appendTo(this.wrapperItems);
            }
        }
        logUpdate() {
            this.LOG.info("Items:", this.items);
        }
        addItem(_, type, quality, quantity) {
            AddItemToInventory_1.default.execute(localPlayer, itemManager.getTileContainer(this.position.x, this.position.y, localPlayer.z), type, quality, quantity);
        }
        removeItem(item) {
            return () => {
                Remove_1.default.execute(localPlayer, item);
            };
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], ItemInformation.prototype, "LOG", void 0);
    __decorate([
        Override
    ], ItemInformation.prototype, "getTabs", null);
    __decorate([
        Override
    ], ItemInformation.prototype, "setTab", null);
    __decorate([
        Override
    ], ItemInformation.prototype, "update", null);
    __decorate([
        Override
    ], ItemInformation.prototype, "logUpdate", null);
    __decorate([
        Bound
    ], ItemInformation.prototype, "addItem", null);
    __decorate([
        Bound
    ], ItemInformation.prototype, "removeItem", null);
    exports.default = ItemInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0l0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBb0JBLE1BQXFCLGVBQWdCLFNBQVEsbUNBQXlCO1FBV3JFO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFKRCxVQUFLLEdBQVcsRUFBRSxDQUFDO1lBTTFCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxtQkFBUyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxtQkFBUyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFFZ0IsT0FBTztZQUN2QixPQUFPO2dCQUNOLENBQUMsQ0FBQyxFQUFFLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDcEQsQ0FBQztRQUNILENBQUM7UUFFZ0IsTUFBTTtZQUN0QixNQUFNLGtCQUFrQixHQUFHLDRCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDNUYsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQztpQkFDMUQsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFckMsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRWdCLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDdEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDLENBQUM7WUFFN0MsSUFBSSwwQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFBRSxPQUFPO1lBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRS9CLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQzlCLElBQUksZ0JBQVMsRUFBRTtxQkFDYixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxRQUFRLENBQUM7cUJBQ3hELEdBQUcsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyx5QkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLHlCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDbkYsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFOUIsSUFBSSxnQkFBTSxFQUFFO3FCQUNWLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUN4RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNsRCxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQzlCO1FBQ0YsQ0FBQztRQUVnQixTQUFTO1lBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUdPLE9BQU8sQ0FBQyxDQUFNLEVBQUUsSUFBNkQsRUFBRSxPQUFnQixFQUFFLFFBQWdCO1lBQ3hILDRCQUFrQixDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pKLENBQUM7UUFHTyxVQUFVLENBQUMsSUFBVTtZQUM1QixPQUFPLEdBQUcsRUFBRTtnQkFDWCxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQztLQUNEO0lBckVBO1FBREMsYUFBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBYyxDQUFDO2dEQUNDO0lBZWY7UUFBVCxRQUFRO2tEQUlSO0lBRVM7UUFBVCxRQUFRO2lEQU1SO0lBRVM7UUFBVCxRQUFRO2lEQXVCUjtJQUVTO1FBQVQsUUFBUTtvREFFUjtJQUdEO1FBREMsS0FBSztrREFHTDtJQUdEO1FBREMsS0FBSztxREFLTDtJQXZFRixrQ0F3RUMifQ==