# ¯ヾ(⌐■_■)ノ♪¯
**voc-poc** is a proof of concept for video put from the DJI FPV Goggles over USB.

 
# tl;dr;

Install **nodejs**, **yarn** and the Javascript dependencies

    yarn install
    
Connect your DJI FPV goggles to your PC, power on your quad, make sure the stream is connected and run:

    yarn run
    
If all goes well voc-poc will find your DJI Goggles, obtain the USB interface and write the raw video stream to outfile.bin.

If you want to preview the stream live install ffplay (part of the **ffmpeg** package) and use the -o option.

    yarn run -o | ffplay -i - -analyzeduration 1 -probesize 32 -sync ext

If you want to produce a nice outfile.mp4, pipe the output through ffmpeg:

    yarn run -o | ffmpeg -vcodec copy outfile.mp4 -i -

If needed -o and -f may be combined.

See `yarn run --help` for more options.

## Troubleshooting
If you get USB errors on Windows make sure the Goggles Bulk Transfer Endpoint is using WinUSB drivers using [Zadiq](https://zadig.akeo.ie/).

## How does this work

It sends the magic `0x524d5654` packet to the USB Bulk Transfer Out Endpoint on the Goggles and starts dumping data from the USB Bulk Transfer Out Endpoint to file or stdout.

## The Protocol
The Goggles have a Bulk Transfer Endpoint. To initiate the video stream one has to simply send `0x524d5654` to the Out Bulk Endpoint and then Listen on the In Bulk Endpoint for data.

The data format is currently largely unknown:

 - `0x00010910` seems to indicate the beginning of some sort of h264 frame according to [this](https://github.com/district-michael/fpv_live/blob/4c7bb40e5cc5daec67b39cc093235afb959a4bfe/src/main/java/com/dji/video/framing/internal/parser/VideoFrameParser.java#L47).
 - Followed by a 6 byte (frame?) counter
 - Which is always followed by `0xc867ff`?

In any case, ffmpeg and other an make sense of it.

## Todo
### Essential

 - ~~Get data out over USB~~
 - ~~Figure out the packet structure~~
	 - It sort of just works
 - ~~Mux together an mp4 stream for output~~
	 - ffmpeg is good enough for the time being

### Nice to have

 - ~~Set the output file path via cli~~
 - ~~More error handling~~
 - ~~Wait for Goggles to appear if not connected~~
 - Reconnect (and re send magic packet) when connection lost
 - Support multiple Goggles

## Why Nodejs?

Why not?

## Support the effort

TODO: add support links
