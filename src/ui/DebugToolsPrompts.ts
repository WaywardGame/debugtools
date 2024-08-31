import { IPromptConfirmDescription } from "@wayward/game/game/meta/prompt/IPrompt";
import Translation from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import Register from "@wayward/game/mod/ModRegistry";
import DebugTools from "../DebugTools";

export default class DebugToolsPrompts {

	@Mod.instance<DebugTools>("Debug Tools")
	public readonly DEBUG_TOOLS: DebugTools;

	@Register.prompt("ReplacePlayerData", (type, prompt) => prompt.confirm<[Translation, Translation]>(type))
	public readonly promptReplacePlayerData: IPromptConfirmDescription<[Translation, Translation]>;

}
