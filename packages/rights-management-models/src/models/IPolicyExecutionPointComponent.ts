// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { PolicyActionCallback } from "./policyActionCallback";

/**
 * Interface describing a Policy Execution Point (PXP) contract.
 * When a decision is made by the Policy Decision Point (PDP),
 * the Policy Execution Point (PEP) will execute any
 * registered actions based on the decision.
 */
export interface IPolicyExecutionPointComponent extends IComponent {
	/**
	 * Execute actions based on the PDP's decisions.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data used in the decision by the PDP.
	 * @param userIdentity The user identity to use in the decision making.
	 * @param nodeIdentity The node identity to use in the decision making.
	 * @param policies The policies that apply to the data.
	 * @returns Nothing.
	 */
	executeActions<T = unknown>(
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string,
		nodeIdentity: string,
		policies: IOdrlPolicy[]
	): Promise<void>;

	/**
	 * Register an action to be executed.
	 * @param actionId The id of the action to register.
	 * @param action The action to execute.
	 * @returns Nothing.
	 */
	registerAction<T = unknown>(actionId: string, action: PolicyActionCallback<T>): Promise<void>;

	/**
	 * Unregister an action from the execution point.
	 * @param actionId The id of the action to unregister.
	 * @returns Nothing.
	 */
	unregisterAction(actionId: string): Promise<void>;
}
