// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { OdrlPolicy } from "./entities/odrlPolicy";

/**
 * Initialize the schema for the rights management policy administration point.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<OdrlPolicy>(), () =>
		EntitySchemaHelper.getSchema(OdrlPolicy)
	);
}
