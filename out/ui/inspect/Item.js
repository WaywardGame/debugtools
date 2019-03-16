var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/component/Button", "newui/component/Component", "newui/component/Text", "utilities/Objects", "../../action/AddItemToInventory", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/AddItemToInventory", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, Dictionaries_1, Translation_1, Mod_1, Button_1, Component_1, Text_1, Objects_1, AddItemToInventory_1, Remove_1, IDebugTools_1, Array_1, AddItemToInventory_2, InspectInformationSection_1) {
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
            this.until("WillRemove")
                .bind(addItemToInventory, AddItemToInventory_2.AddItemToInventoryEvent.Execute, this.addItem);
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
                    .get(Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, item, true).inContext(3)))
                    .appendTo(this.wrapperItems);
                new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                    .on(Button_1.ButtonEvent.Activate, this.removeItem(item))
                    .appendTo(this.wrapperItems);
            }
        }
        logUpdate() {
            this.LOG.info("Items:", this.items);
        }
        addItem(_, type, quality) {
            ActionExecutor_1.default.get(AddItemToInventory_1.default).execute(localPlayer, itemManager.getTileContainer(this.position.x, this.position.y, localPlayer.z), type, quality);
        }
        removeItem(item) {
            return () => {
                ActionExecutor_1.default.get(Remove_1.default).execute(localPlayer, item);
            };
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], ItemInformation.prototype, "LOG", void 0);
    __decorate([
        Objects_1.Bound
    ], ItemInformation.prototype, "addItem", null);
    __decorate([
        Objects_1.Bound
    ], ItemInformation.prototype, "removeItem", null);
    exports.default = ItemInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0l0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBcUJBLE1BQXFCLGVBQWdCLFNBQVEsbUNBQXlCO1FBV3JFO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFKRCxVQUFLLEdBQVksRUFBRSxDQUFDO1lBTTNCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxtQkFBUyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxtQkFBUyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTztnQkFDTixDQUFDLENBQUMsRUFBRSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3BELENBQUM7UUFDSCxDQUFDO1FBRU0sTUFBTTtZQUNaLE1BQU0sa0JBQWtCLEdBQUcsNEJBQTJCLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsS0FBSyxjQUEyQjtpQkFDbkMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLDRDQUF1QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUUsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRU0sTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztZQUM1QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUU3QyxJQUFJLDBCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUFFLE9BQU87WUFDbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUV6QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO2dCQUFFLE9BQU87WUFFL0IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXBCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDOUIsSUFBSSxnQkFBUyxFQUFFO3FCQUNiLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFFBQVEsQ0FBQztxQkFDeEQsR0FBRyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLHlCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQW1CLENBQUMsQ0FBQztxQkFDbkYsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFOUIsSUFBSSxnQkFBTSxFQUFFO3FCQUNWLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUN4RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUM5QjtRQUNGLENBQUM7UUFFTSxTQUFTO1lBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBR08sT0FBTyxDQUFDLENBQU0sRUFBRSxJQUFjLEVBQUUsT0FBZ0I7WUFDdkQsd0JBQWMsQ0FBQyxHQUFHLENBQUMsNEJBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNKLENBQUM7UUFHTyxVQUFVLENBQUMsSUFBVztZQUM3QixPQUFPLEdBQUcsRUFBRTtnQkFDWCx3QkFBYyxDQUFDLEdBQUcsQ0FBQyxnQkFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUM7UUFDSCxDQUFDO0tBQ0Q7SUFyRUE7UUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7Z0RBQ0M7SUEyRHpCO1FBREMsZUFBSztrREFHTDtJQUdEO1FBREMsZUFBSztxREFLTDtJQXZFRixrQ0F3RUMifQ==