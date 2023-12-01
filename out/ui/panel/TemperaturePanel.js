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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/game/event/EventBuses", "@wayward/game/event/EventManager", "@wayward/game/language/Translation", "@wayward/game/mod/Mod", "@wayward/game/ui/component/ChoiceList", "@wayward/game/ui/component/Divider", "@wayward/game/ui/component/LabelledRow", "@wayward/game/ui/component/Text", "../../IDebugTools", "../../overlay/TemperatureOverlay", "../component/DebugToolsPanel"], function (require, exports, EventBuses_1, EventManager_1, Translation_1, Mod_1, ChoiceList_1, Divider_1, LabelledRow_1, Text_1, IDebugTools_1, TemperatureOverlay_1, DebugToolsPanel_1) {
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
    exports.default = TemperaturePanel;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9UZW1wZXJhdHVyZVBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7OztJQWlCSCxNQUFxQixnQkFBaUIsU0FBUSx5QkFBZTtRQVc1RDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBRVIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLDBCQUEwQixDQUFDO2lCQUM1RixNQUFNLENBQUMscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RELE1BQU0sQ0FBQyxJQUFJLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztpQkFDbEUsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN4RCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLHNDQUFzQyxDQUFDO2lCQUN4RyxNQUFNLENBQUMscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxjQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7aUJBQzNGLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNoRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGtDQUFrQyxDQUFDO2lCQUNwRyxNQUFNLENBQUMscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RELE1BQU0sQ0FBQyxJQUFJLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztpQkFDbEUsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3JFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsc0NBQXNDLENBQUM7aUJBQ3hHLE1BQU0sQ0FBQyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztpQkFDM0YsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDN0UsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksaUJBQU8sRUFBRTtpQkFDWCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxjQUFPLEVBQUU7aUJBQ1gsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2lCQUNyRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxXQUEyQyxDQUFDO1lBQ2hELElBQUksb0JBQVUsRUFBa0M7aUJBQzlDLFVBQVUsQ0FDVixXQUFXLEdBQUcsSUFBSSxtQkFBTSxDQUFDLDJDQUFzQixDQUFDLElBQUksQ0FBQztpQkFDbkQsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUNsRCxJQUFJLG1CQUFNLENBQUMsMkNBQXNCLENBQUMsUUFBUSxDQUFDO2lCQUN6QyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLDhCQUE4QixDQUFDLENBQUMsRUFDNUUsSUFBSSxtQkFBTSxDQUFDLDJDQUFzQixDQUFDLFVBQVUsQ0FBQztpQkFDM0MsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUM7aUJBQy9FLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLFdBQVcsQ0FBQztpQkFDcEksS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ2hHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRWUsY0FBYztZQUM3QixPQUFPLG1DQUFxQixDQUFDLGdCQUFnQixDQUFDO1FBQy9DLENBQUM7UUFJUyxZQUFZO1lBQ3JCLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBR1MsTUFBTTtZQUNmLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEMsQ0FBQztLQUVEO0lBL0VELG1DQStFQztJQTVFZ0I7UUFEZixhQUFHLENBQUMsUUFBUSxDQUFhLGFBQWEsQ0FBQzt5REFDQTtJQUdqQztRQUROLGFBQUcsQ0FBQyxRQUFRLENBQWEsYUFBYSxDQUFDO3NEQUNiO0lBK0RqQjtRQUZULElBQUEsMkJBQVksRUFBQyxxQkFBUSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUM7UUFDN0MsSUFBQSwyQkFBWSxFQUFDLHFCQUFRLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQzt3REFHbEQ7SUFHUztRQURULElBQUEsMkJBQVksRUFBQyxxQkFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7a0RBSXhDIn0=