import type { LocaleContent, RouteLocale } from "./types";
import { en } from "./en";
import { de } from "./de";
import { hu } from "./hu";
import { pl } from "./pl";

export * from "./types";

export const ROUTE_CONTENT: Record<RouteLocale, LocaleContent> = { en, de, hu, pl };
