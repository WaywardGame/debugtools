declare type VersionMappable = string | Version | [number, number, number?];
export default class Version {
    private readonly version;
    get major(): number;
    get minor(): number;
    get patch(): number | undefined;
    constructor(version: VersionMappable);
    getString(): string;
    isNewerThan(version: VersionMappable): boolean;
    isOlderThan(version: VersionMappable): boolean;
    isSameVersion(version: VersionMappable): boolean;
}
export {};
