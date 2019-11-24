import ResolvablePromise, { IReject, IResolve } from "utilities/promise/ResolvablePromise";
export default class CancelablePromise<T = void> extends ResolvablePromise<T | undefined> {
    private _cancelled;
    get cancelled(): boolean;
    private cancelCallbacks;
    constructor(executor?: (resolve: IResolve<T>, reject: IReject) => void);
    cancel(): void;
    onCancel(callback: () => void): this;
}
