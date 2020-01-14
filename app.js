#!/usr/bin/env node

// add bin object to package.json
// run npm link

var fs = require('fs');
const colors = require('colors');
const path = require('path');
const { lstat } = fs.promises


const defaultTheme = {
    file: 'rainbow',
    folder: 'green',
    fileBg: 'bgBlack',
    folderBg: 'bgGray'
}
const customTheme = {}

const targetDir = process.argv[2] || process.cwd();


fs.readFile(__dirname + '/colorsettings.json', (err, settings) => {
    if(err) { colors.setTheme(defaultTheme) }
    // load color settings
    try {
        const colorSettings = JSON.parse(settings);

        customTheme.file = colorSettings.fileColor;
        customTheme.fileBg = colorSettings.fileBackground;
        customTheme.folderBg = colorSettings.folderBackground;
        customTheme.folder = colorSettings.folderColor;
        // if there is a custom theme, load it
        if(customTheme && !err) {
            colors.setTheme(customTheme);
        } else { colors.setTheme(defaultTheme) }
    } catch(err) {
        console.log("Settings file not found -- loading default theme.. ".red, err);
        colors.setTheme(defaultTheme);
    }



    fs.readdir(targetDir, async(err, filenames) => {

        if(err) console.log(err);

        const statPromises = filenames.map((filename) => {
            // join filenmae to directory path
            return lstat(path.join(targetDir, filename));
        });

        const allStats = await Promise.all(statPromises);
        for(let stats of allStats) {
            const i = allStats.indexOf(stats);
            if(filenames[i][0] == ".") { console.log(filenames[i].file.dim); }
            if(stats.isFile() && filenames[i][0] !== ".") { console.log(filenames[i].file.fileBg) } else if(stats.isDirectory() && filenames[i][0] !== ".") { console.log(filenames[i].folderBg.bold.folder) }
        }
    })

})