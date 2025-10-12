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

// --- CSV parser (simple, assumes comma-separated, no quotes) ---
function ParseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.trim());
  const rows = lines.slice(1).map(line => line.split(",").map(v => v.trim()));
  return { headers, rows };
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
            data.ammoCategoryID = String(row[index.ammo_category]);
            data.Category = String(row[index.weapon_category]);
            data.Type = String(row[index.weapon_type]);
            data.WeaponSubType = String(row[index.weapon_sub_type]);
            data.PrefabIdentifier = String(row[index.prefab_id]);
            data.WeaponEffectID = String(row[index.weapon_effect_id]);
            data.BonusValueA = String(row[index.gui_feature_a]);
            data.BonusValueB = String(row[index.gui_feature_b]);

            const icon_code = String(row[index.icon_code]);
            if (icon_code === "Ballistic") data.Description.Icon = "uixSvgIcon_weapon_Ballistic";
            else if (icon_code === "Energy") data.Description.Icon = "uixSvgIcon_weapon_Energy";
            else if (icon_code === "Missile") data.Description.Icon = "uixSvgIcon_weapon_Missile";
            else if (icon_code === "Support") data.Description.Icon = "uixSvgIcon_weapon_Support";

            let item_tags = [];
            item_tags.push( "component_type_stock" );
            item_tags.push( String(row[index.range_tag]) );
            data.ComponentTags.items = item_tags;

            const range_min = Number(row[index.range_min]);
            const range_optimal = Number(row[index.range_optimal]);
            const range_max = Number(row[index.range_max]);
            const range_splits = [range_min, range_optimal, range_max];
            data.MinRange = range_min;
            data.MaxRange = range_max;
            data.RangeSplit = range_splits;

            const specials_codes = row[index.specials_code] ? (row[index.specials_code]) : [];
            const power_drain = row[index.power_drain] ? Number(row[index.power_drain]) : null;
            SetSpecials(data, specials_codes, power_drain);

            fs.writeFileSync(f_name, JSON.stringify(data, null, 2), "utf8");
            console.log(`Wrote ${f_name}`);
        }
    });
}

function SetSpecials(data, specials_codes, power_drain) {
    if (!data) console.log("Warning: \"data\" function input parameter invalid for called function: \"SetSpecials(data)\".");

    const effects = JSON.parse(fs.readFileSync("./StatusEffects.json", "utf8"));
    const descriptions = JSON.parse(fs.readFileSync("./item_descriptions.json", "utf8"));
    let specials = [];
    let item_description = "";

    if (data.Description.Model.includes("Reaper") && data.Description.Model.includes("Auto Cannon")) item_description = descriptions.Descriptions.Reaper.join("");
    else if (data.Description.Model.includes("Death Fire") && data.Description.Model.includes("Rocket Launcher")) item_description = descriptions.Descriptions.Deathfire.join("");
    else if (data.Description.Model.includes("Enforcer")) item_description = descriptions.Descriptions.Enforcer.join("");

    // Power Drain
    if (power_drain) {
        if (power_drain > 0) data.Description.Details = ("Power Drain: " + String(-power_drain) + "\n\n") + item_description;
        else if (power_drain < 0) data.Description.Details = ("Power Generation: " + String(-power_drain) + "\n\n") + item_description;
        else data.Description.Details = item_description;

        for (let fx of effects.Effect_Power_Drain) {
            fx.statisticData.modValue = String(-power_drain);
            data.statusEffects.push(fx);
        }
    } else
        data.Description.Details = item_description;

    // Specials
    // if (specials_codes) { TODO }
}

// --- Main ---
function Main() {
    Main_Weapons(false);
}

Main();
