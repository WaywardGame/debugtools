var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "newui/component/Button", "newui/component/Component", "newui/component/Text", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../../util/Array"], function (require, exports, Enums_1, Button_1, Component_1, Text_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, Array_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CorpseInformation extends Component_1.default {
        constructor(api) {
            super(api);
            this.corpses = [];
        }
        update(position, tile) {
            const corpses = tile.corpses || [];
            this.toggle(!!corpses.length);
            if (Array_1.areArraysIdentical(corpses, this.corpses))
                return;
            this.corpses = corpses;
            this.dump();
            for (const corpse of corpses) {
                DebugTools_1.default.LOG.info("Corpse:", corpse);
                new Text_1.Paragraph(this.api)
                    .setText(() => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.CorpseName)
                    .get(corpse.renamed, game.getName(corpse, Enums_1.SentenceCaseStyle.Title, true)))
                    .appendTo(this);
                if (corpse.type !== Enums_1.CreatureType.Blood && corpse.type !== Enums_1.CreatureType.WaterBlood) {
                    new Button_1.default(this.api)
                        .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonResurrectCorpse))
                        .on(Button_1.ButtonEvent.Activate, this.resurrect(corpse))
                        .appendTo(this);
                }
                new Button_1.default(this.api)
                    .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                    .on(Button_1.ButtonEvent.Activate, this.removeCorpse(corpse))
                    .appendTo(this);
            }
            return this;
        }
        resurrect(corpse) {
            return () => {
                actionManager.execute(localPlayer, Actions_1.default.get("heal"), { object: corpse.id });
                this.triggerSync("update");
            };
        }
        removeCorpse(corpse) {
            return () => {
                actionManager.execute(localPlayer, Actions_1.default.get("remove"), { object: [Actions_1.RemovalType.Corpse, corpse.id] });
                this.triggerSync("update");
            };
        }
    }
    __decorate([
        Objects_1.Bound
    ], CorpseInformation.prototype, "resurrect", null);
    __decorate([
        Objects_1.Bound
    ], CorpseInformation.prototype, "removeCorpse", null);
    exports.default = CorpseInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvQ29ycHNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWVBLE1BQXFCLGlCQUFrQixTQUFRLG1CQUFTO1FBRXZELFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRkosWUFBTyxHQUFjLEVBQUUsQ0FBQztRQUdoQyxDQUFDO1FBRU0sTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztZQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFOUIsSUFBSSwwQkFBa0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFBRSxPQUFPO1lBQ3RELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBRXZCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVaLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO2dCQUM3QixvQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUV2QyxJQUFJLGdCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztxQkFDckIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsVUFBVSxDQUFDO3FCQUMxRCxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSx5QkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDMUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVqQixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssb0JBQVksQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxvQkFBWSxDQUFDLFVBQVUsRUFBRTtvQkFDbEYsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7eUJBQ2xCLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLHFCQUFxQixDQUFDLENBQUM7eUJBQ2pFLEVBQUUsQ0FBQyxvQkFBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2pCO2dCQUVELElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO3FCQUNsQixPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO3FCQUM3RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDbkQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2pCO1lBRUQsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBR08sU0FBUyxDQUFDLE1BQWU7WUFDaEMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1gsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsaUJBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQy9FLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDO1FBQ0gsQ0FBQztRQUdPLFlBQVksQ0FBQyxNQUFlO1lBQ25DLE9BQU8sR0FBRyxFQUFFO2dCQUNYLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLGlCQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMscUJBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDdkcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUM7UUFDSCxDQUFDO0tBQ0Q7SUFkQTtRQURDLGVBQUs7c0RBTUw7SUFHRDtRQURDLGVBQUs7eURBTUw7SUFyREYsb0NBc0RDIn0=