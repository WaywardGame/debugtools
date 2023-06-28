import { IPromptConfirmDescription } from "game/meta/prompt/IPrompt";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import Register from "mod/ModRegistry";
import DebugTools from "../DebugTools";

export default class DebugToolsPrompts {

	@Mod.instance<DebugTools>("Debug Tools")
	public readonly DEBUG_TOOLS: DebugTools;

	@Register.prompt("ReplacePlayerData", (type, prompt) => prompt.confirm<[Translation, Translation]>(type))
	public readonly promptReplacePlayerData: IPromptConfirmDescription<[Translation, Translation]>;

}
