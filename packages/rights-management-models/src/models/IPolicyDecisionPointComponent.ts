// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Interface describing a Policy Decision Point (PDP) contract.
 * Decides if a party can be granted access to a resource, will retrieve policies
 * from the Policy Management Point (PMP) and any additional information from the
 * Policy Information Point (PIP). When a decision is made, the Policy Execution
 * Point (PEP) will execute any registered actions.
 */
export interface IPolicyDecisionPointComponent extends IComponent {
	/**
	 * Evaluate requests from a Policy Enforcement Point (PEP).
	 * Uses the Policy Management Point (PMP) to retrieve the policies and the
	 * Policy Information Point (PIP) to retrieve additional information.
	 * Executes any actions on the Policy Execution Point (PEP) when the decision is made.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data to make a decision on.
	 * @param userIdentity The user identity to use in the decision making.
	 * @param nodeIdentity The node identity to use in the decision making.
	 * @returns Returns the policy decisions which apply to the data so that the PEP
	 * can manipulate the data accordingly.
	 */
	evaluate<T = unknown>(
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string,
		nodeIdentity: string
	): Promise<IOdrlPolicy[]>;
}
