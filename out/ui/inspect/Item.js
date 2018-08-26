var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/IComponent", "newui/component/Text", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../../util/Array", "../component/AddItemToInventory", "../component/InspectInformationSection"], function (require, exports, Enums_1, Translation_1, Button_1, Component_1, IComponent_1, Text_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, Array_1, AddItemToInventory_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ItemInformation extends InspectInformationSection_1.default {
        constructor(api) {
            super(api);
            this.items = [];
            this.wrapperItems = new Component_1.default(this.api).appendTo(this);
        }
        getTabs() {
            return [
                [0, DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TabItemStack)],
            ];
        }
        setTab() {
            const addItemToInventory = AddItemToInventory_1.default.get(this.api).appendTo(this);
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
                    .setText(() => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ItemName)
                    .get(Translation_1.default.ofObjectName(item, Enums_1.SentenceCaseStyle.Title, true)))
                    .appendTo(this.wrapperItems);
                new Button_1.default(this.api)
                    .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                    .on(Button_1.ButtonEvent.Activate, this.removeItem(item))
                    .appendTo(this.wrapperItems);
            }
        }
        logUpdate() {
            DebugTools_1.default.LOG.info("Items:", this.items);
        }
        addItem(_, type, quality) {
            Actions_1.default.get("addItemToInventory")
                .execute({ point: this.position, object: [type, quality] });
        }
        removeItem(item) {
            return () => {
                Actions_1.default.get("removeItem").execute({ item });
            };
        }
    }
    __decorate([
        Objects_1.Bound
    ], ItemInformation.prototype, "addItem", null);
    __decorate([
        Objects_1.Bound
    ], ItemInformation.prototype, "removeItem", null);
    exports.default = ItemInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0l0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBa0JBLE1BQXFCLGVBQWdCLFNBQVEsbUNBQXlCO1FBTXJFLFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBSkosVUFBSyxHQUFZLEVBQUUsQ0FBQztZQU0zQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksbUJBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTztnQkFDTixDQUFDLENBQUMsRUFBRSx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3BELENBQUM7UUFDSCxDQUFDO1FBRU0sTUFBTTtZQUNaLE1BQU0sa0JBQWtCLEdBQUcsNEJBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0UsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBYyxDQUFDLFVBQVUsQ0FBQztpQkFDbkMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLDRDQUF1QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUUsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRU0sTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztZQUM1QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUU3QyxJQUFJLDBCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUFFLE9BQU87WUFDbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUV6QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO2dCQUFFLE9BQU87WUFFL0IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXBCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDOUIsSUFBSSxnQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBQ3JCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLFFBQVEsQ0FBQztxQkFDeEQsR0FBRyxDQUFDLHFCQUFXLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSx5QkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDcEUsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFOUIsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBQ2xCLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUN4RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUM5QjtRQUNGLENBQUM7UUFFTSxTQUFTO1lBQ2Ysb0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUdPLE9BQU8sQ0FBQyxDQUFNLEVBQUUsSUFBYyxFQUFFLE9BQW9CO1lBQzNELGlCQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDO2lCQUMvQixPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFHTyxVQUFVLENBQUMsSUFBVztZQUM3QixPQUFPLEdBQUcsRUFBRTtnQkFDWCxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQztRQUNILENBQUM7S0FDRDtJQVhBO1FBREMsZUFBSztrREFJTDtJQUdEO1FBREMsZUFBSztxREFLTDtJQWxFRixrQ0FtRUMifQ==