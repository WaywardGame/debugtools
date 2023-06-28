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
import { IPromptConfirmDescription } from "game/meta/prompt/IPrompt";
import Translation from "language/Translation";
import DebugTools from "../DebugTools";
export default class DebugToolsPrompts {
    readonly DEBUG_TOOLS: DebugTools;
    readonly promptReplacePlayerData: IPromptConfirmDescription<[Translation, Translation]>;
}
