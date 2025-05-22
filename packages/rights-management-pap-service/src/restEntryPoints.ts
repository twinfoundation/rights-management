// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRestRouteEntryPoint } from "@twin.org/api-models";

/**
 * Tags for the PAP REST API.
 */
export const tagsPap = [
	{
		name: "Policy Administration Point",
		description: "Operations for Policy Administration Point"
	}
];

/**
 * Entry points for the REST API.
 */
export const restEntryPoints: IRestRouteEntryPoint[] = [
	{
		name: "rights-management-pap",
		defaultBaseRoute: "rights-management/pap",
		tags: [tagsPap]
	}
];
