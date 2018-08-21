import Component from "newui/component/Component";
import { UiApi } from "newui/INewUi";

export default class OptionsSection extends Component {
	public constructor(api: UiApi) {
		super(api);

		/*
		new CheckButton(api)
			.setText(() => new Translation(DebugTools.INSTANCE.dictionary, DebugToolsTranslation.OptionsAutoOpen))
			.setRefreshMethod(() => !!DebugTools.INSTANCE.globalData.autoOpen)
			.on(CheckButtonEvent.Change, (_, checked) => {
				DebugTools.INSTANCE.globalData.autoOpen = checked;
			})
			.appendTo(this);
		*/
	}
}
