#!/bin/bash

### default options
MACHINE=all
DOCTYPE=html
HELP=0
TOOLDIR=$(cd $(dirname $0) && pwd -P)
TOPDIR=$(cd $TOOLDIR/.. && pwd -P)
DOCDIR=$TOPDIR/docs/getting-started
EXPORTDIR=$TOPDIR/export

function exportdoc {
        FILEDOC="$DOCDIR/machines/$1.md"
        if [ ! -e $FILEDOC ] ; then
                echo "Document for $1 not found."
                exit 1
        fi
        FILETROUBLE="$DOCDIR/footers/$1-footer.md"
        if [ ! -e $FILETROUBLE ] ; then
                FILETROUBLE=""
        fi
        FILEEXPORT="$EXPORTDIR/$DOCTYPE/$1.$DOCTYPE"
		mkdir -p $(dirname $FILEEXPORT)
        pandoc $DOCDIR/source-code.md $FILEDOC $DOCDIR/troubleshooting.md $FILETROUBLE $FILECONFIG -o $FILEEXPORT
        echo "Document exported to $FILEEXPORT"
}

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

if [[ 1 == $HELP ]] ; then
	printf "Usage: . $(basename $0) [options]\n"
	printf "Options:\n"
	printf "\t-m|--machine <machine>\n\t\twhat machine to use\n\t\tdefault: 'all'\n"
	printf "\t-d|--document <pdf|html|dokuwiki>\n\t\twhat document format to use\n\t\tdefault: 'html'\n"
	printf "\t-h|--help\n\t\tget some help\n"
	exit 0
fi

# handle alias
case $MACHINE in
	raspberrypi2|raspberrypi3) MACHINE=raspberrypi;;
	qemux86-64|qemux86) MACHINE=qemu;;
esac


case $DOCTYPE in
	pdf)
		DOCTYPE=pdf
		mkdir -p $EXPORTDIR/$DOCTYPE/
		FILECONFIG="-N --template=$TOOLDIR/templates/pdf/agl.tex --variable mainfont=\"Arial\" --variable sansfont=\"Arial\" --variable monofont=\"Arial\" --variable fontsize=12pt --latex-engine=xelatex --toc"
		;;
	dokuwiki|wiki)
		DOCTYPE=dokuwiki
		mkdir -p $EXPORTDIR/$DOCTYPE/
		FILECONFIG="-t dokuwiki"
		;;
	html)
		DOCTYPE=html
		EXPORTTEMPLATES=$EXPORTDIR/$DOCTYPE/templates
		mkdir -p $EXPORTDIR/$DOCTYPE/
		cp -R $DOCDIR/images $EXPORTDIR/$DOCTYPE/
		# Delete the old and copy the latest templates
		rm -rf $EXPORTTEMPLATES
		cp -R $TOOLDIR/templates/html  $EXPORTTEMPLATES
		FILECONFIG="-f markdown -t html -s -S --toc -c templates/pandoc.css -B $EXPORTTEMPLATES/header.html -A $EXPORTTEMPLATES/footer.html"
		;;
	*)
		echo "Unknown doctype '$DOCTYPE'." >&2
		exit 1
		;;
esac

if [[ "all" == $MACHINE ]] ; then
	echo "Exporting documentation for all machines."
	for TARGET in $DOCDIR/machines/*.md
	do
		exportdoc $(basename $TARGET .md)
	done
else
	exportdoc $MACHINE
fi
