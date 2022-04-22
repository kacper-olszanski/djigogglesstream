import * as Goggles from "./goggles";
import * as yargs from "yargs";

(async () => {
    const argv = (yargs as any)
        .option('f', {
            alias: 'file',
            describe: 'output video feed to file',
            type: 'string'
        })
        .option('o', {
            alias: 'stdout',
            describe: 'send video feed to stdout for playback. eg: node index.js -o | ffplay -',
            type: 'boolean'
        })
        .option('s', {
            alias: 'readsize',
            describe: 'size in bytes to queue for usb bulk interface reads',
            default: 512,
            type: 'integer'
        })
        .option('q', {
            alias: 'queuesize',
            describe: 'number of polling usb bulk read requests to keep in flight',
            default: 3,
            type: 'integer'
        })
        .option('v', {
            alias: 'verbose',
            describe: 'be noisy - doesn not play well with -o',
            type: 'boolean'
        })
        .help()
        .alias('help', 'h')
        .argv;

    if (!argv.f && !argv.o) {
            console.log("warning: no outputs specified")
            argv.v = true
        }

    let goggles: Goggles.default | undefined;

    do {
        goggles = Goggles.default.connect();
        if (goggles === undefined) {
            await sleep(2000)
        }
    } while (goggles === undefined)


    try {
    goggles.initStreamFromGoggle(argv, (data) => {
        if (argv.o) {
            process.stdout.write(data)
        }
        if (argv.v) {
            console.debug("received " + data.length + " bytes")
        }
    });
    }catch(err: any) {
        console.error("stop")
        goggles.stop();
    }
})();

function sleep(duration: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }