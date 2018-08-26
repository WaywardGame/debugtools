import { ITile } from "tile/ITerrain";
import { tuple } from "utilities/Arrays";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { IVector2, IVector3 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import Objects from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";
import DebugTools from "../DebugTools";
import { isPaintOverlay } from "../IDebugTools";

module SelectionOverlay {
	export function add(tilePosition: IVector2 | IVector3, tile = getTile(tilePosition)) {
		if (TileHelpers.Overlay.add(tile, { type: DebugTools.INSTANCE.overlayPaint }, isPaintOverlay)) {
			updateSelectionOverlay(tile, tilePosition);
		}
	}

	export function remove(tilePosition: IVector2 | IVector3, tile = getTile(tilePosition)) {
		if (TileHelpers.Overlay.remove(tile, isPaintOverlay)) {
			updateSelectionOverlay(tile, tilePosition);
		}
	}
}

export default SelectionOverlay;

function getTile(tilePosition: IVector2 | IVector3) {
	return game.getTile(tilePosition.x, tilePosition.y, "z" in tilePosition ? tilePosition.z : localPlayer.z);
}

function updateSelectionOverlay(tile: ITile, tilePosition: IVector2, updateNeighbors = true) {
	let neighborTiles: INeighborTiles | undefined;
	let connections: NeighborPosition[] | undefined;

	const isTilePainted = TileHelpers.Overlay.remove(tile, isPaintOverlay);

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
					type: DebugTools.INSTANCE.overlayPaint,
					size: 8,
					offsetX: 20,
					offsetY: 4,
					spriteOffsetX: offset.x / 16,
					spriteOffsetY: offset.y / 16,
				});
				continue;
			}

			TileHelpers.Overlay.add(tile, {
				type: DebugTools.INSTANCE.overlayPaint,
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

	for (const [neighborPosition, neighborTile] of Objects.values(neighborTiles)) {
		updateSelectionOverlay(neighborTile, neighborPosition, false);
	}
}

function getNeighborTiles(tilePosition: IVector2): INeighborTiles {
	const vectors = getNeighborVectors(tilePosition);
	return Enums.values(NeighborPosition)
		.map(pos => tuple(pos, tuple(vectors[pos], game.getTile(...vectors[pos].xyz))))
		.collect(Objects.create);
}

function getPaintOverlayConnections(neighbors: INeighborTiles) {
	return Objects.keys(neighbors)
		.filter(neighborPosition => TileHelpers.Overlay.has(neighbors[neighborPosition][1], isPaintOverlay))
		.collect(Collectors.toArray);
}

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

function getId(relevantFor: SubTilePosition, ...positions: (NeighborPosition | undefined)[]) {
	return positions.filter((p): p is NeighborPosition => p !== undefined && isRelevant(relevantFor, p))
		.sort((a, b) => a.localeCompare(b))
		.join("");
}

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
