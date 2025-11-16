/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED. DO NOT EDIT.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as favorites from "../favorites.js";
import type * as listings from "../listings.js";
import type * as reservations from "../reservations.js";
import type * as schema from "../schema.js";
import type * as users from "../users.js";

/**
 * A utility for type-safe Convex API calls.
 *
 * This is a placeholder that will be replaced by the actual generated API.
 * Run `npx convex dev` to generate the real API types.
 */
export const api: FilterApi<
  ApiFromModules<{
    favorites: typeof favorites;
    listings: typeof listings;
    reservations: typeof reservations;
    schema: typeof schema;
    users: typeof users;
  }>,
  FunctionReference<any, "public">
> = {} as any;

export type Api = typeof api;

/* prettier-ignore-end */

