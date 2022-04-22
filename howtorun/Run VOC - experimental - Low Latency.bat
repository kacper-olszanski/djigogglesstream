.\node.exe index.js -o | ffplay -i - -fast -fflags nobuffer -flags low_delay -strict experimental -vf "setpts=N/60/TB" -af "asetpts=N/60/TB" -noframedrop
