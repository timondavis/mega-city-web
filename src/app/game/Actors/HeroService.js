"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HeroModel_1 = require("./HeroModel");
var cm_check_1 = require("cm-check");
var HeroService = /** @class */ (function () {
    function HeroService() {
    }
    HeroService.GenerateRandom = function () {
        var hero = new HeroModel_1.HeroModel();
        Object.keys(HeroModel_1.HeroModel.CoreAttributes).forEach(function (key) {
            hero.attributes.replace(HeroModel_1.HeroModel.CoreAttributes[key], HeroService.Roll3d6());
        });
        Object.keys(HeroModel_1.HeroModel.PrimaryAttributes).forEach(function (key) {
            hero.attributes.replace(HeroModel_1.HeroModel.PrimaryAttributes[key], HeroService.Roll3d6());
        });
        return hero;
    };
    HeroService.Roll3d6 = function () {
        var statRoll = new cm_check_1.DieBag();
        statRoll.add(3, 6);
        return statRoll.getTotal();
    };
    return HeroService;
}());
exports.HeroService = HeroService;
