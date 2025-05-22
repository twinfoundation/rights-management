// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IPolicyAdministrationPointComponent } from "../models/IPolicyAdministrationPointComponent";

/**
 * Factory for creating Policy Administration Point components.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PolicyAdministrationPointComponentFactory =
	Factory.createFactory<IPolicyAdministrationPointComponent>("policy-administration-point");
