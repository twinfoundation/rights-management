// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IEntityStorageComponent } from "@twin.org/entity-storage-models";
import { PolicyAdministrationPointComponentFactory } from "@twin.org/rights-management-models";
import type { OdrlPolicy } from "./entities/odrlPolicy";
import type { IPolicyAdministrationPointComponentEntityStorageOptions } from "./models/IPolicyAdministrationPointComponentEntityStorageOptions";
import { PolicyAdministrationPointComponentEntityStorage } from "./policyAdministrationPointComponentEntityStorage";

/**
 * Register the entity storage implementation of the Policy Administration Point component with the factory.
 * @param options Options for creating the component.
 */
export function registerEntityStoragePolicyAdministrationPointComponent(
	options: IPolicyAdministrationPointComponentEntityStorageOptions
): void {
	PolicyAdministrationPointComponentFactory.register(
		PolicyAdministrationPointComponentEntityStorage.NAMESPACE,
		() => new PolicyAdministrationPointComponentEntityStorage(options)
	);
}

/**
 * Create a factory function for the entity storage policy administration point component.
 * @param entityStorage The entity storage component to use.
 * @param maxQueryResults The maximum number of query results to return.
 * @returns A function that creates a new entity storage policy administration point component.
 */
export function createEntityStoragePolicyAdministrationPointComponentFactory(
	entityStorage: IEntityStorageComponent<OdrlPolicy>,
	maxQueryResults?: number
): () => PolicyAdministrationPointComponentEntityStorage {
	return () =>
		new PolicyAdministrationPointComponentEntityStorage({
			entityStorage,
			config: {
				maxQueryResults
			}
		});
}
