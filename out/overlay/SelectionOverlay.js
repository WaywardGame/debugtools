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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/goodstream/Stream", "mod/Mod", "utilities/collection/Tuple", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "../IDebugTools"], function (require, exports, Stream_1, Mod_1, Tuple_1, Enums_1, Vector2_1, Vector3_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SelectionOverlay {
        static add(tile) {
            if (!this.overlays.has(tile)) {
                this.overlays.add(tile);
                this.updateSelectionOverlay(tile);
                return true;
            }
            return false;
        }
        static remove(tile) {
            if (this.overlays.delete(tile)) {
                this.updateSelectionOverlay(tile);
                return true;
            }
            return false;
        }
        static updateSelectionOverlay(tile, updateNeighbors = true) {
            let neighborTiles;
            let connections;
            const subTileOverlays = this.subTileOverlays.get(tile);
            if (subTileOverlays) {
                for (const overlay of subTileOverlays) {
                    tile.removeOverlay(overlay);
                }
                this.subTileOverlays.delete(tile);
            }
            if (this.overlays.has(tile)) {
                neighborTiles = getNeighborTiles(tile);
                connections = this.getPaintOverlayConnections(neighborTiles);
                const mappedTile = {
                    [SubTilePosition.TopLeft]: paintTileMap[SubTilePosition.TopLeft][getId(SubTilePosition.TopLeft, ...connections)],
                    [SubTilePosition.TopRight]: paintTileMap[SubTilePosition.TopRight][getId(SubTilePosition.TopRight, ...connections)],
                    [SubTilePosition.BottomLeft]: paintTileMap[SubTilePosition.BottomLeft][getId(SubTilePosition.BottomLeft, ...connections)],
                    [SubTilePosition.BottomRight]: paintTileMap[SubTilePosition.BottomRight][getId(SubTilePosition.BottomRight, ...connections)],
                };
                let subTileOverlays = this.subTileOverlays.get(tile);
                if (!subTileOverlays) {
                    subTileOverlays = new Set();
                    this.subTileOverlays.set(tile, subTileOverlays);
                }
                for (const subTilePosition of Enums_1.default.values(SubTilePosition)) {
                    const offset = subTilePositionMap[subTilePosition];
                    let subTileOverlay;
                    if (mappedTile[subTilePosition] === 4) {
                        subTileOverlay = {
                            type: SelectionOverlay.debugTools.overlayPaint,
                            size: 8,
                            offsetX: 20,
                            offsetY: 4,
                            spriteOffsetX: offset.x / 16,
                            spriteOffsetY: offset.y / 16,
                        };
                    }
                    else {
                        subTileOverlay = {
                            type: SelectionOverlay.debugTools.overlayPaint,
                            size: 8,
                            offsetX: mappedTile[subTilePosition] * 16 + offset.x,
                            offsetY: offset.y,
                            spriteOffsetX: offset.x / 16,
                            spriteOffsetY: offset.y / 16,
                        };
                    }
                    subTileOverlays.add(subTileOverlay);
                    tile.addOrUpdateOverlay(subTileOverlay);
                }
            }
            if (!updateNeighbors)
                return;
            neighborTiles = neighborTiles || getNeighborTiles(tile);
            connections = connections || this.getPaintOverlayConnections(neighborTiles);
            for (const neighborTile of Object.values(neighborTiles)) {
                this.updateSelectionOverlay(neighborTile, false);
            }
        }
        static getPaintOverlayConnections(neighbors) {
            return Stream_1.default.keys(neighbors)
                .filter(neighborPosition => this.overlays.has(neighbors[neighborPosition]))
                .toArray();
        }
    }
    SelectionOverlay.overlays = new Set();
    SelectionOverlay.subTileOverlays = new Map();
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], SelectionOverlay, "debugTools", void 0);
    exports.default = SelectionOverlay;
    function getNeighborTiles(tilePosition) {
        const vectors = getNeighborVectors(tilePosition);
        return Enums_1.default.values(NeighborPosition)
            .map(pos => (0, Tuple_1.Tuple)(pos, localIsland.getTile(...vectors[pos].xyz)))
            .toObject();
    }
    function getNeighborVectors(tilePosition) {
        return {
            [NeighborPosition.TopLeft]: new Vector3_1.default(tilePosition.x - 1, tilePosition.y - 1, localPlayer.z),
            [NeighborPosition.Top]: new Vector3_1.default(tilePosition.x, tilePosition.y - 1, localPlayer.z),
            [NeighborPosition.TopRight]: new Vector3_1.default(tilePosition.x + 1, tilePosition.y - 1, localPlayer.z),
            [NeighborPosition.Right]: new Vector3_1.default(tilePosition.x + 1, tilePosition.y, localPlayer.z),
            [NeighborPosition.BottomRight]: new Vector3_1.default(tilePosition.x + 1, tilePosition.y + 1, localPlayer.z),
            [NeighborPosition.Bottom]: new Vector3_1.default(tilePosition.x, tilePosition.y + 1, localPlayer.z),
            [NeighborPosition.BottomLeft]: new Vector3_1.default(tilePosition.x - 1, tilePosition.y + 1, localPlayer.z),
            [NeighborPosition.Left]: new Vector3_1.default(tilePosition.x - 1, tilePosition.y, localPlayer.z),
        };
    }
    var NeighborPosition;
    (function (NeighborPosition) {
        NeighborPosition["TopLeft"] = "T";
        NeighborPosition["Top"] = "O";
        NeighborPosition["TopRight"] = "P";
        NeighborPosition["Right"] = "R";
        NeighborPosition["BottomRight"] = "B";
        NeighborPosition["Bottom"] = "M";
        NeighborPosition["BottomLeft"] = "L";
        NeighborPosition["Left"] = "E";
    })(NeighborPosition || (NeighborPosition = {}));
    var SubTilePosition;
    (function (SubTilePosition) {
        SubTilePosition[SubTilePosition["TopLeft"] = 0] = "TopLeft";
        SubTilePosition[SubTilePosition["TopRight"] = 1] = "TopRight";
        SubTilePosition[SubTilePosition["BottomLeft"] = 2] = "BottomLeft";
        SubTilePosition[SubTilePosition["BottomRight"] = 3] = "BottomRight";
    })(SubTilePosition || (SubTilePosition = {}));
    const paintTileMap = {
        [SubTilePosition.TopLeft]: {
            [""]: 0,
            [getId(SubTilePosition.TopLeft, NeighborPosition.TopLeft)]: 0,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Top)]: 2,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Top, NeighborPosition.TopLeft)]: 2,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Left)]: 3,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Left, NeighborPosition.TopLeft)]: 3,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Top, NeighborPosition.Left)]: 1,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Top, NeighborPosition.Left, NeighborPosition.TopLeft)]: 4,
        },
        [SubTilePosition.TopRight]: {
            [""]: 0,
            [getId(SubTilePosition.TopRight, NeighborPosition.TopRight)]: 0,
            [getId(SubTilePosition.TopRight, NeighborPosition.Top)]: 2,
            [getId(SubTilePosition.TopRight, NeighborPosition.Top, NeighborPosition.TopRight)]: 2,
            [getId(SubTilePosition.TopRight, NeighborPosition.Right)]: 3,
            [getId(SubTilePosition.TopRight, NeighborPosition.Right, NeighborPosition.TopRight)]: 3,
            [getId(SubTilePosition.TopRight, NeighborPosition.Top, NeighborPosition.Right)]: 1,
            [getId(SubTilePosition.TopRight, NeighborPosition.Top, NeighborPosition.Right, NeighborPosition.TopRight)]: 4,
        },
        [SubTilePosition.BottomLeft]: {
            [""]: 0,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.BottomLeft)]: 0,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom)]: 2,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom, NeighborPosition.BottomLeft)]: 2,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Left)]: 3,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Left, NeighborPosition.BottomLeft)]: 3,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom, NeighborPosition.Left)]: 1,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom, NeighborPosition.Left, NeighborPosition.BottomLeft)]: 4,
        },
        [SubTilePosition.BottomRight]: {
            [""]: 0,
            [getId(SubTilePosition.BottomRight, NeighborPosition.BottomRight)]: 0,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Bottom)]: 2,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Bottom, NeighborPosition.BottomRight)]: 2,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Right)]: 3,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Right, NeighborPosition.BottomRight)]: 3,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Bottom, NeighborPosition.Right)]: 1,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Bottom, NeighborPosition.Right, NeighborPosition.BottomRight)]: 4,
        },
    };
    function getId(relevantFor, ...positions) {
        return positions.filter((p) => p !== undefined && isRelevant(relevantFor, p))
            .sort((a, b) => a.localeCompare(b))
            .join("");
    }
    function isRelevant(subTilePosition, neighborPosition) {
        switch (subTilePosition) {
            case SubTilePosition.TopLeft:
                return neighborPosition === NeighborPosition.Top || neighborPosition === NeighborPosition.TopLeft || neighborPosition === NeighborPosition.Left;
            case SubTilePosition.TopRight:
                return neighborPosition === NeighborPosition.Top || neighborPosition === NeighborPosition.TopRight || neighborPosition === NeighborPosition.Right;
            case SubTilePosition.BottomLeft:
                return neighborPosition === NeighborPosition.Bottom || neighborPosition === NeighborPosition.BottomLeft || neighborPosition === NeighborPosition.Left;
            case SubTilePosition.BottomRight:
                return neighborPosition === NeighborPosition.Bottom || neighborPosition === NeighborPosition.BottomRight || neighborPosition === NeighborPosition.Right;
        }
    }
    const subTilePositionMap = {
        [SubTilePosition.TopLeft]: Vector2_1.default.ZERO,
        [SubTilePosition.TopRight]: new Vector2_1.default(8, 0),
        [SubTilePosition.BottomLeft]: new Vector2_1.default(0, 8),
        [SubTilePosition.BottomRight]: new Vector2_1.default(8),
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uT3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5L1NlbGVjdGlvbk92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7O0lBY0gsTUFBcUIsZ0JBQWdCO1FBZTdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBVTtZQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV4QixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWxDLE9BQU8sSUFBSSxDQUFDO2FBQ1o7WUFFRCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQVU7WUFDOUIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVsQyxPQUFPLElBQUksQ0FBQzthQUNaO1lBRUQsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBUU8sTUFBTSxDQUFDLHNCQUFzQixDQUFDLElBQVUsRUFBRSxlQUFlLEdBQUcsSUFBSTtZQUN2RSxJQUFJLGFBQXlDLENBQUM7WUFDOUMsSUFBSSxXQUEyQyxDQUFDO1lBR2hELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZELElBQUksZUFBZSxFQUFFO2dCQUNwQixLQUFLLE1BQU0sT0FBTyxJQUFJLGVBQWUsRUFBRTtvQkFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDNUI7Z0JBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEM7WUFHRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM1QixhQUFhLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLFdBQVcsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRTdELE1BQU0sVUFBVSxHQUFnQjtvQkFDL0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDO29CQUNoSCxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxZQUFZLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEdBQUcsV0FBVyxDQUFDLENBQUM7b0JBQ25ILENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFlBQVksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxXQUFXLENBQUMsQ0FBQztvQkFDekgsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEVBQUUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxHQUFHLFdBQVcsQ0FBQyxDQUFDO2lCQUM1SCxDQUFDO2dCQUVGLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUNyQixlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO2lCQUNoRDtnQkFFRCxLQUFLLE1BQU0sZUFBZSxJQUFJLGVBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUU7b0JBQzVELE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUVuRCxJQUFJLGNBQTRCLENBQUM7b0JBRWpDLElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDdEMsY0FBYyxHQUFHOzRCQUNoQixJQUFJLEVBQUUsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLFlBQVk7NEJBQzlDLElBQUksRUFBRSxDQUFDOzRCQUNQLE9BQU8sRUFBRSxFQUFFOzRCQUNYLE9BQU8sRUFBRSxDQUFDOzRCQUNWLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUU7NEJBQzVCLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUU7eUJBQzVCLENBQUM7cUJBRUY7eUJBQU07d0JBQ04sY0FBYyxHQUFHOzRCQUNoQixJQUFJLEVBQUUsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLFlBQVk7NEJBQzlDLElBQUksRUFBRSxDQUFDOzRCQUNQLE9BQU8sRUFBRSxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDOzRCQUNwRCxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7NEJBQ2pCLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUU7NEJBQzVCLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUU7eUJBQzVCLENBQUM7cUJBQ0Y7b0JBRUQsZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFFcEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUN4QzthQUNEO1lBRUQsSUFBSSxDQUFDLGVBQWU7Z0JBQUUsT0FBTztZQUU3QixhQUFhLEdBQUcsYUFBYSxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hELFdBQVcsR0FBRyxXQUFXLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTVFLEtBQUssTUFBTSxZQUFZLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDeEQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNqRDtRQUNGLENBQUM7UUFLTyxNQUFNLENBQUMsMEJBQTBCLENBQUMsU0FBeUI7WUFDbEUsT0FBTyxnQkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7aUJBQzNCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztpQkFDMUUsT0FBTyxFQUFFLENBQUM7UUFDYixDQUFDOztJQXZIdUIseUJBQVEsR0FBYyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBS2hDLGdDQUFlLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7SUFHM0Q7UUFEdEIsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDOzhDQUNLO3NCQWIxQixnQkFBZ0I7SUFtSXJDLFNBQVMsZ0JBQWdCLENBQUMsWUFBc0I7UUFDL0MsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakQsT0FBTyxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDO2FBQ25DLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUEsYUFBSyxFQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEUsUUFBUSxFQUFFLENBQUM7SUFDZCxDQUFDO0lBS0QsU0FBUyxrQkFBa0IsQ0FBQyxZQUFzQjtRQUNqRCxPQUFPO1lBQ04sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLGlCQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUM5RixDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksaUJBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdEYsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLGlCQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMvRixDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksaUJBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDeEYsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLGlCQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNsRyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksaUJBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDekYsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLGlCQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqRyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksaUJBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7U0FDdkYsQ0FBQztJQUNILENBQUM7SUFJRCxJQUFLLGdCQVNKO0lBVEQsV0FBSyxnQkFBZ0I7UUFDcEIsaUNBQWEsQ0FBQTtRQUNiLDZCQUFTLENBQUE7UUFDVCxrQ0FBYyxDQUFBO1FBQ2QsK0JBQVcsQ0FBQTtRQUNYLHFDQUFpQixDQUFBO1FBQ2pCLGdDQUFZLENBQUE7UUFDWixvQ0FBZ0IsQ0FBQTtRQUNoQiw4QkFBVSxDQUFBO0lBQ1gsQ0FBQyxFQVRJLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFTcEI7SUFJRCxJQUFLLGVBS0o7SUFMRCxXQUFLLGVBQWU7UUFDbkIsMkRBQU8sQ0FBQTtRQUNQLDZEQUFRLENBQUE7UUFDUixpRUFBVSxDQUFBO1FBQ1YsbUVBQVcsQ0FBQTtJQUNaLENBQUMsRUFMSSxlQUFlLEtBQWYsZUFBZSxRQUtuQjtJQUtELE1BQU0sWUFBWSxHQUFHO1FBQ3BCLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzFCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNQLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzdELENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3pELENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNuRixDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxRCxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDcEYsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2hGLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDMUc7UUFDRCxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUCxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMvRCxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxRCxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDckYsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDNUQsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3ZGLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNsRixDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQzdHO1FBQ0QsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDN0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1AsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDbkUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDL0QsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVGLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzdELENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxRixDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdEYsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNuSDtRQUNELENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzlCLENBQUMsRUFBRSxDQUFDLEVB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