import IPlayer from "entity/player/IPlayer";
import { TranslationGenerator } from "newui/component/IComponent";
import { IVector3 } from "utilities/math/IVector";
export default function (player: IPlayer, position: IVector3, actionName: TranslationGenerator): IVector3 | undefined;
