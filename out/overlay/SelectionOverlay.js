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
                return true;
            }
            return false;
        }
        static remove(tilePosition, tile = getTile(tilePosition)) {
            if (TileHelpers_1.default.Overlay.remove(tile, Overlays_1.default.isPaint)) {
                updateSelectionOverlay(tile, tilePosition);
                return true;
            }
            return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uT3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vdmVybGF5L1NlbGVjdGlvbk92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBYUEsTUFBcUIsZ0JBQWdCO1FBSzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBaUMsRUFBRSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztZQUNoRixJQUFJLHFCQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM1RixzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQzNDLE9BQU8sSUFBSSxDQUFDO2FBQ1o7WUFFRCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQWlDLEVBQUUsSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7WUFDbkYsSUFBSSxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGtCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3ZELHNCQUFzQixDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDM0MsT0FBTyxJQUFJLENBQUM7YUFDWjtZQUVELE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztLQUNEO0lBbkJjO1FBRGIsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDOzhDQUNLO0lBSC9DLG1DQXNCQztJQUVELFNBQVMsT0FBTyxDQUFDLFlBQWlDO1FBQ2pELE9BQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxD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