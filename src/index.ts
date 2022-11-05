import { spawn } from "child_process";
import { defaultArgs, RunConfig } from "./config";
import Goggles from "./goggles";
import fs from "fs";
import { initYargs, sleep, downloadBinaries, getRunConfigOptions } from "./util";

var fd: number | undefined;
var err: any;

(async () => {
    const argv = initYargs([...defaultArgs]);

    if (!argv.f && !argv.o) {
        console.warn("warning: no outputs specified")
        argv.v = true
    }

    await downloadBinaries({
        destination: argv.ffbin,
        force: argv.force,
        platform: argv.platform,
        quiet: !argv.v,
        version: argv.ffversion,
    });

    console.log(argv)

    let goggles: Goggles | undefined;

    do {
        goggles = Goggles.connect();
        if (goggles === undefined) {
            console.log("trying again...")
            await sleep(2000)
        }
    } while (goggles === undefined)


  
    try {
        const ffplay = argv.p
            ? spawn(`${argv.ffbin}/ffplay`, getRunConfigOptions(argv.m as RunConfig))
            : undefined;

        goggles.initStreamFromGoggle(argv, (data) => {
            if (argv.o) {
                process.stdout.write(data);
            }
            if (argv.p && ffplay) {
                ffplay.stdin.write(data);
            }
            if (argv.f) {
                if (!fd) {
                    fd = fs.openSync(argv.f, "w")
                    if (!fd) {
                        console.error("couldn't open file " + argv.f + ": " + err)
                        process.exit(1)
                    }
                }
                fs.writeSync(fd, data)
            }
            if (argv.v) {
                console.debug("received " + data.length + " bytes")
            }

        });
    } catch (err: any) {
        console.error("stop")
        goggles.stop();
    }
})();
