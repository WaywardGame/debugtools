var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/game/ui/component/Component", "@wayward/game/ui/component/Details", "@wayward/utilities/event/EventManager", "@wayward/utilities/object/Objects"], function (require, exports, Component_1, Details_1, EventManager_1, Objects_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SingletonEditor extends Component_1.default {
        claim(by, ...args) {
            if (this.claimant?.deref() !== by) {
                this.claimant = new WeakRef(by);
                this.event.emit("claim");
                this.apply(...args);
            }
            return this;
        }
        unclaim(by) {
            const claimant = this.claimant?.deref();
            if (claimant === undefined || claimant === by) {
                delete this.claimant;
                this.event.emit("unclaim");
                const owner = this.owner?.deref();
                if (owner)
                    this.store(owner);
            }
            return this;
        }
        isValid() {
            return !this.owner || !!this.owner?.deref()?.rooted;
        }
        onRooted() {
            this.owner ??= (0, Objects_1.weakRefify)(this.getDialog() ?? this.getScreen());
        }
    }
    __decorate([
        (0, EventManager_1.OwnEventHandler)(SingletonEditor, "rooted")
    ], SingletonEditor.prototype, "onRooted", null);
    (function (SingletonEditor) {
        class Details extends Details_1.default {
            onToggle(open) {
                if (open) {
                    const editor = this.getEditor()
                        .claim(this, ...this.getArgs())
                        .appendTo(this);
                    editor.event.waitFor(["claim", "unclaim"]).then(() => this.close());
                }
                else {
                    this.getEditor().unclaim(this);
                }
            }
            onWillRemove() {
                this.getEditor().unclaim(this);
            }
            getEditor() {
                const storage = this.constructor;
                if (!storage.editor?.isValid())
                    storage.editor = this.createEditor();
                return storage.editor;
            }
        }
        __decorate([
            (0, EventManager_1.OwnEventHandler)(Details, "toggle")
        ], Details.prototype, "onToggle", null);
        __decorate([
            (0, EventManager_1.OwnEventHandler)(Details, "willRemove")
        ], Details.prototype, "onWillRemove", null);
        SingletonEditor.Details = Details;
    })(SingletonEditor || (SingletonEditor = {}));
    exports.default = SingletonEditor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2luZ2xldG9uRWRpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9TaW5nbGV0b25FZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBYUEsTUFBZSxlQUFvQyxTQUFRLG1CQUFTO1FBTzVELEtBQUssQ0FBQyxFQUFpQyxFQUFFLEdBQUcsSUFBVTtZQUM1RCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVNLE9BQU8sQ0FBQyxFQUFpQztZQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDO1lBQ3hDLElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFLENBQUM7Z0JBQy9DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7Z0JBQ2xDLElBQUksS0FBSztvQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxDQUFDO1FBQ3JELENBQUM7UUFJUyxRQUFRO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBQSxvQkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNqRSxDQUFDO0tBQ0Q7SUFIVTtRQURULElBQUEsOEJBQWUsRUFBQyxlQUFlLEVBQUUsUUFBUSxDQUFDO21EQUcxQztJQUdGLFdBQVUsZUFBZTtRQUV4QixNQUFzQixPQUE0QixTQUFRLGlCQUFXO1lBTTFELFFBQVEsQ0FBQyxJQUFhO2dCQUMvQixJQUFJLElBQUksRUFBRSxDQUFDO29CQUNWLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7eUJBQzdCLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7eUJBQzlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ3JFLENBQUM7cUJBQU0sQ0FBQztvQkFDUCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO1lBQ0YsQ0FBQztZQUdTLFlBQVk7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUVPLFNBQVM7Z0JBQ2hCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFpRCxDQUFDO2dCQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7b0JBQzdCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUV0QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDdkIsQ0FBQztTQUNEO1FBeEJVO1lBRFQsSUFBQSw4QkFBZSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7K0NBV2xDO1FBR1M7WUFEVCxJQUFBLDhCQUFlLEVBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQzttREFHdEM7UUFyQm9CLHVCQUFPLFVBOEI1QixDQUFBO0lBQ0YsQ0FBQyxFQWpDUyxlQUFlLEtBQWYsZUFBZSxRQWlDeEI7SUFFRCxrQkFBZSxlQUFlLENBQUMifQ==