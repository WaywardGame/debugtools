import { IPromptConfirmDescription } from "game/meta/prompt/IPrompt";
import Translation from "language/Translation";
import DebugTools from "../DebugTools";
export default class DebugToolsPrompts {
    readonly DEBUG_TOOLS: DebugTools;
    readonly promptReplacePlayerData: IPromptConfirmDescription<[Translation, Translation]>;
}
