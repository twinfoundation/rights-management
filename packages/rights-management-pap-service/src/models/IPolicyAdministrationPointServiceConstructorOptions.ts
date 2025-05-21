// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IPolicyAdministrationPointServiceConfig } from "./IPolicyAdministrationPointServiceConfig";

/**
 * Options for the rights management pap service constructor.
 */
export interface IPolicyAdministrationPointServiceConstructorOptions {
	/**
	 * The configuration for the service.
	 */
	config?: IPolicyAdministrationPointServiceConfig;
}
