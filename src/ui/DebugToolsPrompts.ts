import type Translation from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";

export const PromptReplacePlayerData = Mod.register.prompt("ReplacePlayerData", (type, prompt) => prompt.confirm<[Translation, Translation]>(type));
