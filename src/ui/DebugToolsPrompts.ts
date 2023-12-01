/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

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
