import yargs from "yargs";

export type Yrg = {
  f?: string;
  o?: boolean;
  s: number;
  q: number;
  v?: boolean;
  h?: any;
}

type ArgOptionType = 'string' | 'integer' | 'double' | 'boolean';
type ArgOptionDefault = string | number | boolean;

export type ArgOption = {
  name: string;
  option: {
    alias: string;
    describe: string;
    default?: ArgOptionDefault;
    type: ArgOptionType;
  }
}

export const sleep = (duration: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }

  export const initYargs = (options: Array<ArgOption> = []): Yrg => {
    options.forEach(option => {
      (yargs as any).option(option.name, option.option);
    })

    return (yargs as any).help()
    .alias('help', 'h').argv as Yrg;
  }

  export const defaultArgs: Array<ArgOption> = [
    {
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
    }

  ]