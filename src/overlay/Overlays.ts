import { IOverlayInfo } from "game/tile/ITerrain";
import Mod from "mod/Mod";
import DebugTools from "../DebugTools";
import { DEBUG_TOOLS_ID } from "../IDebugTools";


export default class Overlays {
	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly DEBUG_TOOLS: DebugTools;

	public static isPaint(overlay: IOverlayInfo) {
		return overlay.type === Overlays.DEBUG_TOOLS.overlayPaint;
	}

	public static isHoverTarget(overlay: IOverlayInfo) {
		return overlay.type === Overlays.DEBUG_TOOLS.overlayTarget && !("red" in overlay);
	}

	public static isSelectedTarget(overlay: IOverlayInfo) {
		return overlay.type === Overlays.DEBUG_TOOLS.overlayTarget && "red" in overlay;
	}
}
