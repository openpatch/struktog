const path = require('path');
const fs = require('fs');

//create path of svg directory
const svgDir = path.join(__dirname, '../src/assets/svg/');

fs.readdir(svgDir, function (err, files) {
    if (err) {
        return console.log(err);
    }

    const svgScssFile = path.join(__dirname, '../src/assets/scss/_svg.scss');
    // delete the old scss file
    if (fs.existsSync(svgScssFile)) {
        fs.unlinkSync(svgScssFile);
    }

    // write per file a css class to the file
    files.forEach(function (file) {
        let image = ".";
        image += file.split('.')[0];
        image += " {background: url(\"../svg/";
        image += file;
        image += "\");background-repeat: no-repeat;background-position: center;}";

        fs.appendFileSync(svgScssFile, image);
    });
});
