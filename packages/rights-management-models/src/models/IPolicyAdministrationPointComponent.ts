// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Interface describing a Policy Administration Point (PAP) contract.
 * Manages policies for the rights management, policies are also queried by the
 * Policy Management Point (PMP) when it handles requests from the Policy Decision Point (PDP).
 */
export interface IPolicyAdministrationPointComponent extends IComponent {
	/**
	 * Store a policy.
	 * @param policy The policy to store.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Nothing.
	 */
	store(policy: IOdrlPolicy, userIdentity?: string, nodeIdentity?: string): Promise<void>;

	/**
	 * Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns The policy.
	 */
	retrieve(policyId: string, userIdentity?: string, nodeIdentity?: string): Promise<IOdrlPolicy>;

	/**
	 * Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Nothing.
	 */
	remove(policyId: string, userIdentity?: string, nodeIdentity?: string): Promise<void>;

	/**
	 * Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	query(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<{
		/**
		 * The cursor for the next page of results.
		 */
		cursor?: string;

		/**
		 * The policies that match the query.
		 */
		policies: IOdrlPolicy[];
	}>;
}
