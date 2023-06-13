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

import ResolvablePromise, { IReject, IResolve } from "utilities/promise/ResolvablePromise";

export default class CancelablePromise<T = void> extends ResolvablePromise<T | undefined> {
	private _cancelled = false;
	public get cancelled() { return this._cancelled; }

	private cancelCallbacks: (() => void)[] = [];

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
