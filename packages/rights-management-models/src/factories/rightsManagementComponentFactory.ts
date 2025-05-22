// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IRightsManagementComponent } from "../models/IRightsManagementComponent";

/**
 * Factory for creating Rights Management components.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const RightsManagementComponentFactory =
	Factory.createFactory<IRightsManagementComponent>("rights-management");
