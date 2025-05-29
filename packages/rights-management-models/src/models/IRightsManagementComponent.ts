// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Interface describing a unified Rights Management Component.
 * This serves as a single point of entry for all rights management operations.
 */
export interface IRightsManagementComponent extends IComponent {
	/**
	 * PAP: Store a policy.
	 * @param policy The policy to store.
	 * @returns Nothing.
	 */
	papStore(policy: IOdrlPolicy): Promise<void>;

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @returns The policy.
	 */
	papRetrieve(policyId: string): Promise<IOdrlPolicy>;

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	papRemove(policyId: string): Promise<void>;

	/**
	 * PAP: Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	papQuery(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		pageSize?: number
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}>;

	// Additional component methods will be added here as they are implemented
	// For example: pepIntercept, pdpDecide, pipRetrieveAttributes, etc.
}
