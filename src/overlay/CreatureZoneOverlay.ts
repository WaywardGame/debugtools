import { EventHandler } from "@wayward/game/event/EventManager";
import CreatureZoneManager from "@wayward/game/game/entity/creature/zone/CreatureZoneManager";
import type Entity from "@wayward/game/game/entity/Entity";
import type { IOverlayInfo } from "@wayward/game/game/tile/ITerrain";
import { OverlayType } from "@wayward/game/game/tile/ITerrain";
import type Tile from "@wayward/game/game/tile/Tile";
import UniversalOverlay from "@wayward/game/renderer/overlay/UniversalOverlay";
import type { IVector3 } from "@wayward/game/utilities/math/IVector";
import Vector2 from "@wayward/game/utilities/math/Vector2";
import Vector3 from "@wayward/game/utilities/math/Vector3";
import Color from "@wayward/utilities/Color";
import EventEmitter from "@wayward/utilities/event/EventEmitter";

const TIER_COLORS = [
	Color.fromInt(0x00B5FF),
	Color.fromInt(0x00ffd8),
	Color.fromInt(0x00ff21),
	Color.fromInt(0x8cff00),
	Color.fromInt(0xeeff00),
	Color.fromInt(0xffcc00),
	Color.fromInt(0xffa500),
	Color.fromInt(0xff4800),
	Color.fromInt(0xff0400),
	Color.fromInt(0xb50045),
	Color.fromInt(0x7a0154),
];

export enum CreatureZoneOverlayMode {
	None,
	Active,
	All,
	FollowingEntity,
}

export interface ICreatureZoneOverlayEvents {
	changeMode(mode: CreatureZoneOverlayMode, oldMode: CreatureZoneOverlayMode): any;
}

export class CreatureZoneOverlay extends UniversalOverlay {

	public override get minVector(): Vector2 {
		return Vector2.ONE;
	}

	public override get maxVector(): Vector2 {
		return new Vector2(localIsland.mapSize - 1);
	}

	private mode = CreatureZoneOverlayMode.None;
	public followingEntity?: WeakRef<Entity>;
	private entityZone?: IVector3;
	private getEntityZone() {
		const entity = this.followingEntity?.deref();
		const entityZone = entity?.asCreature?.zone ?? entity?.tile?.zone;
		if (Vector3.equals(entityZone?.zonePoint, this.entityZone)) {
			return this.entityZone;
		}

		return this.entityZone = entityZone?.zonePoint;
	}

	public readonly event = new EventEmitter<this, ICreatureZoneOverlayEvents>(this);

	public getMode(): CreatureZoneOverlayMode {
		return this.mode;
	}

	public setMode(mode: CreatureZoneOverlayMode): this {
		if (this.mode === mode) {
			return this;
		}

		if (this.mode === CreatureZoneOverlayMode.None) {
			this.show();
		}

		const oldMode = this.mode;
		this.mode = mode;

		if (this.mode === CreatureZoneOverlayMode.None) {
			this.hide();
		}

		this.refresh();
		this.event.emit("changeMode", mode, oldMode);

		if (this.mode === CreatureZoneOverlayMode.FollowingEntity) {
			this.followingEntity?.deref()?.asEntityMovable?.event.until(this, "changeMode")
				.subscribe("postMove", () => this.refresh());
		}

		return this;
	}

	protected override shouldRefresh(): boolean {
		if (this.mode === CreatureZoneOverlayMode.FollowingEntity && Vector3.equals(this.entityZone, this.getEntityZone())) {
			return false;
		}

		return true;
	}

	protected override generateOverlayInfo(tile: Tile, previousOverlay?: IOverlayInfo): IOverlayInfo | undefined {
		const zone = tile.zone;
		if (this.mode === CreatureZoneOverlayMode.FollowingEntity && !Vector3.equals(zone.zonePoint, this.entityZone)) {
			return undefined;
		}

		const tier = zone?.getTier();
		if (tier === undefined) {
			return undefined;
		}

		if (this.mode === CreatureZoneOverlayMode.Active && !tile.island.zones.getActiveZones().includes(zone!)) {
			return undefined;
		}

		// const baseTier = localIsland.zones.getMinTier();
		// tier -= baseTier;
		// tier = Math.max(0, tier);

		const color = TIER_COLORS[tier] ?? TIER_COLORS.last();
		if (!color) {
			return undefined;
		}

		if (color.r === previousOverlay?.red && color.g === previousOverlay.green && color.b === previousOverlay.blue) {
			return previousOverlay;
		}

		return {
			type: OverlayType.Full,
			size: 16,
			...Color.getFullNames(color),
			alpha: this.alpha * 0.5,
		};
	}

	protected override updateOverlayAlpha(tile: Tile): IOverlayInfo | undefined {
		return this.generateOverlayInfo(tile);
	}

	protected override onPreMoveToIsland(): void {
		super.onPreMoveToIsland();
		localIsland.zones.event.unsubscribe(["initialize", "load"], this.refresh);
	}

	protected override onLoadOnIsland(): void {
		super.onLoadOnIsland();
		localIsland.zones.event.subscribe(["initialize", "load"], this.refresh);
	}

	@EventHandler(CreatureZoneManager, "activeZonesChange")
	protected onActiveZonesChange(): void {
		if (this.mode === CreatureZoneOverlayMode.Active) {
			this.refresh();
		}
	}

}
