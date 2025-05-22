// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { EntityCondition } from "@twin.org/entity";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * The request structure for querying policies.
 */
export interface IPapQueryRequest {
	/**
	 * The query parameters of the request.
	 */
	query?: {
		/**
		 * The cursor for pagination.
		 */
		cursor?: string;
	};

	/**
	 * The body of the request.
	 */
	body?: {
		/**
		 * The conditions to use in the query.
		 */
		conditions?: EntityCondition<IOdrlPolicy>;
	};
}
