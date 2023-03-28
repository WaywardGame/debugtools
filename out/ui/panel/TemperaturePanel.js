var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "language/Translation", "mod/Mod", "ui/component/ChoiceList", "ui/component/Divider", "ui/component/LabelledRow", "ui/component/Text", "../../IDebugTools", "../../overlay/TemperatureOverlay", "../component/DebugToolsPanel"], function (require, exports, EventBuses_1, EventManager_1, Translation_1, Mod_1, ChoiceList_1, Divider_1, LabelledRow_1, Text_1, IDebugTools_1, TemperatureOverlay_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TemperaturePanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureBiome)
                .passTo(Translation_1.default.colorizeImportance("secondary"))))
                .append(new Text_1.default().setText(Translation_1.default.colorizeImportance("primary")
                .addArgs(() => localIsland.temperature.getBiomeBase())))
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureBiomeTimeModifier)
                .passTo(Translation_1.default.colorizeImportance("secondary"))))
                .append(this.biomeTimeModifier = new Text_1.default().setText(Translation_1.default.colorizeImportance("primary")
                .addArgs(() => localIsland.temperature.getBiomeTimeModifier())))
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureLayerModifier)
                .passTo(Translation_1.default.colorizeImportance("secondary"))))
                .append(new Text_1.default().setText(Translation_1.default.colorizeImportance("primary")
                .addArgs(() => localIsland.temperature.getLayerBase(localPlayer.z))))
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureLayerTimeModifier)
                .passTo(Translation_1.default.colorizeImportance("secondary"))))
                .append(this.layerTimeModifier = new Text_1.default().setText(Translation_1.default.colorizeImportance("primary")
                .addArgs(() => localIsland.temperature.getLayerTimeModifier(localPlayer.z))))
                .appendTo(this);
            new Divider_1.default()
                .appendTo(this);
            new Text_1.Heading()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.HeadingTemperatureOverlay))
                .appendTo(this);
            let defaultMode;
            new ChoiceList_1.default()
                .setChoices(defaultMode = new ChoiceList_1.Choice(TemperatureOverlay_1.TemperatureOverlayMode.None)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.None)), new ChoiceList_1.Choice(TemperatureOverlay_1.TemperatureOverlayMode.Produced)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.TemperatureOverlayModeProduced)), new ChoiceList_1.Choice(TemperatureOverlay_1.TemperatureOverlayMode.Calculated)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.TemperatureOverlayModeCalculated)))
                .setRefreshMethod(list => list.choices(choice => choice.id === this.DEBUG_TOOLS.temperatureOverlay.getMode()).first() ?? defaultMode)
                .event.subscribe("choose", (_, choice) => this.DEBUG_TOOLS.temperatureOverlay.setMode(choice.id))
                .appendTo(this);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelTemperature;
        }
        onChangeArea() {
            ui.refreshTranslations(this);
        }
        onTime() {
            this.biomeTimeModifier.refresh();
            this.layerTimeModifier.refresh();
        }
    }
    __decorate([
        Mod_1.default.instance("Debug Tools")
    ], TemperaturePanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.saveData("Debug Tools")
    ], TemperaturePanel.prototype, "saveData", void 0);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "changeZ"),
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "moveToIsland")
    ], TemperaturePanel.prototype, "onChangeArea", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Island, "tickEnd")
    ], TemperaturePanel.prototype, "onTime", null);
    exports.default = TemperaturePanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9UZW1wZXJhdHVyZVBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWVBLE1BQXFCLGdCQUFpQixTQUFRLHlCQUFlO1FBVzVEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsMEJBQTBCLENBQUM7aUJBQzVGLE1BQU0sQ0FBQyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEQsTUFBTSxDQUFDLElBQUksY0FBSSxFQUFFLENBQUMsT0FBTyxDQUFDLHFCQUFXLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDO2lCQUNsRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3hELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsc0NBQXNDLENBQUM7aUJBQ3hHLE1BQU0sQ0FBQyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztpQkFDM0YsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxX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