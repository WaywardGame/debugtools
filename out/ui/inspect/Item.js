var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/component/Button", "newui/component/Component", "newui/component/Text", "utilities/Objects", "../../action/AddItemToInventory", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/AddItemToInventory", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, Dictionaries_1, Translation_1, Mod_1, Button_1, Component_1, Text_1, Objects_1, AddItemToInventory_1, Remove_1, IDebugTools_1, Array_1, AddItemToInventory_2, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ItemInformation extends InspectInformationSection_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.items = [];
            this.wrapperAddItem = new Component_1.default(this.api).appendTo(this);
            this.wrapperItems = new Component_1.default(this.api).appendTo(this);
        }
        getTabs() {
            return [
                [0, IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TabItemStack)],
            ];
        }
        setTab() {
            const addItemToInventory = AddItemToInventory_2.default.init(this.api).appendTo(this.wrapperAddItem);
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
                new Text_1.Paragraph(this.api)
                    .setText(() => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ItemName)
                    .get(Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, item, true).inContext(3)))
                    .appendTo(this.wrapperItems);
                new Button_1.default(this.api)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0l0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBc0JBLE1BQXFCLGVBQWdCLFNBQVEsbUNBQXlCO1FBV3JFLFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUpOLFVBQUssR0FBWSxFQUFFLENBQUM7WUFNM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLG1CQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksbUJBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTztnQkFDTixDQUFDLENBQUMsRUFBRSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3BELENBQUM7UUFDSCxDQUFDO1FBRU0sTUFBTTtZQUNaLE1BQU0sa0JBQWtCLEdBQUcsNEJBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3BHLElBQUksQ0FBQyxLQUFLLGNBQTJCO2lCQUNuQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsNENBQXVCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUUxRSxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFTSxNQUFNLENBQUMsUUFBa0IsRUFBRSxJQUFXO1lBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRTdDLElBQUksMEJBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQUUsT0FBTztZQUNsRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUUvQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFcEIsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUM5QixJQUFJLGdCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztxQkFDckIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsUUFBUSxDQUFDO3FCQUN4RCxHQUFHLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMseUJBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBbUIsQ0FBQyxDQUFDO3FCQUNuRixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUU5QixJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztxQkFDbEIsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7cUJBQ3hELEVBQUUsQ0FBQyxvQkFBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUMvQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQzlCO1FBQ0YsQ0FBQztRQUVNLFNBQVM7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFHTyxPQUFPLENBQUMsQ0FBTSxFQUFFLElBQWMsRUFBRSxPQUFvQjtZQUMzRCx3QkFBYyxDQUFDLEdBQUcsQ0FBQyw0QkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0osQ0FBQztRQUdPLFVBQVUsQ0FBQyxJQUFXO1lBQzdCLE9BQU8sR0FBRyxFQUFFO2dCQUNYLHdCQUFjLENBQUMsR0FBRyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FBQztRQUNILENBQUM7S0FDRDtJQXJFQTtRQURDLGFBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQWMsQ0FBQztnREFDQztJQTJEekI7UUFEQyxlQUFLO2tEQUdMO0lBR0Q7UUFEQyxlQUFLO3FEQUtMO0lBdkVGLGtDQXdFQyJ9