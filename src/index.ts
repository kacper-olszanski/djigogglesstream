import Goggles from "./goggles";
import { defaultArgs, initYargs, sleep } from "./util";

(async () => {
    const argv = initYargs([...defaultArgs]);

    if (!argv.f && !argv.o) {
            console.warn("warning: no outputs specified")
            argv.v = true
        }

    let goggles: Goggles | undefined;

    do {
        goggles = Goggles.connect();
        if (goggles === undefined) {
            console.log("trying again...")
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
    } catch(err: any) {
        console.error("stop")
        goggles.stop();
    }
})();