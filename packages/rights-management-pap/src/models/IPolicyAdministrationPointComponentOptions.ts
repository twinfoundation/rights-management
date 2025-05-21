// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IEntityStorageComponent } from "@twin.org/entity-storage-models";
import type { OdrlPolicy } from "../entities/odrlPolicy";

/**
 * Options for the Policy Administration Point Component.
 */
export interface IPolicyAdministrationPointComponentOptions {
	/**
	 * The entity storage component for storing policies.
	 */
	entityStorage: IEntityStorageComponent<OdrlPolicy>;

	/**
	 * Configuration options for the Policy Administration Point.
	 */
	config?: {
		/**
		 * The maximum number of policies to return in a query.
		 * Defaults to 100.
		 */
		maxQueryResults?: number;
		/**
		 * Include the user identity when performing storage operations, defaults to true.
		 */
		includeUserIdentity?: boolean;
		/**
		 * Include the node identity when performing storage operations, defaults to true.
		 */
		includeNodeIdentity?: boolean;
	};
}
