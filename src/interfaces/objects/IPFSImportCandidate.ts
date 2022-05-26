import { ReadableStream } from "stream/web";

type IPFSImportCandidateContentType =
	| string
	| InstanceType<typeof String>
	| ArrayBufferView
	| ArrayBuffer
	| Blob
	| ReadableStream<Uint8Array>;

export class IPFSImportCandidate {
	public constructor(
		public path: string,
		public filename: string,
		public content: IPFSImportCandidateContentType,
	) {}
}
