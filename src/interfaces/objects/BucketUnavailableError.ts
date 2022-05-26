import { BaseError } from "@interfaces/objects/BaseError";

export class BucketUnavailableError extends BaseError {
	constructor(msg: string, src: unknown | null = null) {
		super(msg, 500, "ERR_BUCKET_UNAVAILABLE", src, true);
	}
}
