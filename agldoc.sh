#!/bin/bash

### default options
MACHINE=qemu
HELP=0

for i in "$@" ; do
        case "$i" in
                -m|--machine)  MACHINE=$2; shift 2;;
                -h|--help)     HELP=1; shift;;
                *) ;;
        esac
done

if [ 1 == $HELP ] ; then
	printf "Usage: . agldoc.sh [options]\n"
	printf "Options:\n"
	printf "\t-m|--machine <machine>\n\t\twhat machine to use\n\t\tdefault: 'qemu'\n"
	printf "\t-h|--help\n\t\tget some help\n"
	exit 0
fi

# handle alias
case $MACHINE in
	raspberrypi2|raspberrypi3) MACHINE=raspberrypi;;
	qemux86-64|qemux86) MACHINE=qemu;;
esac

FILEDOC="../source-code/$MACHINE.md"
FILEHTML="$MACHINE.html"

DIRROOT=$(dirname "$0")
cd $DIRROOT
mkdir -p export
cp -R templates export
cd export

if [ ! -e $FILEDOC ] ; then
	echo "Document for $MACHINE not found."; exit 1;
fi

pandoc ../source-code/source-code.md $FILEDOC ../source-code/troubleshooting.md -f markdown -t html -s -S --toc -c templates/html/pandoc.css -B templates/html/header.html -A templates/html/footer.html -o $FILEHTML

echo "Document exported to $DIRROOT/export/$FILEHTML"
