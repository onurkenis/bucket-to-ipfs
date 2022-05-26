import { BaseError } from "@interfaces/objects/BaseError";

export class IPFSUnavailableError extends BaseError {
	constructor(msg: string, src: unknown | null = null) {
		super(msg, 500, "ERR_IPFS_UNAVAILABLE", src, true);
	}
}
