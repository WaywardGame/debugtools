/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Log from "@wayward/utilities/Log";

type VersionMappable = string | Version | [number, number, number?];

export default class Version {
	private readonly version: [number, number, number?];

	public get major(): number {
		return this.version[0];
	}

	public get minor(): number {
		return this.version[1];
	}

	public get patch(): number | undefined {
		return this.version[2];
	}

	public constructor(version: VersionMappable) {
		if (version instanceof Version) {
			version = version.version;
		}

		if (Array.isArray(version)) {
			this.version = [...version] as [number, number, number?];

		} else {
			try {
				const [, ...match] = version.match(/^(\d+)\.(\d+)(?:\.(\d+))?$/)!;
				this.version = match.filter(v => v !== undefined)
					.map(v => +v) as [number, number, number?];

			} catch (e) {
				Log.warn("Mod", "DebugTools", "Version")(`Invalid version string ${version}`);
				this.version = [0, 0, 0];
			}
		}
	}

	public getString(): string {
		return this.version.join(".");
	}

	public isNewerThan(version: VersionMappable): boolean {
		const compareVersion = new Version(version);
		for (let i = 0; i < this.version.length; i++) {
			const a = this.version[i]!;
			const b = compareVersion.version[i]!;
			if (a === b) {
				continue;
			}

			return a > b;
		}

		return false;
	}

	public isOlderThan(version: VersionMappable): boolean {
		const compareVersion = new Version(version);
		for (let i = 0; i < this.version.length; i++) {
			const a = this.version[i]!;
			const b = compareVersion.version[i]!;
			if (a === b) {
				continue;
			}

			return a < b;
		}

		return false;
	}

	public isSameVersion(version: VersionMappable): boolean {
		const compareVersion = new Version(version);
		for (let i = 0; i < this.version.length; i++) {
			if (this.version[i] !== compareVersion.version[i]) {
				return false;
			}
		}

		return true;
	}
}
