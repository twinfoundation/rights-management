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
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Nothing.
	 */
	papStore(policy: IOdrlPolicy, userIdentity?: string, nodeIdentity?: string): Promise<void>;

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns The policy.
	 */
	papRetrieve(policyId: string, userIdentity?: string, nodeIdentity?: string): Promise<IOdrlPolicy>;

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Nothing.
	 */
	papRemove(policyId: string, userIdentity?: string, nodeIdentity?: string): Promise<void>;

	/**
	 * PAP: Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	papQuery(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}>;

	// Additional component methods will be added here as they are implemented
	// For example: pepIntercept, pdpDecide, pipRetrieveAttributes, etc.
}
