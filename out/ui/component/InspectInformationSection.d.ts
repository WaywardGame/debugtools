import Component from "newui/component/Component";
import { TranslationGenerator } from "newui/component/IComponent";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
export declare type TabInformation = [number, TranslationGenerator];
export default abstract class InspectInformationSection extends Component {
    protected readonly gsapi: IGameScreenApi;
    private shouldLog;
    readonly willLog: boolean;
    constructor(gsapi: IGameScreenApi);
    setTab(tab: number): this;
    setShouldLog(): void;
    resetWillLog(): void;
    abstract getTabs(): TabInformation[];
    abstract update(position: IVector2, tile: ITile): void;
    abstract logUpdate(): void;
}
