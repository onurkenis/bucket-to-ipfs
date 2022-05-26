import { Brand, make } from "ts-brand";

export type IPFSContentIdentifier = Brand<string, "IPFSContentIdentifier">;
export const IPFSContentIdentifier = make<IPFSContentIdentifier>();
