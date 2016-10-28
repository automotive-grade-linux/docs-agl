#!/bin/bash

### default options
MACHINE=all
DOCTYPE=html
HELP=0

while [[ $# -gt 0 ]]
do
	case $1 in
		-m|--machine)  MACHINE=$2; shift;;
		-d|--document) DOCTYPE=$2; shift;;
		-h|--help)     HELP=1;;
		*) ;;
	esac
	shift
done

if [ 1 == $HELP ] ; then
	printf "Usage: . agldoc.sh [options]\n"
	printf "Options:\n"
	printf "\t-m|--machine <machine>\n\t\twhat machine to use\n\t\tdefault: 'all'\n"
	printf "\t-d|--document <pdf|html>\n\t\twhat document format to use\n\t\tdefault: 'html'\n"
	printf "\t-h|--help\n\t\tget some help\n"
	exit 0
fi

# handle alias
case $MACHINE in
	raspberrypi2|raspberrypi3) MACHINE=raspberrypi;;
	qemux86-64|qemux86) MACHINE=qemu;;
esac

DIRROOT=$(dirname "$0")
cd $DIRROOT
mkdir -p export
cp -R templates export
cd export

if [ "pdf" == $DOCTYPE ] ; then
	FILECONFIG="-N --template=templates/pdf/agl.tex --variable mainfont=\"Arial\" --variable sansfont=\"Arial\" --variable monofont=\"Arial\" --variable fontsize=12pt --latex-engine=xelatex --toc"
elif [ "dokuwiki" == $DOCTYPE ] ; then
	FILECONFIG="-t dokuwiki"
else
	DOCTYPE="html"
	FILECONFIG="-f markdown -t html -s -S --toc -c ../templates/html/pandoc.css -B templates/html/header.html -A templates/html/footer.html"
fi

mkdir -p "$DOCTYPE"

if [ "all" == $MACHINE ] ; then
	echo "Exporting documentation for all machines."
	for TARGET in ../source-code/machines/*.md
	do
		TARGET=$(basename $TARGET)
		TARGET=${TARGET%.*}
		FILEEXPORT="$DOCTYPE/$TARGET.$DOCTYPE"
		FILEDOC="../source-code/machines/$TARGET.md"
		pandoc ../source-code/source-code.md $FILEDOC ../source-code/troubleshooting.md $FILECONFIG -o $FILEEXPORT
		echo "Document exported to $DIRROOT/export/$FILEEXPORT"
	done
else
	FILEDOC="../source-code/machines/$MACHINE.md"
	if [ ! -e $FILEDOC ] ; then
		echo "Document for $MACHINE not found."
		exit 1
	fi
	FILEEXPORT="$DOCTYPE/$MACHINE.$DOCTYPE"
	pandoc ../source-code/source-code.md $FILEDOC ../source-code/troubleshooting.md $FILECONFIG -o $FILEEXPORT
	echo "Document exported to $DIRROOT/export/$FILEEXPORT"
fi
