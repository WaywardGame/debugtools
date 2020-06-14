var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/component/Button", "newui/component/Component", "newui/component/Text", "../../action/AddItemToInventory", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/AddItemToInventory", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, Dictionaries_1, Translation_1, Mod_1, Button_1, Component_1, Text_1, AddItemToInventory_1, Remove_1, IDebugTools_1, Array_1, AddItemToInventory_2, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let ItemInformation = (() => {
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
        return ItemInformation;
    })();
    exports.default = ItemInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0l0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBcUJBO1FBQUEsTUFBcUIsZUFBZ0IsU0FBUSxtQ0FBeUI7WUFXckU7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBSkQsVUFBSyxHQUFXLEVBQUUsQ0FBQztnQkFNMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLG1CQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxtQkFBUyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BELENBQUM7WUFFZ0IsT0FBTztnQkFDdkIsT0FBTztvQkFDTixDQUFDLENBQUMsRUFBRSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUNwRCxDQUFDO1lBQ0gsQ0FBQztZQUVnQixNQUFNO2dCQUN0QixNQUFNLGtCQUFrQixHQUFHLDRCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzVGLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUM7cUJBQzFELFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVyQyxPQUFPLElBQUksQ0FBQztZQUNiLENBQUM7WUFFZ0IsTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztnQkFDdEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Z0JBQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLDBCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUFFLE9BQU87Z0JBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUV6QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO29CQUFFLE9BQU87Z0JBRS9CLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFFcEIsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUM5QixJQUFJLGdCQUFTLEVBQUU7eUJBQ2IsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsUUFBUSxDQUFDO3lCQUN4RCxHQUFHLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMseUJBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyx5QkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7eUJBQ25GLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBRTlCLElBQUksZ0JBQU0sRUFBRTt5QkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQzt5QkFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDbEQsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDOUI7WUFDRixDQUFDO1lBRWdCLFNBQVM7Z0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckMsQ0FBQztZQUdPLE9BQU8sQ0FBQyxDQUFNLEVBQUUsSUFBYyxFQUFFLE9BQWdCO2dCQUN2RCx3QkFBYyxDQUFDLEdBQUcsQ0FBQyw0QkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDM0osQ0FBQztZQUdPLFVBQVUsQ0FBQyxJQUFVO2dCQUM1QixPQUFPLEdBQUcsRUFBRTtvQkFDWCx3QkFBYyxDQUFDLEdBQUcsQ0FBQyxnQkFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkQsQ0FBQyxDQUFDO1lBQ0gsQ0FBQztTQUNEO1FBckVBO1lBREMsYUFBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBYyxDQUFDO29EQUNDO1FBZWY7WUFBVCxRQUFRO3NEQUlSO1FBRVM7WUFBVCxRQUFRO3FEQU1SO1FBRVM7WUFBVCxRQUFRO3FEQXVCUjtRQUVTO1lBQVQsUUFBUTt3REFFUjtRQUdEO1lBREMsS0FBSztzREFHTDtRQUdEO1lBREMsS0FBSzt5REFLTDtRQUNGLHNCQUFDO1NBQUE7c0JBeEVvQixlQUFlIn0=