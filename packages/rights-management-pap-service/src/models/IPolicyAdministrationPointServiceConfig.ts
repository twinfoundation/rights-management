// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Rights Management PAP Service.
 */
export interface IPolicyAdministrationPointServiceConfig {
	/**
	 * What is the default connector to use for PAP. If not provided the first connector from the factory will be used.
	 */
	defaultNamespace?: string;
}
