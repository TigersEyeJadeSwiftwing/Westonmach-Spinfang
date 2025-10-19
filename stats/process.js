const fs = require("fs");
const path = require("path");

// Hard-coded input/output folders
const folder_input = "./";
const folder_root = "../";
const folder_ammobox = "../ammunitionBox/generated/";
const folder_weapons = "../weapon/generated/";
const folder_heatsinks = "../heatsinks/generated/";
const folder_jumpjets = "../jumpjets/generated/";
const folder_upgrades = "../upgrades/generated/";

// File names
const csv_ammobox = path.join(folder_input, "ammo_box.csv");
const json_ammobox = path.join(folder_input, "ammo_box.json");
const csv_weapons = path.join(folder_input, "weapon.csv");
const json_weapons = path.join(folder_input, "weapon.json");
const csv_heatsinks = path.join(folder_input, "heatsinks.csv");
const json_heatsinks = path.join(folder_input, "heatsinks.json");
const csv_jumpjets = path.join(folder_input, "jumpjets.csv");
const json_jumpjets = path.join(folder_input, "jumpjets.json");
const csv_upgrades = path.join(folder_input, "upgrades.csv");
const json_upgrades = path.join(folder_input, "upgrades.json");

var Effects = [];
var ItemDescriptions = [];
var IconList = [];

/** Makes a deep copy of any object.  Doesn't copy functions, just data.
 * @return {object} A deep copy of the input object.
 */
Object.defineProperty(Object.prototype,'Deep',{value:function(){return JSON.parse(JSON.stringify(this));},enumerable:false});

// --- CSV parser (simple, assumes comma-separated, no quotes) ---
function ParseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map(h => h.trim());
    const rows = lines.slice(1).map(line => line.split(",").map(v => v.trim()));

    return { headers, rows };
}

function ParseListOfEffects() {
    const Effects0 = JSON.parse(fs.readFileSync("./StatusEffects_equip_buff.json", "utf8")).List.filter( fx => fx[0].Mod_WS_EquipEffect_ID !== "START" ).filter( fx => fx[0].Mod_WS_EquipEffect_ID !== "END" );
    const Effects1 = JSON.parse(fs.readFileSync("./StatusEffects_equip_debuff.json", "utf8")).List.filter( fx => fx[0].Mod_WS_EquipEffect_ID !== "START" ).filter( fx => fx[0].Mod_WS_EquipEffect_ID !== "END" );
    const Effects2 = JSON.parse(fs.readFileSync("./StatusEffects_weapon_hit.json", "utf8")).List.filter( fx => fx[0].Mod_WS_EquipEffect_ID !== "START" ).filter( fx => fx[0].Mod_WS_EquipEffect_ID !== "END" );

    Effects = Effects0.concat(Effects1, Effects2).Deep();
}

function ParseListOfItemDescriptions() {
    ItemDescriptions = JSON.parse(fs.readFileSync("./item_descriptions.json", "utf8"));
}

function ParseListOfIcons() {
    IconList = JSON.parse(fs.readFileSync("./icons.json", "utf8"));
}

function GetIcon(text) {
    if (IconList.length < 1)
        ParseListOfIcons();

    const list = IconList.filter( (icon) => icon.includes(String(text)) );

    if (list.length < 1)
        return "uixSvgIcon_Generic";

    return list[0];
}

function FindEquipmentEffect(tag, value, duration=null, stack=null) {
    if (Effects.length < 1)
        ParseListOfEffects();

    let effect = Effects.find( (fx) => fx[0].Mod_WS_EquipEffect_ID === tag );

    if (effect) {
        let fx = effect.Deep();
        let resulting_effect = [];

        for (let i = 1; i < fx.length; i++) {
            if (value)
                fx[i].statisticData.modValue = value;
            if (duration)
                fx[i].durationData.duration = duration;
            if (stack)
                fx[i].durationData.stackLimit = stack;

            resulting_effect.push(fx[i]);
        }

        return resulting_effect;
    }

    console.log("Error: No Battlemech Equipment Effect was found in Effects with a matching ID of: " + tag);
    return null;
}

function Main_Weapons(diag=false) {
    const output_folder = folder_weapons;
    const fext = ".json";

    // Load files
    const json_template = JSON.parse(fs.readFileSync(json_weapons, "utf8"));
    const csv_text = fs.readFileSync(csv_weapons, "utf8");
    const { headers, rows } = ParseCSV(csv_text);

    if (diag == true) {
        const t_data = { headers, rows };
        const tf_name = path.join(folder_input, "test_weapons.json");
        fs.writeFileSync(tf_name, JSON.stringify(t_data, null, 2), "utf8");
    }

    rows.forEach((row, idx) => {
        const i_name = String(headers.indexOf("Name"));
        const e_name = i_name ? row[i_name] : null;
        const i_tons = Number(headers.indexOf("Tonnage"));
        const e_tons = i_tons ? row[i_tons] : null;
        const i_cost = Number(headers.indexOf("Cost"));
        const e_cost = i_cost ? row[i_cost] : null;

        if (e_name && e_tons && e_cost) {
            // Clone template
            let data = JSON.parse(JSON.stringify(json_template));

            const d_name = ("Weapon_").concat(e_name.replaceAll("Burst Fire", "BF").replaceAll(" ", "_"));
            // const f_name = path.join(folder_input, "test.json");
            const f_name = path.join(output_folder, d_name.concat(fext));

            let index = {};
            index.name = Number(headers.indexOf("Name"));
            index.type = Number(headers.indexOf("Type"));
            index.level = Number(headers.indexOf("Level"));
            index.tonnage = Number(headers.indexOf("Tonnage"));
            index.power_drain = Number(headers.indexOf("Power Drain"));
            index.equip_slots = Number(headers.indexOf("Equip Slots"));
            index.damage_regular = Number(headers.indexOf("Damage Regular"));
            index.damage_heat = Number(headers.indexOf("Damage Heat"));
            index.damage_stability = Number(headers.indexOf("Damage Stability"));
            index.total_damsge_regular = Number(headers.indexOf("Total Damage Regular"));
            index.total_damsge_heat = Number(headers.indexOf("Total Damage Heat"));
            index.total_damsge_stability = Number(headers.indexOf("Total Damage Stability"));
            index.num_shots = Number(headers.indexOf("Number of Shots"));
            index.range_min = Number(headers.indexOf("Range Min"));
            index.range_optimal = Number(headers.indexOf("Range Optimal"));
            index.range_max = Number(headers.indexOf("Range Max"));
            index.total_heat_generated = Number(headers.indexOf("Heat Gen"));
            index.critical_chance = Number(headers.indexOf("Critical Chance"));
            index.cost = Number(headers.indexOf("Cost"));
            index.accuracy = Number(headers.indexOf("Accuracy"));
            index.projectiles_per_shot = Number(headers.indexOf("Projectiles per Shot"));
            index.attack_recoil = Number(headers.indexOf("Attack Recoil"));
            index.refire_modifier = Number(headers.indexOf("Refire Modifier"));
            index.indirect_fire = Number(headers.indexOf("Indirect Fire"));
            index.ammo_category = Number(headers.indexOf("Ammo Category"));
            index.range_tag = Number(headers.indexOf("Range Tag"));
            index.weapon_category = Number(headers.indexOf("Weapon Category"));
            index.weapon_type = Number(headers.indexOf("Weapon Type"));
            index.weapon_sub_type = Number(headers.indexOf("Weapon Sub Type"));
            index.prefab_id = Number(headers.indexOf("Prefab ID"));
            index.weapon_effect_id = Number(headers.indexOf("Weapon Effect ID"));
            index.gui_feature_a = Number(headers.indexOf("GUI Feature A"));
            index.gui_feature_b = Number(headers.indexOf("GUI Feature B"));
            index.specials_code = Number(headers.indexOf("Specials Code"));
            index.icon_code = Number(headers.indexOf("Icon Code"));
            index.weapon_model_name = Number(headers.indexOf("Weapon Model Name"));

            const item_type = row[index.type] ? Number(row[index.type]) : 1;
            const item_level = row[index.level] ? Number(row[index.level]) : 1;

            data.Description.Cost = Number(row[index.cost]);
            data.Description.Id = d_name;
            data.Description.Name = row[index.name];
            data.Description.UIName = row[index.name];
            data.Description.Model = row[index.weapon_model_name];
            data.Tonnage = Number(row[index.tonnage]);
            data.InventorySize = Number(row[index.equip_slots]);
            data.Damage = Number(row[index.damage_regular]);
            data.HeatDamage = Number(row[index.damage_heat]);
            data.Instability = Number(row[index.damage_stability]);
            data.ShotsWhenFired = Number(row[index.num_shots]);
            data.HeatGenerated = Number(row[index.total_heat_generated]);
            data.CriticalChanceMultiplier = Number(row[index.critical_chance]);
            data.AccuracyModifier = Number(row[index.accuracy]);
            data.ProjectilesPerShot = Number(row[index.projectiles_per_shot]);
            data.AttackRecoil = Number(row[index.attack_recoil]);
            data.RefireModifier = Number(row[index.refire_modifier]);
            data.IndirectFireCapable = (String(row[index.indirect_fire]) === "TRUE") ? true : false;
            data.ammoCategoryID = row[index.ammo_category] ? String(row[index.ammo_category]) : "NotSet";
            data.WeaponSubType = String(row[index.weapon_sub_type]);
            data.PrefabIdentifier = String(row[index.prefab_id]);
            data.WeaponEffectID = ("WeaponEffect-Weapon_").concat( String(row[index.weapon_effect_id]) );
            data.BonusValueA = String(row[index.gui_feature_a]);
            data.BonusValueB = String(row[index.gui_feature_b]);

            const weapon_category = String(row[index.weapon_category]);
            data.Category = weapon_category;
            if (weapon_category === "Missle") data.Category = "Missile";
            if (weapon_category === "Support") data.Category = "AntiPersonnel";

            const weapon_type = String(row[index.weapon_type]);
            data.Type = weapon_type;
            if (weapon_type === "AC") data.Type = "Autocannon";
            if (weapon_type === "MG") data.Type = "MachineGun";

            const icon_code = String(row[index.icon_code]);
            if (icon_code === "Ballistic") data.Description.Icon = "uixSvgIcon_weapon_Ballistic";
            else if (icon_code === "Energy") data.Description.Icon = "uixSvgIcon_weapon_Energy";
            else if (icon_code === "Missile") data.Description.Icon = "uixSvgIcon_weapon_Missile";
            else if (icon_code === "Support") data.Description.Icon = "uixSvgIcon_weapon_Support";
            else data.Description.Icon = GetIcon(icon_code);

            let item_tags = [];
            if (item_type == 5) {
                item_tags.push( "component_type_variant" );
                item_tags.push( "component_type_variant3" );
            }
            else if (item_type == 4) {
                item_tags.push( "component_type_variant" );
                item_tags.push( "component_type_variant2" );
            }
            else if (item_type == 3) {
                item_tags.push( "component_type_variant" );
                item_tags.push( "component_type_variant1" );
            }
            else
                item_tags.push( "component_type_stock" );
            const range_tag = String(row[index.range_tag]);
            if (range_tag === "close") item_tags.push( "range_close" );
            else if (range_tag === "standard") item_tags.push( "range_standard" );
            else if (range_tag === "long") item_tags.push( "range_long" );
            else if (range_tag === "very-long") item_tags.push( "range_very-long" );
            else if (range_tag === "extreme") item_tags.push( "range_extreme" );
            else if (range_tag === "short") item_tags.push( "range_close" );
            else if (range_tag === "medium") item_tags.push( "range_standard" );
            else if (range_tag === "far") item_tags.push( "range_long" );
            else item_tags.push( range_tag );
            data.ComponentTags.items = item_tags;

            const range_min = Number(row[index.range_min]);
            const range_optimal = Number(row[index.range_optimal]);
            const range_max = Number(row[index.range_max]);
            const range_splits = [range_min, range_optimal, range_max];
            data.MinRange = range_min;
            data.MaxRange = range_max;
            data.RangeSplit = range_splits;

            const specials_codes = row[index.specials_code] ? String(row[index.specials_code]) : null;
            const power_drain = row[index.power_drain] ? Number(row[index.power_drain]) : null;
            SetSpecials(data, specials_codes, power_drain);

            fs.writeFileSync(f_name, JSON.stringify(data, null, 2), "utf8");
            console.log(`Wrote ${f_name}`);
        }
    });
}

function ParseSpecials(codes) {
    let specials = [];
    if (!codes) return specials;
    if (codes.length < 1) return specials;

    const special_template = { ID:"", value:0, duration:-1, stack:-1 };
    let special = special_template.Deep();
    let pos = 0;
    let text = "";

    for (let i = 0; i < codes.length; i++) {
        const tchar = codes[i].Deep();
        if (tchar === "`") {
            if (pos == 0) special.ID = text.Deep();
            else if (pos == 1) special.value = Number(text);
            else if (pos == 2) special.duration = Number(text);
            else if (pos == 3) special.stack = Number(text);

            text = "";
            pos += 1;
        }
        else if (tchar === " ") {
            if (pos == 0) special.ID = text.Deep();
            else if (pos == 1) special.value = Number(text);
            else if (pos == 2) special.duration = Number(text);
            else if (pos == 3) special.stack = Number(text);

            text = "";
            pos = 0;
            specials.push(special.Deep());
            special = special_template.Deep();
        }
        else
            text = text.concat(tchar);

        if (i == (codes.length - 1)) {
            if (pos == 0) special.ID = text.Deep();
            else if (pos == 1) special.value = Number(text);
            else if (pos == 2) special.duration = Number(text);
            else if (pos == 3) special.stack = Number(text);

            specials.push(special.Deep());
        }
    }

    return specials;
}

function SetSpecials(data, specials_codes, power_drain) {
    if (!data) console.log("Warning: \"data\" function input parameter invalid for called function: \"SetSpecials(data)\".");

    let item_description = "";

    if (data.Description.Model.includes("Reaper") && data.Description.Model.includes("Auto Cannon")) {
        if (data.Description.Model.includes("Light") || data.Description.Model.includes("Medium") || data.Description.Model.includes("Heavy"))
            item_description = ItemDescriptions.Descriptions.Reaper_Basic.join("");
        else if (data.Description.Model.includes("Sniper"))
            item_description = ItemDescriptions.Descriptions.Reaper_Sniper.join("");
        else if (data.Description.Model.includes("Ultra"))
            item_description = ItemDescriptions.Descriptions.Reaper_Ultra.join("");
        else if (data.Description.Model.includes("BF Light") || data.Description.Model.includes("BF Medium") || data.Description.Model.includes("BF Heavy"))
            item_description = ItemDescriptions.Descriptions.Reaper_BF.join("");
    }
    else if (data.Description.Model.includes("Death Fire") && data.Description.Model.includes("Rocket Launcher")) item_description = ItemDescriptions.Descriptions.Deathfire.join("");
    else if (data.Description.Model.includes("Viper Nine") && data.Description.Model.includes("Rocket Launcher")) item_description = ItemDescriptions.Descriptions.Viper_Nine.join("");
    else if (data.Description.Model.includes("Enforcer") && data.Description.Model.includes("Machine Gun")) item_description = ItemDescriptions.Descriptions.Enforcer.join("");
    else if (data.Description.Model.includes("Multi-Frequency") && data.Description.Model.includes("Laser")) item_description = ItemDescriptions.Descriptions.MF_Laser.join("");

    // Power Drain
    if (power_drain) {
        if (power_drain > 0) {
            const m_value = 1.0 + (Number(power_drain) / 500.0);
            const m_value_div = 100.0 / m_value;

            data.Description.Details = ("Armor Penalty: " + m_value_div.toFixed(3) + "%\n\n") + item_description;

            const fx = FindEquipmentEffect("AMRPN", m_value);
            if (fx) data.statusEffects = fx;
        }
        else if (power_drain < 0) {
            const m_value = 1.0 + (Number(power_drain) / 500.0);
            const m_value_neg = 1.0 + (Number(power_drain) * -1.0 / 500.0);
            const m_value_div = 100.0 / m_value;

            data.Description.Details = ("Armor Penalty Relief: " + m_value_div.toFixed(3) + "%\n\n") + item_description;

            const fx = FindEquipmentEffect("AMRPN", m_value_neg);
            if (fx) data.statusEffects = fx;
        }
        else
            data.Description.Details = item_description;
    } else {
        data.statusEffects = [];
        data.Description.Details = item_description;
    }

    // Specials
    if (specials_codes) {
        const specials = ParseSpecials(specials_codes);

        console.log(specials);

        for (const special of specials) {
            const effects = FindEquipmentEffect(special.ID, special.value, special.duration, special.stack);

            if (effects.length > 0) {
                for (const effect of effects)
                    data.statusEffects.push(effect);
            }
        }
    }
}

// --- Main ---
function Main() {
    ParseListOfIcons();
    ParseListOfEffects();
    ParseListOfItemDescriptions();

    Main_Weapons(false);
}

Main();
