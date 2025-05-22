// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IEntityStorageComponent } from "@twin.org/entity-storage-models";
import { PolicyAdministrationPointComponentFactory } from "@twin.org/rights-management-models";
import type { OdrlPolicy } from "./entities/odrlPolicy";
import type { IPolicyAdministrationPointComponentOptions } from "./models/IPolicyAdministrationPointComponentOptions";
import { PolicyAdministrationPointComponent } from "./policyAdministrationPointComponent";

/**
 * Register the entity storage implementation of the Policy Administration Point component with the factory.
 * @param options Options for creating the component.
 */
export function registerEntityStoragePapComponent(
	options: IPolicyAdministrationPointComponentOptions
): void {
	PolicyAdministrationPointComponentFactory.register(
		PolicyAdministrationPointComponent.NAMESPACE,
		() => new PolicyAdministrationPointComponent(options)
	);
}

/**
 * Create a factory function for the entity storage policy administration point component.
 * @param entityStorage The entity storage component to use.
 * @param maxQueryResults The maximum number of query results to return.
 * @returns A function that creates a new entity storage policy administration point component.
 */
export function createEntityStoragePapComponentFactory(
	entityStorage: IEntityStorageComponent<OdrlPolicy>,
	maxQueryResults?: number
): () => PolicyAdministrationPointComponent {
	return () =>
		new PolicyAdministrationPointComponent({
			entityStorage,
			config: {
				maxQueryResults
			}
		});
}
