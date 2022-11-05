import yargs from "yargs";
import { downloadBinaries as ffBin, DownloadOptions, listPlatforms, Platform } from "ffbinaries";
import { RunConfig } from "./config";

export const downloadBinaries = (options: DownloadOptions = {}): Promise<void> => {
  return new Promise(resolve => {
    ffBin(['ffplay', 'ffmpeg'], options, () => {
      resolve();
    });
  })
}

export type Yrg = {
  f?: string;
  o?: boolean;
  p?: boolean;
  m?: RunConfig;
  s: number;
  q: number;
  v?: boolean;
  h?: any;
  ffbin: string;
  platform?: Platform;
  ffversion?: string;
  force: boolean;
}

type ArgOptionType = 'string' | 'integer' | 'double' | 'boolean';
type ArgOptionDefault = string | number | boolean;

export type ArgOption = {
  name: string;
  option: {
    alias?: string;
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

export const getRunConfigOptions = (config?: RunConfig): string[] => {
  if (config !== undefined) {
    switch (config) {
        case RunConfig.DEFAULT:
            return `-i - -analyzeduration 1 -fflags -nobuffer -probesize 32 -sync ext`.split(" ");
        case RunConfig.HYBRID:
            return `-i - -analyzeduration 1 -fflags -nobuffer -probesize 32 -sync ext -gpu 1`.split(" ");
        case RunConfig.LOW_LATENCY:
            return `-i - -fast -fflags nobuffer -flags low_delay -strict experimental -vf "setpts=N/60/TB" -af "asetpts=N/60/TB" -noframedrop`.split(" ");

    }
  }
  return [];
}