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
define(["require", "exports", "ui/screen/screens/game/component/TabDialogPanel"], function (require, exports, TabDialogPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InspectInformationSection extends TabDialogPanel_1.default {
        constructor() {
            super(...arguments);
            this.shouldLog = false;
        }
        get willLog() { return this.shouldLog; }
        setTab(tab) { return this; }
        setShouldLog() { this.shouldLog = true; }
        resetWillLog() { this.shouldLog = false; }
    }
    exports.default = InspectInformationSection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9jb21wb25lbnQvSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFpQkgsTUFBOEIseUJBQTBCLFNBQVEsd0JBQWM7UUFBOUU7O1lBR1MsY0FBUyxHQUFHLEtBQUssQ0FBQztRQVUzQixDQUFDO1FBVEEsSUFBVyxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUV4QyxNQUFNLENBQUMsR0FBVyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQyxZQUFZLEtBQUssSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLFlBQVksS0FBSyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FLakQ7SUFiRCw0Q0FhQyJ9