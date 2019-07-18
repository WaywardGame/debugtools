var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Dropdown", "utilities/Arrays", "utilities/stream/Stream"], function (require, exports, Dropdown_1, Arrays_1, Stream_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const REGEX_GROUP = /^group:(.*)$/;
    class GroupDropdown extends Dropdown_1.default {
        optionMatchesFilterWord(word, option, text) {
            if (super.optionMatchesFilterWord(word, option, text)) {
                return true;
            }
            const [, groupName] = word.match(REGEX_GROUP) || Arrays_1.default.EMPTY;
            const group = this.getGroupMap().get(groupName);
            if (!group) {
                return false;
            }
            return this.isInGroup(option, group);
        }
        getGroupMap() {
            return this.groups = this.groups || Stream_1.default.from(this.getGroups())
                .map(group => Arrays_1.tuple(this.getGroupName(group).toLowerCase().replace(/\s*/g, ""), group))
                .toMap();
        }
    }
    __decorate([
        Override
    ], GroupDropdown.prototype, "optionMatchesFilterWord", null);
    exports.default = GroupDropdown;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBEcm9wZG93bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9jb21wb25lbnQvR3JvdXBEcm9wZG93bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFJQSxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUM7SUFFbkMsTUFBOEIsYUFBMkQsU0FBUSxrQkFBVztRQUl2Rix1QkFBdUIsQ0FBQyxJQUFZLEVBQUUsTUFBUyxFQUFFLElBQVk7WUFDaEYsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDdEQsT0FBTyxJQUFJLENBQUM7YUFDWjtZQUVELE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksZ0JBQU0sQ0FBQyxLQUFLLENBQUM7WUFDOUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNYLE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFNTyxXQUFXO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDL0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDdEYsS0FBSyxFQUFFLENBQUM7UUFDWCxDQUFDO0tBQ0Q7SUF2QlU7UUFBVCxRQUFRO2dFQVlSO0lBaEJGLGdDQTJCQyJ9