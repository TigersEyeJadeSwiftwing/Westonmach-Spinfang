const fs = require("fs");
const path = require("path");

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

const EmptyFolder = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        console.log("Cleaning folder: \"" + folderPath + "\"...");
        fs.rmSync(folderPath, { recursive: true, force: true });
        fs.mkdirSync(folderPath);
    }
    else {
        console.log("Error: Attempted to clean non-existant folder: \"" + folderPath + "\".");
    }
};

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

// --- Main ---
function Main() {
    console.log( "clean.js, started:" );
    const hrtime_0 = process.hrtime();
    console.log( "Seconds: " + hrtime_0[0].toLocaleString(0) + ", Nanoseconds: " + hrtime_0[1].toLocaleString(0) + "\n" + new Date().toString() + "\n" );

    ClearDirs();

    // console.log( "\n" + "clean.js completed:\n" + new Date().toString() + "\n" );
    console.log( "\n" + "clean.js completed:" );
    const hrtime_1 = process.hrtime();
    console.log( "Seconds: " + hrtime_1[0].toLocaleString(0) + ", Nanoseconds: " + hrtime_1[1].toLocaleString(0) + "\n" + new Date().toString() );
    const time_0 = (hrtime_0[0] * 1e9) + hrtime_0[1];
    const time_1 = (hrtime_1[0] * 1e9) + hrtime_1[1];
    const time = time_1 - time_0;
    const elapsed_seconds = Math.floor(time / 1e9);
    const elapsed_nanoseconds = time - (elapsed_seconds * 1e9);
    console.log( "Elapsed program run-time, Seconds: " + elapsed_seconds.toLocaleString(0) + ", Nanoseconds: " + elapsed_nanoseconds.toLocaleString(0) + "\n" );
}

Main();
