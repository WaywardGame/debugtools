var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "../IDebugTools"], function (require, exports, Mod_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let Overlays = (() => {
        class Overlays {
            static isPaint(overlay) {
                return overlay.type === Overlays.DEBUG_TOOLS.overlayPaint;
            }
            static isHoverTarget(overlay) {
                return overlay.type === Overlays.DEBUG_TOOLS.overlayTarget && !("red" in overlay);
            }
            static isSelectedTarget(overlay) {
                return overlay.type === Overlays.DEBUG_TOOLS.overlayTarget && "red" in overlay;
            }
        }
        __decorate([
            Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
        ], Overlays, "DEBUG_TOOLS", void 0);
        return Overlays;
    })();
    exports.default = Overlays;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3ZlcmxheXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvb3ZlcmxheS9PdmVybGF5cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFNQTtRQUFBLE1BQXFCLFFBQVE7WUFJckIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFxQjtnQkFDMUMsT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO1lBQzNELENBQUM7WUFFTSxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQXFCO2dCQUNoRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsQ0FBQztZQUNuRixDQUFDO1lBRU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQXFCO2dCQUNuRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLElBQUksS0FBSyxJQUFJLE9BQU8sQ0FBQztZQUNoRixDQUFDO1NBQ0Q7UUFiQTtZQURDLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQzsyQ0FDTTtRQWFoRCxlQUFDO1NBQUE7c0JBZm9CLFFBQVEifQ==