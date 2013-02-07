#!/bin/bash

tiles=`ls -d */*/*`

for thisPath in $tiles
do
	thisFile=${thisPath#*/*/}
	oldY=${thisFile%.png}
	zoomX=${thisPath%/*}
	zoom=${thisPath%/*/*}
	newY=$(((1<<zoom) - oldY - 1))
	mv ${zoomX}/${oldY}.png ${zoomX}/${newY}.png
done