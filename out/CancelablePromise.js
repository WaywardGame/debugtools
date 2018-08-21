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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FuY2VsYWJsZVByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQ2FuY2VsYWJsZVByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBRUEsTUFBcUIsaUJBQTRCLFNBQVEsMkJBQWdDO1FBTXhGLFlBQW1CLFFBQTBEO1lBQzVFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQU5ULGVBQVUsR0FBRyxLQUFLLENBQUM7WUFHbkIsb0JBQWUsR0FBc0IsRUFBRSxDQUFDO1lBSy9DLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDL0IsSUFBWSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQU0sRUFBRSxFQUFFO2dCQUNsQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUM7UUFDSCxDQUFDO1FBWEQsSUFBVyxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQWEzQyxNQUFNO1lBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZTtnQkFBRSxRQUFRLEVBQUUsQ0FBQztZQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFFTSxRQUFRLENBQUMsUUFBb0I7WUFDbkMsSUFBSSxJQUFJLENBQUMsVUFBVTtnQkFBRSxRQUFRLEVBQUUsQ0FBQzs7Z0JBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztLQUNEO0lBMUJELG9DQTBCQyJ9