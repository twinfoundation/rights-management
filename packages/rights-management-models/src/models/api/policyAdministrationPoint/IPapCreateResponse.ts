// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The response structure for creating a policy.
 */
export interface IPapCreateResponse {
	/**
	 * The body of the response.
	 */
	body: {
		/**
		 * The unique identifier of the created policy.
		 */
		uid: string;
	};
}
