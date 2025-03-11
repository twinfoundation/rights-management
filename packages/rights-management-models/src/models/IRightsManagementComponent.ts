// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing an rights management contract.
 */
export interface IRightsManagementComponent extends IComponent {
	/**
	 * Dummy method.
	 * @returns Nothing.
	 */
	dummy(): Promise<void>;
}
