// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * The request structure for updating a policy.
 */
export interface IPapUpdateRequest {
	/**
	 * The body of the request.
	 */
	body: {
		/**
		 * The policy to update (must include uid).
		 */
		policy: IOdrlPolicy;
	};
}
