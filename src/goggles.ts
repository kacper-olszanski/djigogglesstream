import { findByIds } from "usb";
import { Device } from "usb/dist/usb";
import { InEndpoint } from "usb/dist/usb/endpoint";
import { Interface } from "usb/dist/usb/interface";

class Goggles {

    private instance: Device;

    private interfaces: {[id: number]: Interface} = {};

    private constructor(device: Device) {
        this.instance = device;
    }

    public static connect(): Goggles | undefined {
        const device = findByIds(0x2ca3, 0x1f);
        if(!device) {
            console.error(ErrorMsg.NOT_FOUND)
            return undefined;
        }

        return new Goggles(device!);
    }

    open(): void {
        if (!this.instance.interfaces) {
            console.error(ErrorMsg.COULD_NOT_OPEN)
            throw new Error(ErrorMsg.COULD_NOT_OPEN)
        }
    }

    getInterface(id: number): Interface {
        if (this.interfaces[id]) {
            return this.interfaces[id];
        }
        const goggleInterface = this.instance.interface(id);
        goggleInterface.claim();
        if (!goggleInterface.endpoints) {
            console.error(ErrorMsg.BULK_ERROR)
            throw new Error(ErrorMsg.BULK_ERROR)
        }
        this.interfaces[id] = goggleInterface;
        return goggleInterface;
    }

    private iface?: Interface;
    private inpoint?: InEndpoint;
    private outpoint?: InEndpoint;

    initStreamFromGoggle(argv: any,  dataListener: (...args: any[]) => void) {
        this.open();
        this.iface = this.getInterface(3);

        this.inpoint = this.iface.endpoints[1] as InEndpoint;
        this.inpoint.timeout = 100
        //outpoint.timeout = 200

        this.outpoint = this.iface.endpoints[0] as InEndpoint
        const magic = Buffer.from("524d5654", "hex");

        this.outpoint.transfer(magic as unknown as number, (error: any, buff: any) => {
            if(error) {
                console.error(error)
            }
            console.debug("send magic bytes")
        })
        
        this.inpoint.addListener("data", dataListener);
        
        this.inpoint.addListener("error", (error: any) => {
            console.error(error)
        })

        this.inpoint.startPoll(argv.q, argv.s)
    }

    stop() {
        if (this.outpoint) {
            this.outpoint.stopPoll(() => console.log("outpoint stop"))
        }
        if (this.inpoint) {
            this.inpoint.stopPoll(() => console.log("inpoint stop"))
        }
        if (this.iface) {
            this.iface.release();
        }
    }
}

export default Goggles;

const enum ErrorMsg {
    NOT_FOUND = "Goggles USB device not found. Please connect your goggles.",
    COULD_NOT_OPEN = "Couldn't open Goggles USB device.",
    BULK_ERROR = "Couldn't claim bulk interface.",
}