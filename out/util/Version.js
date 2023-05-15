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
define(["require", "exports", "utilities/Log"], function (require, exports, Log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Version {
        get major() {
            return this.version[0];
        }
        get minor() {
            return this.version[1];
        }
        get patch() {
            return this.version[2];
        }
        constructor(version) {
            if (version instanceof Version) {
                version = version.version;
            }
            if (Array.isArray(version)) {
                this.version = [...version];
            }
            else {
                try {
                    const [, ...match] = version.match(/^(\d+)\.(\d+)(?:\.(\d+))?$/);
                    this.version = match.filter(v => v !== undefined)
                        .map(v => +v);
                }
                catch (e) {
                    Log_1.default.warn(Log_1.LogSource.Mod, "DebugTools", "Version")(`Invalid version string ${version}`);
                    this.version = [0, 0, 0];
                }
            }
        }
        getString() {
            return this.version.join(".");
        }
        isNewerThan(version) {
            const compareVersion = new Version(version);
            for (let i = 0; i < this.version.length; i++) {
                const a = this.version[i];
                const b = compareVersion.version[i];
                if (a === b) {
                    continue;
                }
                return a > b;
            }
            return false;
        }
        isOlderThan(version) {
            const compareVersion = new Version(version);
            for (let i = 0; i < this.version.length; i++) {
                const a = this.version[i];
                const b = compareVersion.version[i];
                if (a === b) {
                    continue;
                }
                return a < b;
            }
            return false;
        }
        isSameVersion(version) {
            const compareVersion = new Version(version);
            for (let i = 0; i < this.version.length; i++) {
                if (this.version[i] !== compareVersion.version[i]) {
                    return false;
                }
            }
            return true;
        }
    }
    exports.default = Version;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVyc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL1ZlcnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7O0lBTUgsTUFBcUIsT0FBTztRQUczQixJQUFXLEtBQUs7WUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUVELElBQVcsS0FBSztZQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBRUQsSUFBVyxLQUFLO1lBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFFRCxZQUFtQixPQUF3QjtZQUMxQyxJQUFJLE9BQU8sWUFBWSxPQUFPLEVBQUU7Z0JBQy9CLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO2FBQzFCO1lBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQThCLENBQUM7YUFFekQ7aUJBQU07Z0JBQ04sSUFBSTtvQkFDSCxNQUFNLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUUsQ0FBQztvQkFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQzt5QkFDL0MsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQThCLENBQUM7aUJBRTVDO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNYLGFBQUcsQ0FBQyxJQUFJLENBQUMsZUFBUyxDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsMEJBQTBCLE9BQU8sRUFBRSxDQUFDLENBQUM7b0JBQ3RGLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNEO1FBQ0YsQ0FBQztRQUVNLFNBQVM7WUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFTSxXQUFXLENBQUMsT0FBd0I7WUFDMUMsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDO2dCQUMzQixNQUFNLENBQUMsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ1osU0FBUztpQkFDVDtnQkFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDYjtZQUVELE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVNLFdBQVcsQ0FBQyxPQUF3QjtZQUMxQyxNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzdDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDWixTQUFTO2lCQUNUO2dCQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNiO1lBRUQsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBRU0sYUFBYSxDQUFDLE9BQXdCO1lBQzVDLE1BQU0sY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0MsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2xELE9BQU8sS0FBSyxDQUFDO2lCQUNiO2FBQ0Q7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7S0FDRDtJQWhGRCwwQkFnRkMifQ==