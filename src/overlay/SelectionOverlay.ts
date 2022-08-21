import Stream from "@wayward/goodstream/Stream";
import { ITile } from "game/tile/ITerrain";
import Mod from "mod/Mod";
import { Tuple } from "utilities/collection/Arrays";
import Enums from "utilities/enum/Enums";
import TileHelpers from "utilities/game/TileHelpers";
import { IVector2, IVector3 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import DebugTools from "../DebugTools";
import { DEBUG_TOOLS_ID } from "../IDebugTools";
import Overlays from "./Overlays";

export default class SelectionOverlay {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly debugTools: DebugTools;

	public static add(tilePosition: IVector2 | IVector3, tile = getTile(tilePosition)) {
		if (TileHelpers.Overlay.add(tile, { type: this.debugTools.overlayPaint }, Overlays.isPaint)) {
			updateSelectionOverlay(tile, tilePosition);
			return true;
		}

		return false;
	}

	public static remove(tilePosition: IVector2 | IVector3, tile = getTile(tilePosition)) {
		if (TileHelpers.Overlay.remove(tile, Overlays.isPaint)) {
			updateSelectionOverlay(tile, tilePosition);
			return true;
		}

		return false;
	}
}

function getTile(tilePosition: IVector2 | IVector3) {
	return localIsland.getTile(tilePosition.x, tilePosition.y, "z" in tilePosition ? tilePosition.z : localPlayer.z);
}

/**
 * Selection overlay tilemapping
 * @param tile The tile to update
 * @param tilePosition The position of this tile
 * @param updateNeighbors Whether to update the tile's neighbours. Defaults to `true`. This method calls itself to update its neighbours,
 * but doesn't update neighbours in the recursive call.
 */
function updateSelectionOverlay(tile: ITile, tilePosition: IVector2, updateNeighbors = true) {
	let neighborTiles: INeighborTiles | undefined;
	let connections: NeighborPosition[] | undefined;

	const isTilePainted = TileHelpers.Overlay.remove(tile, Overlays.isPaint);

	// if this tile is painted (has the selection overlay), we tilemap this tile based on its neighbours
	if (isTilePainted) {
		neighborTiles = getNeighborTiles(tilePosition);
		connections = getPaintOverlayConnections(neighborTiles);

		const mappedTile: ISubTileMap = {
			[SubTilePosition.TopLeft]: paintTileMap[SubTilePosition.TopLeft][getId(SubTilePosition.TopLeft, ...connections)],
			[SubTilePosition.TopRight]: paintTileMap[SubTilePosition.TopRight][getId(SubTilePosition.TopRight, ...connections)],
			[SubTilePosition.BottomLeft]: paintTileMap[SubTilePosition.BottomLeft][getId(SubTilePosition.BottomLeft, ...connections)],
			[SubTilePosition.BottomRight]: paintTileMap[SubTilePosition.BottomRight][getId(SubTilePosition.BottomRight, ...connections)],
		};

		for (const subTilePosition of Enums.values(SubTilePosition)) {
			const offset = subTilePositionMap[subTilePosition];

			if (mappedTile[subTilePosition] === 4) {
				TileHelpers.Overlay.add(tile, {
					type: SelectionOverlay.debugTools.overlayPaint,
					size: 8,
					offsetX: 20,
					offsetY: 4,
					spriteOffsetX: offset.x / 16,
					spriteOffsetY: offset.y / 16,
				});
				continue;
			}

			TileHelpers.Overlay.add(tile, {
				type: SelectionOverlay.debugTools.overlayPaint,
				size: 8,
				offsetX: mappedTile[subTilePosition] * 16 + offset.x,
				offsetY: offset.y,
				spriteOffsetX: offset.x / 16,
				spriteOffsetY: offset.y / 16,
			});
		}
	}

	if (!updateNeighbors) return;

	neighborTiles = neighborTiles || getNeighborTiles(tilePosition);
	connections = connections || getPaintOverlayConnections(neighborTiles);

	for (const [neighborPosition, neighborTile] of Object.values(neighborTiles)) {
		updateSelectionOverlay(neighborTile, neighborPosition, false);
	}
}

/**
 * Returns the neighbor tiles for the given tile position.
 */
function getNeighborTiles(tilePosition: IVector2): INeighborTiles {
	const vectors = getNeighborVectors(tilePosition);
	return Enums.values(NeighborPosition)
		.map(pos => Tuple(pos, Tuple(vectors[pos], localIsland.getTile(...vectors[pos].xyz))))
		.toObject();
}

/**
 * Returns an array of neighbor positions that are painted/selected
 */
function getPaintOverlayConnections(neighbors: INeighborTiles) {
	return Stream.keys(neighbors)
		.filter(neighborPosition => TileHelpers.Overlay.has(neighbors[neighborPosition][1], Overlays.isPaint))
		.toArray();
}

/**
 * Returns a map of neighbor positions to their corresponding tile position.
 */
function getNeighborVectors(tilePosition: IVector2) {
	return {
		[NeighborPosition.TopLeft]: new Vector3(tilePosition.x - 1, tilePosition.y - 1, localPlayer.z),
		[NeighborPosition.Top]: new Vector3(tilePosition.x, tilePosition.y - 1, localPlayer.z),
		[NeighborPosition.TopRight]: new Vector3(tilePosition.x + 1, tilePosition.y - 1, localPlayer.z),
		[NeighborPosition.Right]: new Vector3(tilePosition.x + 1, tilePosition.y, localPlayer.z),
		[NeighborPosition.BottomRight]: new Vector3(tilePosition.x + 1, tilePosition.y + 1, localPlayer.z),
		[NeighborPosition.Bottom]: new Vector3(tilePosition.x, tilePosition.y + 1, localPlayer.z),
		[NeighborPosition.BottomLeft]: new Vector3(tilePosition.x - 1, tilePosition.y + 1, localPlayer.z),
		[NeighborPosition.Left]: new Vector3(tilePosition.x - 1, tilePosition.y, localPlayer.z),
	};
}

type INeighborTiles = { [key in NeighborPosition]: [Vector3, ITile] };

enum NeighborPosition {
	TopLeft = "T",
	Top = "O",
	TopRight = "P",
	Right = "R",
	BottomRight = "B",
	Bottom = "M",
	BottomLeft = "L",
	Left = "E",
}

type ISubTileMap = { [key in SubTilePosition]: number };

enum SubTilePosition {
	TopLeft,
	TopRight,
	BottomLeft,
	BottomRight,
}

/**
 * The master tilemap-map, mapping subtile positions to their position in the tilesheet
 */
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

/**
 * Returns an ID from a list of neighbor positions, fitlered by ones that are actually relevant to the sub tile position (quadrant of a tile)
 */
function getId(relevantFor: SubTilePosition, ...positions: (NeighborPosition | undefined)[]) {
	return positions.filter((p): p is NeighborPosition => p !== undefined && isRelevant(relevantFor, p))
		.sort((a, b) => a.localeCompare(b))
		.join("");
}

/**
 * Returns whether the given neighbor position is relevant for the given sub tile position (EG: when the sub tile sprite is affected by the neighbor)
 */
// tslint:disable cyclomatic-complexity
function isRelevant(subTilePosition: SubTilePosition, neighborPosition: NeighborPosition) {
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
// tslint:enable cyclomatic-complexity

const subTilePositionMap = {
	[SubTilePosition.TopLeft]: Vector2.ZERO,
	[SubTilePosition.TopRight]: new Vector2(8, 0),
	[SubTilePosition.BottomLeft]: new Vector2(0, 8),
	[SubTilePosition.BottomRight]: new Vector2(8),
};
