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
type VersionMappable = string | Version | [number, number, number?];
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
