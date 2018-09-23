var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/component/Button", "newui/component/Component", "newui/component/IComponent", "newui/component/Text", "utilities/Objects", "../../Actions", "../../IDebugTools", "../../util/Array", "../component/AddItemToInventory", "../component/InspectInformationSection"], function (require, exports, Dictionaries_1, Translation_1, Mod_1, Button_1, Component_1, IComponent_1, Text_1, Objects_1, Actions_1, IDebugTools_1, Array_1, AddItemToInventory_1, InspectInformationSection_1) {
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
            const addItemToInventory = AddItemToInventory_1.default.get(this.api).appendTo(this.wrapperAddItem);
            this.until(IComponent_1.ComponentEvent.WillRemove)
                .bind(addItemToInventory, AddItemToInventory_1.AddItemToInventoryEvent.Execute, this.addItem);
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
            Actions_1.default.get("addItemToInventory")
                .execute({ point: this.position, object: [type, quality] });
        }
        removeItem(item) {
            return () => {
                Actions_1.default.get("remove").execute({ item });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0l0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBb0JBLE1BQXFCLGVBQWdCLFNBQVEsbUNBQXlCO1FBV3JFLFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUpOLFVBQUssR0FBWSxFQUFFLENBQUM7WUFNM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLG1CQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksbUJBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTztnQkFDTixDQUFDLENBQUMsRUFBRSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3BELENBQUM7UUFDSCxDQUFDO1FBRU0sTUFBTTtZQUNaLE1BQU0sa0JBQWtCLEdBQUcsNEJBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzFGLElBQUksQ0FBQyxLQUFLLENBQUMsMkJBQWMsQ0FBQyxVQUFVLENBQUM7aUJBQ25DLElBQUksQ0FBQyxrQkFBa0IsRUFBRSw0Q0FBdUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTFFLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDLENBQUM7WUFFN0MsSUFBSSwwQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFBRSxPQUFPO1lBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRS9CLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQzlCLElBQUksZ0JBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO3FCQUNyQixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxRQUFRLENBQUM7cUJBQ3hELEdBQUcsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyx5QkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFtQixDQUFDLENBQUM7cUJBQ25GLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRTlCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO3FCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztxQkFDeEQsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQy9DLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDOUI7UUFDRixDQUFDO1FBRU0sU0FBUztZQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUdPLE9BQU8sQ0FBQyxDQUFNLEVBQUUsSUFBYyxFQUFFLE9BQW9CO1lBQzNELGlCQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDO2lCQUMvQixPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFHTyxVQUFVLENBQUMsSUFBVztZQUM3QixPQUFPLEdBQUcsRUFBRTtnQkFDWCxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQztRQUNILENBQUM7S0FDRDtJQXRFQTtRQURDLGFBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQWMsQ0FBQztnREFDQztJQTJEekI7UUFEQyxlQUFLO2tEQUlMO0lBR0Q7UUFEQyxlQUFLO3FEQUtMO0lBeEVGLGtDQXlFQyJ9