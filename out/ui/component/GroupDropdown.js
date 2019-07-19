var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "newui/component/Component", "newui/component/Dropdown", "newui/component/IComponent", "newui/component/Text", "newui/INewUi", "newui/NewUi", "newui/tooltip/Tooltip", "utilities/Arrays", "utilities/Async", "utilities/map/StackMap", "utilities/stream/Stream"], function (require, exports, EventManager_1, Component_1, Dropdown_1, IComponent_1, Text_1, INewUi_1, NewUi_1, Tooltip_1, Arrays_1, Async_1, StackMap_1, Stream_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const REGEX_GROUP = /^group:(.*)$/;
    const REGEX_GROUP_END = /(^| )group:([^\s]*)$/;
    class GroupDropdown extends Dropdown_1.default {
        constructor() {
            super();
            this.wordToGroups = new StackMap_1.default(undefined, 100);
            this.retainLastFilter();
        }
        optionMatchesFilterWord(word, option, text) {
            if (super.optionMatchesFilterWord(word, option, text)) {
                return true;
            }
            const groups = this.wordToGroups.getOrDefault(word, () => {
                const [, groupName] = word.match(REGEX_GROUP) || Arrays_1.default.EMPTY;
                return !groupName ? [] : this.getGroupMap().entryStream()
                    .filter(([name]) => name.startsWith(groupName))
                    .toArray(([, data]) => data);
            }, true);
            return groups.length ? groups.some(([group]) => this.isInGroup(option, group)) : false;
        }
        isMouseWithin(api) {
            return super.isMouseWithin(api) || (!!this.tooltip && api.isMouseWithin(this.tooltip));
        }
        onOpen() {
            this.updateTooltip()
                .setLocation(this.openedDirection() === INewUi_1.SelectDirection.Up ? IComponent_1.TooltipLocation.BottomRight : IComponent_1.TooltipLocation.TopRight)
                .show();
        }
        onClose() {
            if (this.tooltip) {
                this.tooltip.hide();
            }
        }
        onFilterChange() {
            this.updateTooltip();
        }
        updateTooltip() {
            const tooltip = this.getTooltip();
            const inputText = this.inputButton.getInputText();
            let currentGroupText = "";
            const lastGroupMatch = inputText.match(REGEX_GROUP_END);
            if (lastGroupMatch) {
                currentGroupText = lastGroupMatch[2];
            }
            if (currentGroupText === this.lastGroupText) {
                return tooltip;
            }
            this.lastGroupText = currentGroupText;
            for (const [group, [, component]] of this.getGroupMap().entries()) {
                component.toggle(group.startsWith(currentGroupText));
            }
            return tooltip;
        }
        onRegenerateBox() {
            super.onRegenerateBox();
            const tooltip = this.getTooltip();
            if (tooltip) {
                tooltip.style.set("max-height", `calc(50vh - ${this.getStyle("--block-height")})`);
            }
        }
        getTooltip() {
            if (!this.tooltip) {
                this.tooltip = new GroupDropdownTooltip(this.inputButton)
                    .append(...this.getGroupMap()
                    .entryStream()
                    .sorted(([a], [b]) => a.localeCompare(b))
                    .map(([group, data]) => data[1] = new Text_1.Paragraph()
                    .listen("mousedown", () => this.addGroup(group))
                    .setText(() => [{ content: `group:${group}` }])))
                    .event.subscribe("willRemove", c => c.store() && false)
                    .appendTo(NewUi_1.default.tooltips.tooltipWrapper);
            }
            return this.tooltip;
        }
        getGroupMap() {
            return this.groups = this.groups || Stream_1.default.from(this.getGroups())
                .map(group => Arrays_1.tuple(this.getGroupName(group).toLowerCase().replace(/\s*/g, ""), Arrays_1.tuple(group)))
                .filter(([group]) => group)
                .toMap();
        }
        addGroup(group) {
            const inputText = this.inputButton.getInputText();
            let currentGroupText = "";
            const lastGroupMatch = inputText.match(REGEX_GROUP_END);
            if (lastGroupMatch) {
                currentGroupText = lastGroupMatch[2];
            }
            if (currentGroupText && group.startsWith(currentGroupText))
                this.inputButton.setInputText(`${inputText.slice(0, currentGroupText.length * -1)}group:${group} `);
            else
                this.inputButton.setInputText(`${inputText}${inputText.length && !inputText.endsWith(" ") ? " " : ""}group:${group} `);
            this.inputButton.focus();
        }
    }
    __decorate([
        Override
    ], GroupDropdown.prototype, "optionMatchesFilterWord", null);
    __decorate([
        Override
    ], GroupDropdown.prototype, "isMouseWithin", null);
    __decorate([
        EventManager_1.EventHandler("self")("open")
    ], GroupDropdown.prototype, "onOpen", null);
    __decorate([
        EventManager_1.EventHandler("self")("close")
    ], GroupDropdown.prototype, "onClose", null);
    __decorate([
        EventManager_1.EventHandler("self")("filterChange")
    ], GroupDropdown.prototype, "onFilterChange", null);
    __decorate([
        Bound
    ], GroupDropdown.prototype, "updateTooltip", null);
    __decorate([
        Bound, Override
    ], GroupDropdown.prototype, "onRegenerateBox", null);
    exports.default = GroupDropdown;
    class GroupDropdownTooltip extends Tooltip_1.default {
        constructor(source) {
            super(source);
            this.classes.add("debug-tools-group-dropdown-tooltip");
            this.setForceShown();
        }
        updatePosition(position, force) {
            super.updatePosition(position, force);
            const dropdown = Component_1.default.get(this.source.closest(".menu-dropdown"));
            const sourceBox = this.source.getBox();
            const tooltipBox = this.getBox();
            if (sourceBox.right + tooltipBox.width + 20 > NewUi_1.default.windowWidth) {
                this.setLocation(dropdown.openedDirection() === INewUi_1.SelectDirection.Up ? IComponent_1.TooltipLocation.BottomLeft : IComponent_1.TooltipLocation.TopLeft);
            }
            else {
                this.setLocation(dropdown.openedDirection() === INewUi_1.SelectDirection.Up ? IComponent_1.TooltipLocation.BottomRight : IComponent_1.TooltipLocation.TopRight);
            }
            return this;
        }
        onShow() {
            this.updatePosition();
            (async () => {
                await Async_1.sleep(20);
                this.updatePosition();
                this.classes.remove("hidden");
            })();
        }
    }
    __decorate([
        Override
    ], GroupDropdownTooltip.prototype, "updatePosition", null);
    __decorate([
        Override
    ], GroupDropdownTooltip.prototype, "onShow", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBEcm9wZG93bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9jb21wb25lbnQvR3JvdXBEcm9wZG93bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFlQSxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUM7SUFDbkMsTUFBTSxlQUFlLEdBQUcsc0JBQXNCLENBQUM7SUFFL0MsTUFBOEIsYUFBMkQsU0FBUSxrQkFBVztRQU8zRztZQUNDLEtBQUssRUFBRSxDQUFDO1lBSFEsaUJBQVksR0FBRyxJQUFJLGtCQUFRLENBQXdCLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUluRixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBTW1CLHVCQUF1QixDQUFDLElBQVksRUFBRSxNQUFTLEVBQUUsSUFBWTtZQUNoRixJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUN0RCxPQUFPLElBQUksQ0FBQzthQUNaO1lBU0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtnQkFDeEQsTUFBTSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxnQkFBTSxDQUFDLEtBQUssQ0FBQztnQkFFOUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsV0FBVyxFQUFFO3FCQUN2RCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUM5QyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFD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