const fs = require("fs");
const path = require("path");

/** Makes a deep copy of any object.  Doesn't copy functions, just data.
 * @return {object} A deep copy of the input object.
 */
Object.defineProperty(
    Object.prototype,'Deep',{
        value:function(){
            return JSON.parse( JSON.stringify(this) );
        },
        enumerable:false
    }
);

let Effects = [];
let ItemDescriptions = [];
let IconList = [];
let console_output = [];
let console_index_count = 0;
let log_file = "";
let hrtime_0, hrtime_1 = null;

// Hard-coded input/output folders
const folder_input = "./";
const folder_root = "../";
const folder_ammobox = "../ammunitionBox/generated/";
const folder_ammobox_game = "../ammunitionBox/game/";
const folder_ammobox_skirmish = "../ammunitionBox/skirmish/";
const folder_weapons = "../weapon/generated/";
const folder_weapons_game = "../weapon/game/";
const folder_weapons_skirmish = "../weapon/skirmish/";
const folder_heatsinks = "../heatsinks/generated/";
const folder_heatsinks_game = "../heatsinks/game/";
const folder_heatsinks_skirmish = "../heatsinks/skirmish/";
const folder_jumpjets = "../jumpjets/generated/";
const folder_jumpjets_game = "../jumpjets/game/";
const folder_jumpjets_skirmish = "../jumpjets/skirmish/";
const folder_upgrades = "../upgrades/generated/";
const folder_upgrades_game = "../upgrades/game/";
const folder_upgrades_skirmish = "../upgrades/skirmish/";
const folder_pilot_skirmish = "../pilot/skirmish/";
const folder_pilot_face_sprites = "../sprites_pilots/";

// File names
const csv_ammobox = path.join(folder_input, "ammo_box.csv");
const json_ammobox = path.join(folder_input, "ammo_box_template.json");
const csv_weapons = path.join(folder_input, "weapon.csv");
const json_weapons = path.join(folder_input, "weapon.json");
const csv_heatsinks = path.join(folder_input, "heatsinks.csv");
const json_heatsinks = path.join(folder_input, "heatsinks.json");
const csv_jumpjets = path.join(folder_input, "jumpjets.csv");
const json_jumpjets = path.join(folder_input, "jumpjets.json");
const csv_upgrades = path.join(folder_input, "equipment.csv");
const json_upgrades = path.join(folder_input, "equipment_template.json");
const csv_pilot_skirmish = path.join(folder_input, "pilot_skirmish.csv");
const json_pilot_skirmish = path.join(folder_input, "pilot_skirmish_template.json");

const EmptyFolder = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        Log("Cleaning folder: \"" + folderPath + "\"...");
        fs.rmSync(folderPath, { recursive: true, force: true });
        fs.mkdirSync(folderPath);
    }
    else {
        Log("Error: Attempted to clean non-existant folder: \"" + folderPath + "\".");
    }
};

function ConsolidateJsonFiles(path_input, filename_output, empty_source_folder) {
    return;

    Log("");

    let output_file = [];
    Log("Consolidating JSON files from \"" + path_input + "\" to \"" + filename_output + "\".");
    Log("");

    fs.readdirSync(path_input).forEach(file => {
        const input = JSON.parse( fs.readFileSync( path_input + String(file), "utf8") );

        if (input) {
            output_file.push(input);
            Log("Added \"" + file + "\".");
        } else {
            Log("Error adding file \"" + file + "\".");
        }
    });

    fs.writeFileSync(filename_output, JSON.stringify(output_file, null, 2), "utf8");
    Log("Wrote file: " + filename_output);
    if (empty_source_folder) {
        EmptyFolder(path_input);
        Log("Cleared contents of source folder: " + path_input);
    }

    FlushConsole();
};

function EquipDescValue(input, digits) {
    const input_number = Number(input);
    const input_digits = Number(digits);

    if (typeof input_number !== "number") return "INVALID_VALUE";
    if (typeof input_digits !== "number") return "INVALID_DIGITS";

    const sign_text = input_number < 0 ? "" : "+";
    const value_text = input_number.toFixed(input_digits);

    return sign_text + value_text;
}

function Log_Start() {
    Log("process.js, started:");
    hrtime_0 = process.hrtime();
    Log("Seconds: " + hrtime_0[0].toLocaleString(0) + ", Nanoseconds: " + hrtime_0[1].toLocaleString(0));
    Log( new Date().toString() );
    Log("");

    FlushConsole();
}

function Log_End() {
    FlushConsole();

    Log("process.js, completed:");
    hrtime_1 = process.hrtime();
    Log("Seconds: " + hrtime_1[0].toLocaleString(0) + ", Nanoseconds: " + hrtime_1[1].toLocaleString(0));
    Log( new Date().toString() );
    Log("Writing output to log file: \"process js log.txt\"...");
    const time_0 = (hrtime_0[0] * 1e9) + hrtime_0[1];
    const time_1 = (hrtime_1[0] * 1e9) + hrtime_1[1];
    const time = time_1 - time_0;
    const elapsed_seconds = Math.floor(time / 1e9);
    const elapsed_nanoseconds = time - (elapsed_seconds * 1e9);
    Log("Elapsed program run-time, Seconds: " + elapsed_seconds.toLocaleString(0) + ", Nanoseconds: " + elapsed_nanoseconds.toLocaleString(0) + "\n");
    Log("");

    FlushConsole();

    try {
        fs.writeFileSync("process js log.txt", log_file);
    } catch (err) {
        console.error(err);
    }
}

function Log(txt) {
    console_output.push(txt);
    console_index_count = 0;
}

function FlushConsole() {
    if (console_index_count > 1) {
        console_output = [];

        return;
    }

    const output = console_output.join("\n");
    console.log(output);

    // for (const line of output)
        log_file = log_file.Deep() + String(output) + "\n";

    console_output = [];
    console_index_count++;
}

function ClearDirs() {
    EmptyFolder(folder_ammobox);
    EmptyFolder(folder_ammobox_game);
    EmptyFolder(folder_ammobox_skirmish);
    EmptyFolder(folder_weapons);
    EmptyFolder(folder_weapons_game);
    EmptyFolder(folder_weapons_skirmish);
    EmptyFolder(folder_heatsinks);
    EmptyFolder(folder_heatsinks_game);
    EmptyFolder(folder_heatsinks_skirmish);
    EmptyFolder(folder_jumpjets);
    EmptyFolder(folder_jumpjets_game);
    EmptyFolder(folder_jumpjets_skirmish);
    EmptyFolder(folder_upgrades);
    EmptyFolder(folder_upgrades_game);
    EmptyFolder(folder_upgrades_skirmish);
    EmptyFolder(folder_pilot_skirmish);
}

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

    if (text === "Ballistic") return "uixSvgIcon_weapon_Ballistic";
    else if (text === "Energy") return "uixSvgIcon_weapon_Energy";
    else if (text === "Missile") return "uixSvgIcon_weapon_Missile";
    else if (text === "Missle") return "uixSvgIcon_weapon_Missile";
    else if (text === "Support") return "uixSvgIcon_weapon_Support";
    else if (text === "Generic") return "uixSvgIcon_equipment_Generic";
    else if (text === "General") return "uixSvgIcon_equipment_Generic";

    const list = IconList.filter( (icon) => icon.includes(String(text)) );

    if (list.length < 1)
        return "uixSvgIcon_Generic";

    return list[0];
}

function GetManufacturer(code) {
    if (!code) return "MISSING";

    if (code === "WS") return "Westonmach";
    if (code === "SF") return "Spinfang";
    if (code === "GR") return "Gralthler";
    if (code === "GN") return "Generic";

    return "MISSING";
}

function FindEquipmentEffect_old(tag, value, duration=null, stack=null) {
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

    Log("Error: No Battlemech Equipment Effect was found in Effects with a matching ID of: " + tag);
    FlushConsole();
    return null;
}

function FindEquipmentEffect(tag, value) {
    if (Effects.length < 1)
        ParseListOfEffects();

    let effect = Effects.find( (fx) => fx[0].Mod_WS_EquipEffect_ID === tag );

    if (effect) {
        let fx = effect.Deep();

        let effect_text = "";
        if (fx[0].Prepend) {
            const prepend_data = fx[0].Prepend.Deep();

            for (let i = 0; i < prepend_data.length; i++) {
                const data_text = prepend_data[i].Text;
                const data_type = prepend_data[i].Data_Type;
                const data_digits = Number(prepend_data[i].Digits);
                const data_value = value;
                const data_duration = fx[1].durationData.duration;
                const data_stack = fx[1].durationData.stackLimit;

                let effect_text_line = data_text + "\n";
                if (data_type === "float") effect_text_line = data_text + data_value.toFixed(data_digits) + ".";
                else if (data_type === "neg_float") effect_text_line = data_text + (-1 * data_value).toFixed(data_digits) + ".";
                else if (data_type === "int") effect_text_line = data_text + data_value.toFixed(0) + ".";
                else if (data_type === "neg_int") effect_text_line = data_text + (-1 * data_value).toFixed(0) + ".";
                else if (data_type === "modifier") effect_text_line = data_text + EquipDescValue(data_value, data_digits) + ".";
                else if (data_type === "neg_modifier") effect_text_line = data_text + EquipDescValue(-1 * data_value, data_digits) + ".";
                else if (data_type === "percent") effect_text_line = data_text + (data_value * 100.0).toFixed(data_digits) + "%.";
                else if (data_type === "one_div_percent") effect_text_line = data_text + (100.0 / data_value).toFixed(data_digits) + "%.";
                else if (data_type === "meters") effect_text_line = data_text + EquipDescValue(data_value, data_digits) + " meters.";
                else if (data_type === "effect_duration") effect_text_line = data_text + (data_duration).toFixed(0) + " turns.";
                else if (data_type === "stack_limit") effect_text_line = data_text + (data_stack).toFixed(0) + "x.";

                effect_text = effect_text.Deep() + effect_text_line.Deep() + "\n";
            }
        }

        let effect_data = [];
        for (let i = 1; i < fx.length; i++) {
            if (value)
                fx[i].statisticData.modValue = value;

            effect_data.push(fx[i]);
        }

        return { info:effect_text, data:effect_data };
    }

    Log("Error: No Battlemech Equipment Effect was found in Effects with a matching ID of: " + tag);
    FlushConsole();
    return null;
}

function Main_AmmoBoxes(diag=false) {
    const output_folder = folder_ammobox;
    const output_folder_skirmish = folder_ammobox_skirmish;
    const output_folder_game = folder_ammobox_game;
    const input_json = json_ammobox;
    const input_csv = csv_ammobox;
    const filename_ext = ".json";

    // Load files
    const json_template = JSON.parse(fs.readFileSync(input_json, "utf8"));
    const csv_text = fs.readFileSync(input_csv, "utf8");
    const { headers, rows } = ParseCSV(csv_text);
    let item_description = "";

    FlushConsole();

    rows.forEach((row, idx) => {
        const index_name = String(headers.indexOf("Name"));
        const index_type = Number(headers.indexOf("Type"));
        const index_tons = Number(headers.indexOf("Tonnage"));
        const index_cost = Number(headers.indexOf("Cost"));
        const index_model_name = Number(headers.indexOf("Model Name"));

        if (!index_name || !index_type || !index_tons || !index_cost || !index_model_name) {
            Log("ERROR: CSV file for input file " + csv_text + " cannot be read, parsed, or is not formatted as expected.");
            FlushConsole();

            return;
        }

        const element_name = row[index_name] ? String(row[index_name]) : "";
        const element_type = row[index_type] ? row[index_type] : null;
        const element_tons = row[index_tons] ? Number(row[index_tons]) : -1;
        const element_cost = row[index_cost] ? Number(row[index_cost]) : -1;
        const element_model_name = row[index_model_name] ? String(row[index_model_name]) : "";

        if (element_name === "Description:") {
            FlushConsole();
            item_description = row[index_type] ?
                String(row[index_type]).replaceAll("````", "    ").replaceAll("`", ",").replaceAll("’", "\'").replaceAll("\\n\\n", "\n\n") : "";

            Log("Row Index: " + String(idx) +  ", Description:");
            Log(item_description);
        }
        else if (element_name && element_tons>=0 && element_cost>=0) {
            let data = json_template.Deep();

            const item_name = element_name.Deep().replaceAll("Burst Fire", "BF");
            const file_name_base = ("AmmunitionBox_WS_").concat(element_name.Deep().replaceAll("Burst Fire", "BF").replaceAll(" ", "_"));
            const file_name_game = String(output_folder_game) + String(file_name_base) + "_game" + String(filename_ext);
            const file_name_skirmish = String(output_folder_skirmish) + String(file_name_base) + "_skirmish" + String(filename_ext);

            let index = {};
            index.name = String(headers.indexOf("Name"));
            index.type = Number(headers.indexOf("Type"));
            index.level = Number(headers.indexOf("Level"));
            index.tonnage = Number(headers.indexOf("Tonnage"));
            index.drain = Number(headers.indexOf("Drain"));
            index.equip_slots = Number(headers.indexOf("Equip Slots"));
            index.cost = Number(headers.indexOf("Cost"));
            index.gui_feature_a = Number(headers.indexOf("GUI Feature A"));
            index.gui_feature_b = Number(headers.indexOf("GUI Feature B"));
            index.specials_codes = Number(headers.indexOf("Specials Codes"));
            index.icon_code = Number(headers.indexOf("Icon Code"));
            index.capacity = Number(headers.indexOf("Capacity"));
            index.shots_per_attack = Number(headers.indexOf("Shots Per Attack"));
            index.ammo_id = Number(headers.indexOf("Ammo ID"));
            index.can_explode = Number(headers.indexOf("Can Explode"));
            index.manufacturer = Number(headers.indexOf("Manf. Code"));
            index.model_name = Number(headers.indexOf("Model Name"));

            const item_type = row[index.type] ? Number(row[index.type]) : 1;
            const item_level = row[index.level] ? Number(row[index.level]) : 1;
            const item_capacity = Number(row[index.capacity]);
            const item_shots_per_attack = Number(row[index.shots_per_attack]);
            const item_attacks_per_item = Math.floor(item_capacity / item_shots_per_attack);
            const item_description_prepend =
                item_shots_per_attack == 1 ?
                    "Capacity: " + String(item_capacity) + "\n" :
                    "Capacity: " + String(item_capacity) + "\n" +
                    "Cartridges or Rounds per Firing: " + String(item_shots_per_attack) + "\n" +
                    "Number of Firings: " + String(item_attacks_per_item) + "\n";

            const item_tags = [ "component_type_stock" ];
            const item_tags_story = item_tags.concat( ["BLACKLISTED"] ).Deep();
            const item_tags_skirmish = item_tags.Deep();

            data.Description.Name = item_name;
            data.Description.UIName = item_name;
            data.Description.Id = String(file_name_base) + "_placeholder";
            data.Description.Model = String(row[index.model_name]);
            data.Description.Cost = Number(row[index.cost]);
            data.Description.Icon = GetIcon( String(row[index.icon_code]) );
            data.Description.Manufacturer = GetManufacturer( String(row[index.manufacturer]) );
            data.Description.Details = "";
            data.Tonnage = Number(row[index.tonnage]);
            data.InventorySize = Number(row[index.equip_slots]);
            data.BonusValueA = String(row[index.gui_feature_a]);
            data.BonusValueB = String(row[index.gui_feature_b]);
            data.Capacity = Number(row[index.capacity]);
            data.AmmoID = String(row[index.ammo_id]);
            data.CanExplode = String(row[index.can_explode]) === "TRUE" ? true : false;

            const specials_codes = row[index.specials_codes] ? String(row[index.specials_codes]) : null;
            const drain = row[index.drain] ? String(row[index.drain]) : null;
            SetSpecials(data, specials_codes, drain);

            data.Description.Details = item_description_prepend.Deep() + data.Description.Details.Deep() + item_description.Deep();

            let data_story = data.Deep();
            data_story.Description.Id = String(file_name_base) + "_game";
            data_story.ComponentTags.items = item_tags_story;
            let data_skirmish = data.Deep();
            data_skirmish.Description.Id = String(file_name_base) + "_skirmish";
            data_skirmish.ComponentTags.items = item_tags_skirmish;
            data_skirmish.Description.Cost = 0;

            fs.writeFileSync(file_name_game, JSON.stringify(data_story, null, 2), "utf8");
            fs.writeFileSync(file_name_skirmish, JSON.stringify(data_skirmish, null, 2), "utf8");
            Log("Wrote file: " + file_name_game + "\nWrote file: " + file_name_skirmish);
        } else {
            FlushConsole();
        }

        FlushConsole();
    });

    ConsolidateJsonFiles(output_folder_skirmish, output_folder + "ammoboxes_skirmish.json", true);
    ConsolidateJsonFiles(output_folder_game, output_folder + "ammoboxes_game.json", true);
}

function Main_Weapons(diag=false) {
    const output_folder = folder_weapons;
    const output_folder_skirmish = folder_weapons_skirmish;
    const output_folder_game = folder_weapons_game;
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

    FlushConsole();
    Log("Weapons:");

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
            const f_name_game = path.join(output_folder_game, d_name.concat(fext));
            const f_name_skirmish = path.join(output_folder_skirmish, d_name.concat("_skirmish", fext));

            let index = {};
            index.name = String(headers.indexOf("Name"));
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
            index.manufacturer = Number(headers.indexOf("Manf. Code"));
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

            data.Description.Icon = GetIcon( String(row[index.icon_code]) );
            data.Description.Manufacturer = GetManufacturer( String(row[index.manufacturer]) );

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

            const range_tag_input = String(row[index.range_tag]);
            let range_tag = "";
            if (range_tag_input === "close") range_tag = "range_close";
            else if (range_tag_input === "standard") range_tag = "range_standard";
            else if (range_tag_input === "long") range_tag = "range_long";
            else if (range_tag_input === "very-long") range_tag = "range_very-long";
            else if (range_tag_input === "extreme") range_tag = "range_extreme";
            else if (range_tag_input === "short") range_tag = "range_close";
            else if (range_tag_input === "medium") range_tag = "range_standard";
            else if (range_tag_input === "far") range_tag = "range_long";

            item_tags.push( range_tag );
            const item_tags_skirmish = [ "component_type_stock", range_tag.Deep() ];
            data.ComponentTags.items = item_tags.Deep();
            data.ComponentTags.items.push( "BLACKLISTED" );

            const range_min = Number(row[index.range_min]);
            const range_optimal = Number(row[index.range_optimal]);
            const range_max = Number(row[index.range_max]);
            const range_splits = [range_min, range_optimal, range_max];
            data.MinRange = range_min;
            data.MaxRange = range_max;
            data.RangeSplit = range_splits;

            const specials_codes = row[index.specials_code] ? String(row[index.specials_code]) : null;
            const power_drain = row[index.power_drain] ? String(row[index.power_drain]) : null;
            SetSpecials(data, specials_codes, power_drain);

            let data_skirmish = data.Deep();
            data_skirmish.ComponentTags.items = item_tags_skirmish.Deep();
            data_skirmish.Description.Id = data_skirmish.Description.Id.Deep() + "_skirmish";
            data_skirmish.Description.Cost = 0;

            fs.writeFileSync(f_name_game, JSON.stringify(data, null, 2), "utf8");
            fs.writeFileSync(f_name_skirmish, JSON.stringify(data_skirmish, null, 2), "utf8");
            Log("Wrote file: " + f_name_game + "\nWrote file: " + f_name_skirmish);
        } else {
            FlushConsole();
        }

        FlushConsole();
    });

    ConsolidateJsonFiles(output_folder_skirmish, output_folder + "weapons_skirmish.json", true);
    ConsolidateJsonFiles(output_folder_game, output_folder + "weapons_game.json", true);
}

function Main_Pilots_Skirmish(diag=false) {
    const output_folder_skirmish = folder_pilot_skirmish;
    const fext = ".json";

    // Load files
    const json_template = JSON.parse(fs.readFileSync(json_pilot_skirmish, "utf8"));
    const csv_text = fs.readFileSync(csv_pilot_skirmish, "utf8");
    const { headers, rows } = ParseCSV(csv_text);

    if (diag == true) {
        const t_data = { headers, rows };
        const tf_name = path.join(folder_input, "test_pilot_skirmish.json");
        fs.writeFileSync(tf_name, JSON.stringify(t_data, null, 2), "utf8");
    }

    let trait_code_list = [];
    let trait_list = [];

    FlushConsole();
    Log("");
    Log("Pilot Trait Codes:");

    rows.forEach((row, idx) => {
        const i_face = String(headers.indexOf("Face"));
        const e_face = i_face ? String(row[i_face]) : "";
        const i_code = Number(headers.indexOf("Callsign"));
        const e_code = i_code ? String(row[i_code]) : null;
        const i_trait = Number(headers.indexOf("First Name"));
        const e_trait = i_trait ? String(row[i_trait]) : null;

        if ((e_face === "-----") && e_code && e_trait && !trait_code_list.includes(e_code)) {
            trait_code_list.push(e_code);
            trait_list.push(e_trait);
            Log("    " + e_code + "    " + e_trait);
        }
    });
    Log("Total number of trait codes: " + trait_code_list.length.toFixed(0));
    Log("");
    FlushConsole();

    Log("Pilot sprite file names:");
    FlushConsole();
    let face_name_list = [];
    fs.readdirSync(folder_pilot_face_sprites).forEach(file => { face_name_list.push( String(file) ); Log(file); });
    Log("Total number of face name filenames: " + face_name_list.length.toFixed(0));
    Log("");
    FlushConsole();

    let pilot_count = 0;
    let pilot_total_count = 0;
    let pilot_incomplete_or_error_count = 0;

    Log("Custom Battlemech pilots / Mechwarriors:");

    rows.forEach((row, idx) => {
        const i_face = String(headers.indexOf("Face"));
        const e_face = i_face ? row[i_face] : null;
        const i_callsign = Number(headers.indexOf("Callsign"));
        const e_callsign = i_callsign ? row[i_callsign] : null;
        const i_gender = Number(headers.indexOf("Gender"));
        const e_gender = i_gender ? row[i_gender] : null;
        const i_age = Number(headers.indexOf("Age"));
        const e_age = i_age ? row[i_age] : null;

        if (e_face && e_callsign && e_gender && e_age) {
            pilot_total_count += 1;

            // Clone template
            let data = JSON.parse(JSON.stringify(json_template));

            let dat = {};
            dat.face = e_face.Deep();
            dat.callsign = e_callsign.Deep();
            dat.callsign_u = e_callsign.Deep().replaceAll(" ", "_");
            dat.face_u = e_face.Deep().replaceAll(" ", "_");
            dat.Id = "pilot_ws_skirmish_" + dat.callsign_u.Deep();
            dat.Icon = "ws_img_pilot_" + dat.face_u.Deep();
            dat.name_tag = "name_" + dat.callsign_u.Deep();

            const face_filename = dat.Icon.Deep() + ".png";
            if (!face_name_list.includes(face_filename)) {
                pilot_incomplete_or_error_count += 1;

                Log("Error: No pilot face sprite exists for pilot " + pilot_total_count.toFixed(0) + " at spreadsheet row " +
                    idx.toFixed(0) + " with callsign: " + e_callsign +
                    ", face: " + e_face + ", with non-existant face filename: " + face_filename);

                return;
            }

            const f_name = path.join(output_folder_skirmish, dat.Id.concat(fext));

            let index = {};
            index.gender = Number(headers.indexOf("Gender"));
            index.faction = Number(headers.indexOf("Faction"));
            index.age = Number(headers.indexOf("Age"));
            index.gunnery = Number(headers.indexOf("Gunnery"));
            index.piloting = Number(headers.indexOf("Piloting"));
            index.guts = Number(headers.indexOf("Guts"));
            index.tactics = Number(headers.indexOf("Tactics"));
            index.health = Number(headers.indexOf("Health"));
            index.voice = Number(headers.indexOf("Voice"));
            index.trait_codes_1 = Number(headers.indexOf("Trait Codes 1"));
            index.trait_codes_2 = Number(headers.indexOf("Trait Codes 2"));

            data.Description.Id = dat.Id.Deep();
            data.Description.Name = e_callsign.Deep();
            data.Description.Callsign = e_callsign.Deep();
            data.Description.Gender = String(row[index.gender]);
            data.Description.factionID = String(row[index.faction]);
            data.Description.Age = Number(row[index.age]);
            data.Description.Icon = dat.Icon.Deep();
            data.BaseGunnery = Number(row[index.gunnery]);
            data.BasePiloting = Number(row[index.piloting]);
            data.BaseGuts = Number(row[index.guts]);
            data.BaseTactics = Number(row[index.tactics]);
            data.Health = Number(row[index.health]);
            data.Voice = String(row[index.voice]);
            data.PilotTags.items = ["BLACKLISTED", "pilot_release_ksbeta", "pilot_release_skirmish"];
            data.PilotTags.items.push(dat.name_tag.Deep());

            const trait_codes_1_string = String(row[index.trait_codes_1]);
            const trait_codes_2_string = String(row[index.trait_codes_2]);

            let traits = [];
            for (let i = 1; i <= data.BaseGunnery; i++) {
                const trait_weapon_hit = "TraitDefWeaponHit" + String(i);
                traits.push(trait_weapon_hit);
            }
            for (let i = 1; i <= data.BasePiloting; i++) {
                const trait_melee_hit = "TraitDefMeleeHit" + String(i);
                traits.push(trait_melee_hit);
            }

            if (data.BasePiloting >= 4) traits.push("TraitDefUnsteadySet80");
            if (data.BasePiloting >= 5) traits.push("TraitDefSprintIncrease10");
            if (data.BasePiloting >= 6) traits.push("TraitDefEvasiveChargeAddOne");
            if (data.BasePiloting >= 7) traits.push("TraitDefSprintIncrease20");
            if (data.BasePiloting >= 9) traits.push("TraitDefUnsteadySet60");
            if (data.BasePiloting >= 10) traits.push("TraitDefEvasiveChargeAddTwo");
            if (data.BasePiloting >= 11) traits.push("TraitDefUnsteadySet50");
            if (data.BasePiloting >= 12) traits.push("TraitDef_WS_Walk_Plus10");
            if (data.BasePiloting >= 12) traits.push("TraitDef_WS_Jump_Plus10");
            if (data.BasePiloting >= 13) traits.push("TraitDefUnsteadySet40");
            if (data.BasePiloting >= 14) traits.push("TraitDef_WS_Walk_Plus20");
            if (data.BasePiloting >= 14) traits.push("TraitDef_WS_Jump_Plus20");
            if (data.BasePiloting >= 15) traits.push("TraitDefEvasiveChargeAddThree");
            if (data.BasePiloting >= 16) traits.push("TraitDef_WS_Walk_Plus30");
            if (data.BasePiloting >= 16) traits.push("TraitDef_WS_Jump_Plus30");

            if (data.BaseGuts >= 4) traits.push("TraitDefHealthAddOne");
            if (data.BaseGuts >= 5) traits.push("TraitDefRefireReduceOne");
            if (data.BaseGuts >= 6) traits.push("TraitDefOverheatAddFifteen");
            if (data.BaseGuts >= 7) traits.push("TraitDefHealthAddTwo");
            if (data.BaseGuts >= 8) traits.push("TraitDefRefireReduceTwo");
            if (data.BaseGuts >= 9) traits.push("TraitDefOverheatAddThirty");
            if (data.BaseGuts >= 10) traits.push("TraitDefHealthAddThree");

            if (data.BaseGuts >= 2) traits.push("TraitDef_WS_Damage_Resist_Guts_01");
            if (data.BaseGuts >= 3) traits.push("TraitDef_WS_Damage_Resist_Guts_02");
            if (data.BaseGuts >= 4) traits.push("TraitDef_WS_Damage_Resist_Guts_03");
            if (data.BaseGuts >= 5) traits.push("TraitDef_WS_Damage_Resist_Guts_04");
            if (data.BaseGuts >= 6) traits.push("TraitDef_WS_Damage_Resist_Guts_05");
            if (data.BaseGuts >= 7) traits.push("TraitDef_WS_Damage_Resist_Guts_06");
            if (data.BaseGuts >= 8) traits.push("TraitDef_WS_Damage_Resist_Guts_07");
            if (data.BaseGuts >= 9) traits.push("TraitDef_WS_Damage_Resist_Guts_08");
            if (data.BaseGuts >= 10) traits.push("TraitDef_WS_Damage_Resist_Guts_09");
            if (data.BaseGuts >= 11) traits.push("TraitDef_WS_Damage_Resist_Guts_10");
            if (data.BaseGuts >= 12) traits.push("TraitDef_WS_Damage_Resist_Guts_11");
            if (data.BaseGuts >= 13) traits.push("TraitDef_WS_Damage_Resist_Guts_12");
            if (data.BaseGuts >= 14) traits.push("TraitDef_WS_Damage_Resist_Guts_13");
            if (data.BaseGuts >= 15) traits.push("TraitDef_WS_Damage_Resist_Guts_14");
            if (data.BaseGuts >= 16) traits.push("TraitDef_WS_Damage_Resist_Guts_15");

            if (data.BaseTactics >= 4) traits.push("TraitDefIndirectReduceOne");
            if (data.BaseTactics >= 5) traits.push("TraitDefMinRangeReduce45");
            if (data.BaseTactics >= 6) traits.push("TraitDefCalledShotImprove");
            if (data.BaseTactics >= 7) traits.push("TraitDefIndirectReduceTwo");
            if (data.BaseTactics >= 8) traits.push("TraitDefMinRangeReduce90");
            if (data.BaseTactics >= 9) traits.push("TraitDefCalledShotMaster");
            if (data.BaseTactics >= 10) traits.push("TraitDefIndirectReduceThree");
            if (data.BaseTactics >= 11) traits.push("TraitDefMinRangeReduce135");
            if (data.BaseTactics >= 12) traits.push("TraitDef_WS_Missle_Dodging_1");
            if (data.BaseTactics >= 12) traits.push("TraitDef_WS_Sensor_Range_01");
            if (data.BaseTactics >= 13) traits.push("TraitDef_WS_Ballistic_Dodging_1");
            if (data.BaseTactics >= 14) traits.push("TraitDefMinRangeReduce180");
            if (data.BaseTactics >= 14) traits.push("TraitDef_WS_Sensor_Range_02");
            if (data.BaseTactics >= 15) traits.push("TraitDef_WS_Missle_Dodging_2");
            if (data.BaseTactics >= 16) traits.push("TraitDef_WS_Ballistic_Dodging_2");
            if (data.BaseTactics >= 16) traits.push("TraitDef_WS_Sensor_Range_03");

            let trait_codes = [];
            if (trait_codes_2_string.length > 0) {
                const tr = trait_codes_2_string.split(" ");
                trait_codes = trait_codes.concat(tr).Deep();
                /*
                {
                    trait_codes.push("Aim1", "Aim2", "Aim3", "Aim4", "Aim5");
                    trait_codes.push("Aim-Ballistic1", "Aim-Ballistic2", "Aim-Ballistic3", "Aim-Ballistic4", "Aim-Ballistic5");
                    trait_codes.push("Aim-Energy1", "Aim-Energy2", "Aim-Energy3", "Aim-Energy4", "Aim-Energy5");
                    trait_codes.push("Aim-Missle1", "Aim-Missle2", "Aim-Missle3", "Aim-Missle4", "Aim-Missle5");
                    trait_codes.push("Rng1", "Rng2", "Rng3", "Rng4", "Rng5");
                    trait_codes.push("Rng-Ballistic1", "Rng-Ballistic2", "Rng-Ballistic3");
                    trait_codes.push("Rng-Energy1", "Rng-Energy2", "Rng-Energy3");
                    trait_codes.push("Rng-Missle1", "Rng-Missle2", "Rng-Missle3");
                    trait_codes.push("Dmg1", "Dmg2", "Dmg3", "Dmg4", "Dmg5");
                    trait_codes.push("Dmg-Ballistic1", "Dmg-Ballistic2", "Dmg-Ballistic3");
                    trait_codes.push("Dmg-Energy1", "Dmg-Energy2", "Dmg-Energy3");
                    trait_codes.push("Dmg-Missle1", "Dmg-Missle2", "Dmg-Missle3");
                    trait_codes.push("Dmg-Stability1", "Dmg-Stability2", "Dmg-Stability3", "Dmg-Stability4", "Dmg-Stability5");
                    trait_codes.push("Dmg-Heat1", "Dmg-Heat2", "Dmg-Heat3", "Dmg-Heat4", "Dmg-Heat5");
                    trait_codes.push("Dmg-Resist1", "Dmg-Resist2", "Dmg-Resist3", "Dmg-Resist4", "Dmg-Resist5");
                    trait_codes.push("Dodge1", "Dodge2", "Dodge3", "Dodge4", "Dodge5");
                }
                */
            }
            if (trait_codes_1_string.length > 0) {
                const tr = trait_codes_1_string.split(" ");
                trait_codes = trait_codes.concat(tr).Deep();
            }

            if (trait_codes.length > 0) {
                for (const trait of trait_codes) {
                    if (trait.length < 1) continue;
                    const code_index = trait_code_list.indexOf(trait);

                    if (code_index >= 0) {
                        const trait_name = trait_list[code_index];
                        traits.push(trait_name).Deep();
                    } else {
                        Log("Error for pilot: " + String(e_face) + ", callsign: " + String(e_callsign) +
                            " -- Unknown trait for code: " + String(trait) + " , from trait code list: " +
                            "\n    " + trait_codes );
                    }
                }
            }

            data.abilityDefNames = traits;

            fs.writeFileSync(f_name, JSON.stringify(data, null, 2), "utf8");
            // console.log(`Wrote ${f_name}`);
            // Log(`Wrote ${f_name}`);
            pilot_count += 1;
            Log("Wrote JSON file for pilot " + pilot_total_count.toFixed(0) + " callsign: " + e_callsign + ", face: " + e_face + ", file: " + f_name);
        }
        else if ((e_face !== "-----") && (e_face !== "Skirmish Pilots") && (e_face !== "List of Trait Codes") && e_face.length > 2) {
            pilot_total_count += 1;
            pilot_incomplete_or_error_count += 1;

            if (e_callsign)
                Log("Incomplete pilot - no pilot JSON file written, for pilot: " + pilot_total_count.toFixed(0) +
                    " at spreadsheet row: " + idx.toFixed(0) +
                    ", for pilot with face: " + e_face + ", callsign: " + e_callsign);
            else
                Log("Incomplete pilot - no pilot JSON file written, for pilot: " + pilot_total_count.toFixed(0) +
                    " at spreadsheet row: " + idx.toFixed(0) +
                    ", for pilot with face: " + e_face);
            Log("  Spreadsheet row data: " + String(row));
        }
    });

    Log("");
    FlushConsole();

    Log("Total pilot JSON files written: " + pilot_count.toFixed(0));
    Log("Total pilot JSON files attempted: " + pilot_total_count.toFixed(0));
    Log("Total incomplete pilots (no file written) or errors: " + pilot_incomplete_or_error_count.toFixed(0));

    Log("");
    FlushConsole();
}

function Main_Upgrades(diag=false) {
    const output_folder = folder_upgrades;
    const output_folder_game = folder_upgrades_game;
    const output_folder_skirmish = folder_upgrades_skirmish;
    const fext = ".json";

    // Load files
    const json_template = JSON.parse(fs.readFileSync(json_upgrades, "utf8"));
    const csv_text = fs.readFileSync(csv_upgrades, "utf8");
    const { headers, rows } = ParseCSV(csv_text);

    if (diag == true) {
        const t_data = { headers, rows };
        const tf_name = path.join(folder_input, "test_upgrades.json");
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

            const d_name = ("Gear_").concat(e_name.replaceAll(" ", "_"));
            const f_name_game = path.join(output_folder_game, d_name.concat(fext));
            const f_name_skirmish = path.join(output_folder_skirmish, d_name.concat("_skirmish", fext));

            let index = {};
            index.name = Number(headers.indexOf("Name"));
            index.type = Number(headers.indexOf("Type"));
            index.level = Number(headers.indexOf("Level"));
            index.tonnage = Number(headers.indexOf("Tonnage"));
            index.power_drain = Number(headers.indexOf("Power Drain"));
            index.equip_slots = Number(headers.indexOf("Equip Slots"));
            index.cost = Number(headers.indexOf("Cost"));
            index.gui_feature_a = Number(headers.indexOf("GUI Feature A"));
            index.gui_feature_b = Number(headers.indexOf("GUI Feature B"));
            index.specials_code = Number(headers.indexOf("Specials Code"));
            index.allowed_locations = Number(headers.indexOf("Allowed Locations"));
            index.icon_code = Number(headers.indexOf("Icon Code"));
            index.manufacturer = Number(headers.indexOf("Manf. Code"));
            index.model_name = Number(headers.indexOf("Model Name"));

            const item_type = row[index.type] ? Number(row[index.type]) : 1;
            const item_level = row[index.level] ? Number(row[index.level]) : 1;

            data.Description.Cost = Number(row[index.cost]);
            data.Description.Id = d_name;
            data.Description.Name = row[index.name];
            data.Description.UIName = row[index.name];
            data.Description.Model = row[index.model_name];
            data.Description.Icon = GetIcon( String(row[index.icon_code]) );
            data.Description.Manufacturer = GetManufacturer( String(row[index.manufacturer]) );
            data.Tonnage = Number(row[index.tonnage]);
            data.InventorySize = Number(row[index.equip_slots]);
            data.BonusValueA = String(row[index.gui_feature_a]);
            data.BonusValueB = String(row[index.gui_feature_b]);

            data.AllowedLocations = GetAllowedLocations( String(row[index.allowed_locations]) );

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
            data.ComponentTags.items = item_tags;
            let item_tags_skirmish = [ "component_type_stock" ];
            data.ComponentTags.items.push( "BLACKLISTED" );

            const specials_codes = row[index.specials_code] ? String(row[index.specials_code]) : null;
            const power_drain = row[index.power_drain] ? String(row[index.power_drain]) : null;
            SetSpecials(data, specials_codes, power_drain);

            let data_skirmish = data.Deep();
            data_skirmish.ComponentTags.items = item_tags_skirmish.Deep();
            data_skirmish.Description.Id = data_skirmish.Description.Id.Deep() + "_skirmish";
            data_skirmish.Description.Cost = 0;

            fs.writeFileSync(f_name_game, JSON.stringify(data, null, 2), "utf8");
            fs.writeFileSync(f_name_skirmish, JSON.stringify(data_skirmish, null, 2), "utf8");
            Log("Wrote file: " + f_name_game + "\nWrote file: " + f_name_skirmish);
        } else {
            FlushConsole();
        }

        FlushConsole();
    });

    ConsolidateJsonFiles(output_folder_skirmish, output_folder + "upgrades_skirmish.json", true);
    ConsolidateJsonFiles(output_folder_game, output_folder + "upgrades_game.json", true);
}

function ParseSpecials(codes) {
    if (!codes) return [];
    if (codes.length < 1) return [];

    let specials = [];

    const specials_text = codes.split(" ");
    if (specials_text.length < 1) return [];

    for (const special of specials_text) {
        let element = special.Deep().split("`");
        if (!element[0] || !element[1]) {
            Log("Error parsing special code: " + special.Deep() + ", from list of specials: " + codes.Deep());
            return [];
        }
        specials.push( {ID:String(element[0]), value:Number(element[1])} );
    }

    return specials;

/*
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
            text = text.concat(tchar).Deep();

        if (i == (codes.length - 1)) {
            if (pos == 0) special.ID = text.Deep();
            else if (pos == 1) special.value = Number(text);
            else if (pos == 2) special.duration = Number(text);
            else if (pos == 3) special.stack = Number(text);

            specials.push(special.Deep());
        }
    }

    return specials;
*/
}

function GetAllowedLocations(codes) {
    let locations = [];
    if (!codes) return "All";
    if (codes.length < 1) return "All";

    let text = "";

    for (let i = 0; i < codes.length; i++) {
        const tchar = codes[i].Deep();
        if ((tchar === " ") || (i == codes.length - 1)) {
            if (i == codes.length - 1) text = text.concat(tchar).Deep();
            const loc = text.Deep();

            text = "";

            if (loc === "T") locations.push( "Torso" );
            else if (loc === "A") locations.push( "Arms" );
            else if (loc === "L") locations.push( "Legs" );
            else if (loc === "H") locations.push( "Head" );
            else if (loc === "CT") locations.push( "CenterTorso" );
            else if (loc === "LT") locations.push( "LeftTorso" );
            else if (loc === "RT") locations.push( "RightTorso" );
            else if (loc === "LA") locations.push( "LeftArm" );
            else if (loc === "RA") locations.push( "RightArm" );
            else if (loc === "LL") locations.push( "LeftLeg" );
            else if (loc === "RL") locations.push( "RightLeg" );
        }
        else
            text = text.concat(tchar).Deep();
    }

    if (locations.length < 1) return "All";

    return locations.join(", ");
}

function SetSpecials(data, specials_codes, drain_data) {
    if (!data) Log("Warning: \"data\" function input parameter invalid for called function: \"SetSpecials(data)\".");

    let item_description = "";
    let drain_text = "";
    let specials_text = "";
    let fx_array = [];

    if (!data.Description) { Log("ERROR: No \"Description\" sub-object inside of data object to apply specials to in \"SetSpecials()\"."); return; }
    else if (!data.Description.Model) { Log("ERROR: No \"Model\" sub-object inside of \"Description\" sub-object of data object to apply specials to in \"SetSpecials()\"."); }

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

    // Drain
    if (!drain_data)
        drain_data = "0 0 1.00000";

    const drain = drain_data.Deep().split(" ");
    if (drain.length < 3)
        drain = ["0", "0", "1.00000"];

    if (drain[0] !== "0") {
        const fx = FindEquipmentEffect( "-HEAT_SINKING", Number(drain[0]) * -1 );
        if (fx) {
            drain_text = drain_text.Deep() + fx.info.Deep();
            fx_array = fx_array.Deep().concat(fx.data);
        }
    }
    if (drain[1] !== "0") {
        const fx = FindEquipmentEffect( "-GEAR_HEAT_TOLERANCE", Number(drain[1]) );
        if (fx) {
            drain_text = drain_text.Deep() + fx.info.Deep();
            fx_array = fx_array.Deep().concat(fx.data);
        }
    }
    if (drain[2] !== "1.00000") {
        const fx = FindEquipmentEffect( "-DMG_TAKEN", Number(drain[2]) );
        if (fx) {
            drain_text = drain_text.Deep() + fx.info.Deep();
            fx_array = fx_array.Deep().concat(fx.data);
        }
    }

    // Specials
    const specials = ParseSpecials(specials_codes);
    for (const special of specials) {
        const fx = FindEquipmentEffect( special.ID, special.value );
        if (fx) {
            specials_text = specials_text.Deep() + fx.info.Deep();
            fx_array = fx_array.Deep().concat(fx.data);
        }
    }

    let description = "";
    if (specials_text.length > 0) description = description.Deep() + specials_text.Deep();
    if (drain_text.length > 0) description = description.Deep() + drain_text.Deep();
    if (description.length > 0) description = description.Deep() + "\n";
    description = description.Deep() + item_description.Deep();

    data.Description.Details = description.Deep();
    data.statusEffects = fx_array.Deep();
}

// --- Main ---
function Main() {
    Log_Start();

    ParseListOfIcons();
    ParseListOfEffects();
    ParseListOfItemDescriptions();

    ClearDirs();

    Main_AmmoBoxes();
    Main_Weapons();
    Main_Upgrades();
    Main_Pilots_Skirmish();

    Log_End();
}

Main();
