define(["require", "exports", "utilities/promise/ResolvablePromise"], function (require, exports, ResolvablePromise_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CancelablePromise extends ResolvablePromise_1.default {
        constructor(executor) {
            super(executor);
            this._cancelled = false;
            this.cancelCallbacks = [];
            const oldResolve = this.resolve;
            this.resolve = (val) => {
                oldResolve(this._cancelled ? undefined : val);
            };
        }
        get cancelled() { return this._cancelled; }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FuY2VsYWJsZVByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9DYW5jZWxhYmxlUHJvbWlzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFFQSxNQUFxQixpQkFBNEIsU0FBUSwyQkFBZ0M7UUFNeEYsWUFBbUIsUUFBMEQ7WUFDNUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBTlQsZUFBVSxHQUFHLEtBQUssQ0FBQztZQUduQixvQkFBZSxHQUFzQixFQUFFLENBQUM7WUFLL0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUMvQixJQUFZLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBTSxFQUFFLEVBQUU7Z0JBQ2xDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQztRQUNILENBQUM7UUFYRCxJQUFXLFNBQVMsS0FBSyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBYTNDLE1BQU07WUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxlQUFlO2dCQUFFLFFBQVEsRUFBRSxDQUFDO1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUVNLFFBQVEsQ0FBQyxRQUFvQjtZQUNuQyxJQUFJLElBQUksQ0FBQyxVQUFVO2dCQUFFLFFBQVEsRUFBRSxDQUFDOztnQkFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO0tBQ0Q7SUExQkQsb0NBMEJDIn0=