import Human from "game/entity/Human";
import { TranslationGenerator } from "ui/component/IComponent";
import { IVector3 } from "utilities/math/IVector";
export default function (human: Human, position: IVector3, actionName: TranslationGenerator): IVector3 | undefined;
