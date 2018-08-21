import ResolvablePromise, { IReject, IResolve } from "utilities/promise/ResolvablePromise";

export default class CancelablePromise<T = void> extends ResolvablePromise<T | undefined> {
	private _cancelled = false;
	public get cancelled() { return this._cancelled; }

	private cancelCallbacks: Array<() => void> = [];

	public constructor(executor?: (resolve: IResolve<T>, reject: IReject) => void) {
		super(executor);

		const oldResolve = this.resolve;
		(this as any).resolve = (val: T) => {
			oldResolve(this._cancelled ? undefined : val);
		};
	}

	public cancel() {
		this._cancelled = true;
		for (const callback of this.cancelCallbacks) callback();
		this.resolve(undefined);
	}

	public onCancel(callback: () => void) {
		if (this._cancelled) callback();
		else this.cancelCallbacks.push(callback);
		return this;
	}
}
