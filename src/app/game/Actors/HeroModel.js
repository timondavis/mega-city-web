"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var cm_dungeon_1 = require("cm-dungeon");
var HeroModel = /** @class */ (function (_super) {
    __extends(HeroModel, _super);
    function HeroModel() {
        var _this = _super.call(this) || this;
        _this.InitializeAttributes();
        return _this;
    }
    Object.defineProperty(HeroModel, "CoreAttributes", {
        get: function () { return HeroModel.coreAttributes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeroModel, "PrimaryAttributes", {
        get: function () { return HeroModel.primaryAttributes; },
        enumerable: true,
        configurable: true
    });
    HeroModel.prototype.InitializeAttributes = function () {
        var _this = this;
        Object.keys(HeroModel.PrimaryAttributes).forEach(function (key) {
            _this.attributes.add(HeroModel.PrimaryAttributes[key], 0);
        });
        Object.keys(HeroModel.CoreAttributes).forEach(function (key) {
            _this.attributes.add(HeroModel.CoreAttributes[key], 0);
        });
    };
    HeroModel.coreAttributes = {
        'STR': 'Strength',
        'DEX': 'Dexterity',
        'CON': 'Constitution',
        'WIS': 'Wisdom',
        'INT': 'Intelligence',
        'CHA': 'Charisma'
    };
    HeroModel.primaryAttributes = {
        'HP': 'Hit Points',
        'MAX_HP': 'Maximum Hit Points',
        'AC': 'Armor Class'
    };
    return HeroModel;
}(cm_dungeon_1.Character));
exports.HeroModel = HeroModel;
