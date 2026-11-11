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

let console_output = [];
let console_index_count = 0;
let log_file = "";
let hrtime_0, hrtime_1 = null;

// Hard-coded input/output folders
const folder_input = "./";
const folder_root = "../";
const folder_pilot_template = "../pilot/";
const folder_pilot_story = "../pilot/story/";
const folder_pilot_generated = "../pilot/story/generated/";
const folder_pilot_face_sprites = "../sprites_pilots/";

// File names
const filename_full_json_pilot_template = path.join(folder_pilot_template, "pilot_ws_Template.json");

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

function Log_Start() {
    Log("gen_pilots.js, started:");
    hrtime_0 = process.hrtime();
    Log("Seconds: " + hrtime_0[0].toLocaleString(0) + ", Nanoseconds: " + hrtime_0[1].toLocaleString(0));
    Log( new Date().toString() );
    Log("");

    FlushConsole();
}

function Log_End() {
    FlushConsole();

    Log("gen_pilots.js, completed:");
    hrtime_1 = process.hrtime();
    Log("Seconds: " + hrtime_1[0].toLocaleString(0) + ", Nanoseconds: " + hrtime_1[1].toLocaleString(0));
    Log( new Date().toString() );
    Log("Writing output to log file: \"gen_pilots js log.txt\"...");
    const time_0 = (hrtime_0[0] * 1e9) + hrtime_0[1];
    const time_1 = (hrtime_1[0] * 1e9) + hrtime_1[1];
    const time = time_1 - time_0;
    const elapsed_seconds = Math.floor(time / 1e9);
    const elapsed_nanoseconds = time - (elapsed_seconds * 1e9);
    Log("Elapsed program run-time, Seconds: " + elapsed_seconds.toLocaleString(0) + ", Nanoseconds: " + elapsed_nanoseconds.toLocaleString(0) + "\n");
    Log("");

    FlushConsole();

    try {
        fs.writeFileSync("gen_pilots js log.txt", log_file);
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
    EmptyFolder(folder_pilot_generated);
}

// --- Main ---
function Main() {
    Log_Start();

    ClearDirs();

    Main_Pilots_Game();

    Log_End();
}

function Main_Pilots_Game() {
    FlushConsole();

    Log("Reading Pilot Template.....");
    let json_template = null;

    try {
        json_template = JSON.parse( fs.readFileSync( String(filename_full_json_pilot_template), "utf8") );
    } catch (e) {
        Log(e);
        Log("");
        FlushConsole();
        return;
    }

    Log("Finished Reading " + String(filename_full_json_pilot_template));
    Log("");
    FlushConsole();

    let used_names = [];

    fs.readdirSync(folder_pilot_story).forEach(file => {
        if (!file) return;

        let file_text = "";

        try {
            file_text = fs.readFileSync(folder_pilot_story + String(file), "utf8");
        } catch(e) {
            Log(e);
            return;
        }

        const lines = file_text.trim().split(/\r?\n/);
        const line_icon = lines.find( (element) => (element.includes("\"Icon\"") && element.includes("ws_img_pilot_")) );
        if (line_icon) {
            const name = line_icon.replace("\"Icon\"" , "").replace(":", "").replaceAll("\"", "").trim();
            Log("Found a pilot that already uses: " + String(name));
            used_names.push(String(name));
        }
    });

    Log("");
    FlushConsole();

    Log( "Total already-used pilot images: " + String(used_names.length) );
    Log("");
    FlushConsole();

    let number_pilot_json_files = 0;

    fs.readdirSync(folder_pilot_face_sprites).forEach(file => {
        // Log(String(file));
        const used_name_match = used_names.includes( String(file).replace(".png", "") );
        if (used_name_match) {
            Log( "File " + String(file) + " is already used in a customized pilot json file." );
            return;
        }

        try {
            let json_output = json_template.Deep();
            let filename = String(file).replace("ws_img_pilot_", "pilot_hall_").replace(".png", ".json");

            const pilot_Id = String(file).replace("ws_img_pilot_", "").replace(".png", "");
            const pilot_callsign = pilot_Id.Deep().replaceAll("_", " ");

            json_output.Description.Id = "pilot_hall_" + String(pilot_Id);
            json_output.Description.Name = String(pilot_callsign);
            json_output.Description.Callsign = String(pilot_callsign);
            json_output.Description.Details = "* This battlemech pilot, if hired, comes with free, unspent experience points you are free to use to train them with when you hire them.\r\n";
            json_output.Description.Icon = String(file).replace(".png", "");

            json_output.Voice = "m_pro01_stark_chad";
            json_output.abilityDefNames = [];
            json_output.PilotTags.items = ["BLACKLISTED", "pilot_athletic", "pilot_dependable", "pilot_honest", "name_" + String(pilot_Id), "pilot_aurigan"];


            fs.writeFileSync(folder_pilot_generated + String(filename), JSON.stringify(json_output, null, 2), "utf8");
            number_pilot_json_files++;
            Log(folder_pilot_generated + String(filename));
            // Log("Added \"" + file + "\".");
        } catch(e) {
            Log("Error making a pilot file for \"" + file + "\": " + String(e));
        }
    });

    Log("");
    Log( "Total already-used pilot images: " + used_names.length );
    Log( "Number of generated pilot json files: " + String(number_pilot_json_files) );
    Log("");

    FlushConsole();
}

Main();
