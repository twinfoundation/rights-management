// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IEntityStorageComponent } from "@twin.org/entity-storage-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Options for the Policy Administration Point Component constructor.
 */
export interface IPolicyAdministrationPointComponentOptions {
	/**
	 * The entity storage component for storing policies.
	 */
	entityStorage: IEntityStorageComponent<IOdrlPolicy>;

	/**
	 * Configuration options for the Policy Administration Point.
	 */
	config?: {
		/**
		 * The maximum number of policies to return in a query.
		 * Defaults to 100.
		 */
		maxQueryResults?: number;
	};
}
