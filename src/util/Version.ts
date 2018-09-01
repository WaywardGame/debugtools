import Log, { LogSource } from "utilities/Log";

type VersionMappable = string | Version | [number, number, number?];

export default class Version {
	private readonly version: [number, number, number?];

	public get major() {
		return this.version[0];
	}

	public get minor() {
		return this.version[1];
	}

	public get patch() {
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
				Log.warn(LogSource.Mod, "DebugTools", "Version")(`Invalid version string ${version}`);
				this.version = [0, 0, 0];
			}
		}
	}

	public getString() {
		return this.version.join(".");
	}

	public isNewerThan(version: VersionMappable) {
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

	public isOlderThan(version: VersionMappable) {
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

	public isSameVersion(version: VersionMappable) {
		const compareVersion = new Version(version);
		for (let i = 0; i < this.version.length; i++) {
			if (this.version[i] !== compareVersion.version[i]) {
				return false;
			}
		}

		return true;
	}
}
