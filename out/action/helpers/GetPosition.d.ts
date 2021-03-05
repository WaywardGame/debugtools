import Player from "game/entity/player/Player";
import { TranslationGenerator } from "ui/component/IComponent";
import { IVector3 } from "utilities/math/IVector";
export default function (player: Player, position: IVector3, actionName: TranslationGenerator): IVector3 | undefined;
