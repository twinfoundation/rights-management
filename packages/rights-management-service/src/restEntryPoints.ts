// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRestRouteEntryPoint } from "@twin.org/api-models";
import { generateRestRoutes, tags } from "./rightsManagementRoutes";

/**
 * Entry points for the REST API.
 */
export const restEntryPoints: IRestRouteEntryPoint[] = [
	{
		name: "rights-management",
		defaultBaseRoute: "rights-management",
		tags,
		generateRoutes: generateRestRoutes
	}
];
