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
define(["require", "exports", "utilities/promise/ResolvablePromise"], function (require, exports, ResolvablePromise_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CancelablePromise extends ResolvablePromise_1.default {
        get cancelled() { return this._cancelled; }
        constructor(executor) {
            super(executor);
            this._cancelled = false;
            this.cancelCallbacks = [];
            const oldResolve = this.resolve;
            this.resolve = (val) => {
                oldResolve(this._cancelled ? undefined : val);
            };
        }
        cancel() {
            this._cancelled = true;
            for (const callback of this.cancelCallbacks)
                callback();
            this.resolve(undefined);
        }
        onCancel(callback) {
            if (this._cancelled)
                callback();
            else
                this.cancelCallbacks.push(callback);
            return this;
        }
    }
    exports.default = CancelablePromise;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FuY2VsYWJsZVByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9DYW5jZWxhYmxlUHJvbWlzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFJSCxNQUFxQixpQkFBNEIsU0FBUSwyQkFBZ0M7UUFFeEYsSUFBVyxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUlsRCxZQUFtQixRQUEwRDtZQUM1RSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFOVCxlQUFVLEdBQUcsS0FBSyxDQUFDO1lBR25CLG9CQUFlLEdBQW1CLEVBQUUsQ0FBQztZQUs1QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQy9CLElBQVksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFNLEVBQUUsRUFBRTtnQkFDbEMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDO1FBQ0gsQ0FBQztRQUVNLE1BQU07WUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxlQUFlO2dCQUFFLFFBQVEsRUFBRSxDQUFDO1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUVNLFFBQVEsQ0FBQyxRQUFvQjtZQUNuQyxJQUFJLElBQUksQ0FBQyxVQUFVO2dCQUFFLFFBQVEsRUFBRSxDQUFDOztnQkFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO0tBQ0Q7SUExQkQsb0NBMEJDIn0=