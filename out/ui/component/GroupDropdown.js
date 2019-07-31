var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "newui/component/Component", "newui/component/Dropdown", "newui/component/IComponent", "newui/component/Text", "newui/INewUi", "newui/NewUi", "newui/tooltip/Tooltip", "utilities/Arrays", "utilities/Async", "utilities/Log", "utilities/map/StackMap", "utilities/stream/Stream"], function (require, exports, EventManager_1, Component_1, Dropdown_1, IComponent_1, Text_1, INewUi_1, NewUi_1, Tooltip_1, Arrays_1, Async_1, Log_1, StackMap_1, Stream_1) {
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
                Log_1.default.warn("DebugTools", Log_1.LogSource.NewUi, Log_1.LogSource.Reflow)("GroupDropdown.onRegenerateBox() getComputedStyle", this);
                const style = getComputedStyle(this.element);
                tooltip.style.set("max-height", `calc(50vh - ${style.getPropertyValue("--block-height")})`);
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
                .map(group => Arrays_1.Tuple(this.getGroupName(group).toLowerCase().replace(/\s*/g, ""), Arrays_1.Tuple(group)))
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
            Log_1.default.warn(Log_1.LogSource.NewUi, Log_1.LogSource.Reflow)("GroupDropdown.focus() focus", this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBEcm9wZG93bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9jb21wb25lbnQvR3JvdXBEcm9wZG93bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFnQkEsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDO0lBQ25DLE1BQU0sZUFBZSxHQUFHLHNCQUFzQixDQUFDO0lBRS9DLE1BQThCLGFBQTJELFNBQVEsa0JBQVc7UUFPM0c7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUhRLGlCQUFZLEdBQUcsSUFBSSxrQkFBUSxDQUF3QixTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFJbkYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDekIsQ0FBQztRQU1tQix1QkFBdUIsQ0FBQyxJQUFZLEVBQUUsTUFBUyxFQUFFLElBQVk7WUFDaEYsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDdEQsT0FBTyxJQUFJLENBQUM7YUFDWjtZQVNELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7Z0JBQ3hELE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksZ0JBQU0sQ0FBQyxLQUFLLENBQUM7Z0JBRTlELE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFdBQVcsRUFBRTtxQkFDdkQsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDOUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FB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