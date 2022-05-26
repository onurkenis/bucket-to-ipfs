import { Brand, make } from "ts-brand";

export type UrlString = Brand<string, "UrlString">;
export const UrlString = make<UrlString>();
