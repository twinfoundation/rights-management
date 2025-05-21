// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRestRouteEntryPoint } from "@twin.org/api-models";
import { generateRestRoutesPap, tagsPap } from "./rightsManagementPapRoutes";

export const restEntryPoints: IRestRouteEntryPoint[] = [
	{
		name: "pap",
		defaultBaseRoute: "pap",
		tags: tagsPap,
		generateRoutes: generateRestRoutesPap
	}
];
