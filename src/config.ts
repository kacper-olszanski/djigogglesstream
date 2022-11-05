import { listPlatforms } from "ffbinaries";
import { ArgOption } from "./util";

export enum RunConfig {
    DEFAULT,
    HYBRID,
    LOW_LATENCY,
}

export const defaultArgs: Array<ArgOption> = [
    {
        name: "p",
        option: {
            alias: "play",
            describe: "play video feed with ffplay",
            default: true,
            type: "boolean",
        }
    }, {
        name: "m",
        option: {
            alias: "playmode",
            describe: `select mode for playing: ${Object.entries(RunConfig)
                .filter(([key]) => isNaN(Number(key)))
                .map(([key, value]) => `${key}: ${value.valueOf()}`)
                .join(" | ")}`,
            default: RunConfig.DEFAULT,
            type: "integer",
        }
    }, {
        name: "f",
        option: {
            alias: "file",
            describe: "output video feed to file",
            type: "string",
        }
    }, {
        name: "o",
        option: {
            alias: "stdout",
            describe: "send video feed to stdout for playback. eg: ... -o | ffplay -",
            type: "boolean",
        }
    }, {
        name: "s",
        option: {
            alias: 'readsize',
            describe: 'size in bytes to queue for usb bulk interface reads',
            default: 512,
            type: 'integer'
        }
    }, {
        name: "q",
        option: {
            alias: 'queuesize',
            describe: 'number of polling usb bulk read requests to keep in flight',
            default: 3,
            type: 'integer'
        }
    }, {
        name: "v",
        option: {
            alias: 'verbose',
            describe: 'be noisy - does not play well with -o',
            type: 'boolean'
        }
    }, {
        name: "ffbin",
        option: {
            default: "./.ffbinaries",
            describe: "binaries location for ffbinaries download",
            type: "string",
        },
    }, {
        name: "platform",
        option: {
            type: "string",
            default: undefined,
            describe: `Platform for FFBinaries: ${listPlatforms().map(p => `"${p as string}"`).join(" | ")}`
        }
    }, {
        name: "force",
        option: {
            type: "boolean",
            default: false,
            describe: "force download and stuff",
        }
    }, {
        name: "ffversion",
        option: {
            alias: "ffbinversionforce",
            type: "string",
            default: undefined,
            describe: "choose another version of ff binaries"
        }
    }
]