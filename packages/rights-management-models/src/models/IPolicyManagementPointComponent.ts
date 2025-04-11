// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Interface describing a Policy Management Point (PMP) contract.
 * Provide the policies to the Policy Decision Point (PDP) based on the data and identities.
 */
export interface IPolicyManagementPointComponent extends IComponent {
	/**
	 * Get the policies from a PAP based on the data and identities.
	 * @param assetType The type of asset being processed.
	 * @param action The action being performed on the asset.
	 * @param data The data to retrieve the policies for.
	 * @param userIdentity The user identity to retrieve the policies for.
	 * @param nodeIdentity The node identity to retrieve the policies for.
	 * @returns Returns the policies which apply to the data and identities so that the PDP can make a decision.
	 */
	retrieve<T = unknown>(
		assetType: string,
		action: string,
		data: T | undefined,
		userIdentity: string,
		nodeIdentity: string
	): Promise<IOdrlPolicy[]>;
}
