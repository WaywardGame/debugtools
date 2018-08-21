import { IDoodad } from "doodad/IDoodad";
import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
import { IInspectInformationSection } from "../InspectDialog";

export default class DoodadInformation extends Component implements IInspectInformationSection {
	private doodad: IDoodad;

	public constructor(api: UiApi) {
		super(api);
	}

	public update(position: IVector2, tile: ITile) {
		this.toggle(!!tile.doodad);

		if (tile.doodad && tile.doodad !== this.doodad) {
			this.doodad = tile.doodad;
			DebugTools.LOG.info("Doodad:", tile.doodad);
		}

		return this;
	}
}
