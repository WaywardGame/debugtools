import type Tile from "@wayward/game/game/tile/Tile";
import Mod from "@wayward/game/mod/Mod";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import Enums from "@wayward/game/utilities/enum/Enums";
import type { IVector2 } from "@wayward/game/utilities/math/IVector";
import Vector2 from "@wayward/game/utilities/math/Vector2";
import Vector3 from "@wayward/game/utilities/math/Vector3";
import type DebugTools from "../DebugTools";
import { DEBUG_TOOLS_ID } from "../IDebugTools";
import type { IOverlayInfo } from "@wayward/game/game/tile/ITerrain";
import Objects from "@wayward/utilities/object/Objects";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class SelectionOverlay {

	/**
	 * Tiles that have a selection overlay
	 */
	private static readonly overlays = new Set<Tile>();

	/**
	 * List of overlays being rendered for each tile
	 */
	private static readonly subTileOverlays = new Map<Tile, Set<IOverlayInfo>>();

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly debugTools: DebugTools;

	public static add(tile: Tile): boolean {
		if (!this.overlays.has(tile)) {
			this.overlays.add(tile);

			this.updateSelectionOverlay(tile);

			return true;
		}

		return false;
	}

	public static remove(tile: Tile): boolean {
		if (this.overlays.delete(tile)) {
			this.updateSelectionOverlay(tile);

			return true;
		}

		return false;
	}

	/**
	 * Selection overlay tilemapping
	 * @param tile The tile to update
	 * @param updateNeighbors Whether to update the tile's neighbours. Defaults to `true`. This method calls itself to update its neighbours,
	 * but doesn't update neighbours in the recursive call.
	 */
	private static updateSelectionOverlay(tile: Tile, updateNeighbors = true): void {
		let neighborTiles: INeighborTiles | undefined;
		let connections: NeighborPosition[] | undefined;

		// clear existing subtile overlays
		const subTileOverlays = this.subTileOverlays.get(tile);
		if (subTileOverlays) {
			for (const overlay of subTileOverlays) {
				tile.removeOverlay(overlay);
			}

			this.subTileOverlays.delete(tile);
		}

		// if this tile should have a selection overlay, we tilemap this tile based on its neighbours
		if (this.overlays.has(tile)) {
			neighborTiles = getNeighborTiles(tile);
			connections = this.getPaintOverlayConnections(neighborTiles);

			const mappedTile: ISubTileMap = {
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

			for (const subTilePosition of Enums.values(SubTilePosition)) {
				const offset = subTilePositionMap[subTilePosition];

				let subTileOverlay: IOverlayInfo;

				if (mappedTile[subTilePosition] === 4) {
					subTileOverlay = {
						type: SelectionOverlay.debugTools.overlayPaint,
						size: 8,
						offsetX: 20,
						offsetY: 4,
						spriteOffsetX: offset.x / 16,
						spriteOffsetY: offset.y / 16,
					};

				} else {
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

		if (!updateNeighbors) {
			return;
		}

		neighborTiles = neighborTiles || getNeighborTiles(tile);
		connections = connections || this.getPaintOverlayConnections(neighborTiles);

		for (const neighborTile of Object.values(neighborTiles)) {
			this.updateSelectionOverlay(neighborTile, false);
		}
	}

	/**
	 * Returns an array of neighbor positions that are painted/selected
	 */
	private static getPaintOverlayConnections(neighbors: INeighborTiles): NeighborPosition[] {
		return Objects.keys(neighbors)
			.filter(neighborPosition => this.overlays.has(neighbors[neighborPosition]));
	}

}

/**
 * Returns the neighbor tiles for the given tile position.
 */
function getNeighborTiles(tilePosition: IVector2): INeighborTiles {
	const vectors = getNeighborVectors(tilePosition);
	return Enums.values(NeighborPosition)
		.map(pos => Tuple(pos, localIsland.getTile(...vectors[pos].xyz)))
		.toObject();
}

/**
 * Returns a map of neighbor positions to their corresponding tile position.
 */
function getNeighborVectors(tilePosition: IVector2): { T: Vector3; O: Vector3; P: Vector3; R: Vector3; B: Vector3; M: Vector3; L: Vector3; E: Vector3 } {
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

type INeighborTiles = Record<NeighborPosition, Tile>;

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

type ISubTileMap = Record<SubTilePosition, number>;

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
function getId(relevantFor: SubTilePosition, ...positions: Array<NeighborPosition | undefined>): string {
	return positions.filter((p): p is NeighborPosition => p !== undefined && isRelevant(relevantFor, p))
		.sort((a, b) => a.localeCompare(b))
		.join("");
}

/**
 * Returns whether the given neighbor position is relevant for the given sub tile position (EG: when the sub tile sprite is affected by the neighbor)
 */
function isRelevant(subTilePosition: SubTilePosition, neighborPosition: NeighborPosition): boolean {
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
	[SubTilePosition.TopLeft]: Vector2.ZERO,
	[SubTilePosition.TopRight]: new Vector2(8, 0),
	[SubTilePosition.BottomLeft]: new Vector2(0, 8),
	[SubTilePosition.BottomRight]: new Vector2(8),
};
