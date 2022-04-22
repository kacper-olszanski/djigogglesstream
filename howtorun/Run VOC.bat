node ../dist/index.js -o | ffplay -i - -analyzeduration 1 -fflags -nobuffer -probesize 32 -sync ext
