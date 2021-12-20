var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/goodstream/Stream", "mod/Mod", "utilities/collection/Arrays", "utilities/enum/Enums", "utilities/game/TileHelpers", "utilities/math/Vector2", "utilities/math/Vector3", "../IDebugTools", "./Overlays"], function (require, exports, Stream_1, Mod_1, Arrays_1, Enums_1, TileHelpers_1, Vector2_1, Vector3_1, IDebugTools_1, Overlays_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SelectionOverlay {
        static add(tilePosition, tile = getTile(tilePosition)) {
            if (TileHelpers_1.default.Overlay.add(tile, { type: this.debugTools.overlayPaint }, Overlays_1.default.isPaint)) {
                updateSelectionOverlay(tile, tilePosition);
            }
        }
        static remove(tilePosition, tile = getTile(tilePosition)) {
            if (TileHelpers_1.default.Overlay.remove(tile, Overlays_1.default.isPaint)) {
                updateSelectionOverlay(tile, tilePosition);
            }
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], SelectionOverlay, "debugTools", void 0);
    exports.default = SelectionOverlay;
    function getTile(tilePosition) {
        return localIsland.getTile(tilePosition.x, tilePosition.y, "z" in tilePosition ? tilePosition.z : localPlayer.z);
    }
    function updateSelectionOverlay(tile, tilePosition, updateNeighbors = true) {
        let neighborTiles;
        let connections;
        const isTilePainted = TileHelpers_1.default.Overlay.remove(tile, Overlays_1.default.isPaint);
        if (isTilePainted) {
            neighborTiles = getNeighborTiles(tilePosition);
            connections = getPaintOverlayConnections(neighborTiles);
            const mappedTile = {
                [SubTilePosition.TopLeft]: paintTileMap[SubTilePosition.TopLeft][getId(SubTilePosition.TopLeft, ...connections)],
                [SubTilePosition.TopRight]: paintTileMap[SubTilePosition.TopRight][getId(SubTilePosition.TopRight, ...connections)],
                [SubTilePosition.BottomLeft]: paintTileMap[SubTilePosition.BottomLeft][getId(SubTilePosition.BottomLeft, ...connections)],
                [SubTilePosition.BottomRight]: paintTileMap[SubTilePosition.BottomRight][getId(SubTilePosition.BottomRight, ...connections)],
            };
            for (const subTilePosition of Enums_1.default.values(SubTilePosition)) {
                const offset = subTilePositionMap[subTilePosition];
                if (mappedTile[subTilePosition] === 4) {
                    TileHelpers_1.default.Overlay.add(tile, {
                        type: SelectionOverlay.debugTools.overlayPaint,
                        size: 8,
                        offsetX: 20,
                        offsetY: 4,
                        spriteOffsetX: offset.x / 16,
                        spriteOffsetY: offset.y / 16,
                    });
                    continue;
                }
                TileHelpers_1.default.Overlay.add(tile, {
                    type: SelectionOverlay.debugTools.overlayPaint,
                    size: 8,
                    offsetX: mappedTile[subTilePosition] * 16 + offset.x,
                    offsetY: offset.y,
                    spriteOffsetX: offset.x / 16,
                    spriteOffsetY: offset.y / 16,
                });
            }
        }
        if (!updateNeighbors)
            return;
        neighborTiles = neighborTiles || getNeighborTiles(tilePosition);
        connections = connections || getPaintOverlayConnections(neighborTiles);
        for (const [neighborPosition, neighborTile] of Object.values(neighborTiles)) {
            updateSelectionOverlay(neighborTile, neighborPosition, false);
        }
    }
    function getNeighborTiles(tilePosition) {
        const vectors = getNeighborVectors(tilePosition);
        return Enums_1.default.values(NeighborPosition)
            .map(pos => (0, Arrays_1.Tuple)(pos, (0, Arrays_1.Tuple)(vectors[pos], localIsland.getTile(...vectors[pos].xyz))))
            .toObject();
    }
    function getPaintOverlayConnections(neighbors) {
        return Stream_1.default.keys(neighbors)
            .filter(neighborPosition => TileHelpers_1.default.Overlay.has(neighbors[neighborPosition][1], Overlays_1.default.isPaint))
            .toArray();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uT3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5L1NlbGVjdGlvbk92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBYUEsTUFBcUIsZ0JBQWdCO1FBSzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBaUMsRUFBRSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztZQUNoRixJQUFJLHFCQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM1RixzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDM0M7UUFDRixDQUFDO1FBRU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFpQyxFQUFFLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBQ25GLElBQUkscUJBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUN2RCxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDM0M7UUFDRixDQUFDO0tBQ0Q7SUFiQTtRQURDLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQzs4Q0FDSztJQUgvQyxtQ0FnQkM7SUFFRCxTQUFTLE9BQU8sQ0FBQyxZQUFpQztRQUNqRCxPQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsSCxDQUFDO0lBU0QsU0FBUyxzQkFBc0IsQ0FBQyxJ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