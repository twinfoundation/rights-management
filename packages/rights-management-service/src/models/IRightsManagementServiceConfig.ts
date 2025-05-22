// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The configuration for the RightsManagementService.
 */
export interface IRightsManagementServiceConfig {
	/**
	 * The namespace for the PAP component.
	 */
	papNamespace?: string;

	/**
	 * The default entity storage type.
	 */
	defaultEntityStorageType?: string;

	/**
	 * Should the user identity be included in entity storage operations.
	 */
	includeUserIdentity?: boolean;

	/**
	 * Should the node identity be included in entity storage operations.
	 */
	includeNodeIdentity?: boolean;

	/**
	 * The maximum number of results to return in a query.
	 */
	maxQueryResults?: number;
}
