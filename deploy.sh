#!/bin/sh
# Deploy this projects client version (HTML, JS, CSS)
# Requires sed, sassc

cp css/structog.scss css/temp_css.scss

for file in svg/*
do
    echo ".$(echo "$file" | sed -r "s/.+\/(.+)\..+/\1/") {" >> css/temp_css.scss

    svgimage=$(sed -e 's/\s\{2,\}//g' -e 's/\"/\x27/g' -e 's/#/%23/g' -e 's/</%3C/g' -e 's/>/%3E/g' $file | sed -e ':a' -e 'N' -e '$!ba' -e 's/\n/ /g')

    echo "background-image: url(\"data:image/svg+xml,${svgimage}\");" >> css/temp_css.scss

    # echo "height: 100%;" >> css/temp_css.scss
    # echo "background-size: contain;" >> css/temp_css.scss
    echo "background-repeat: no-repeat;" >> css/temp_css.scss
    echo "background-position: center;" >> css/temp_css.scss
    echo "}" >> css/temp_css.scss
done

sassc -t compressed css/temp_css.scss dist/struktog.min.css

rm css/temp_css.scss
