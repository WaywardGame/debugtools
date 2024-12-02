export function areArraysIdentical(arr1: any[], ...arrs: any[][]): boolean {
	arrs.unshift(arr1);
	// first check that the lengths of all arrays are the same
	for (let i = 0; i < arrs.length - 1; i++) {
		if (arrs[i].length !== arrs[i + 1].length) {
			return false;
		}
	}

	// then check if any items differ
	for (let i = 0; i < arrs.length - 1; i++) {
		if (arrs[i].length !== arrs[i + 1].length) {
			return false;
		}

		for (const item of arrs[i]) {
			if (!arrs[i + 1].includes(item)) {
				return false;
			}
		}
	}

	return true;
}
