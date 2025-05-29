// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRightsManagementServiceConfig } from "./IRightsManagementServiceConfig";

/**
 * The constructor options for the RightsManagementService.
 */
export interface IRightsManagementServiceConstructorOptions {
	/**
	 * The type of the Policy Administration Point (PAP) component.
	 * @default pap
	 */
	papComponentType?: string;

	/**
	 * The configuration for the service.
	 */
	config?: IRightsManagementServiceConfig;
}
