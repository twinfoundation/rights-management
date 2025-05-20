// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import path from "node:path";
import { Converter, RandomHelper } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import { OdrlContexts, type IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import * as dotenv from "dotenv";
import type { OdrlPolicy } from "../src/entities/odrlPolicy";
import { initSchema } from "../src/schema";

console.debug("Setting up test environment from .env and .env.dev files");

dotenv.config({ path: [path.join(__dirname, ".env"), path.join(__dirname, ".env.dev")] });

export const TEST_DIRECTORY_ROOT = "./.tmp/";
export const TEST_DIRECTORY = `${TEST_DIRECTORY_ROOT}test-data-${Converter.bytesToHex(RandomHelper.generate(8))}`;

export const TEST_POLICY_ID = "http://example.com/policy/1";
export const TEST_ASSET_ID = "http://example.com/asset/1";

export const SAMPLE_POLICY: IOdrlPolicy = {
	"@context": OdrlContexts.Context,
	"@type": "Set",
	uid: TEST_POLICY_ID,
	permission: [
		{
			target: TEST_ASSET_ID,
			action: "use"
		}
	]
};

// Initialize the schema for the OdrlPolicy entity
initSchema();

// Register the memory storage connector for ODRL policies
EntityStorageConnectorFactory.register(
	"odrl-policy",
	() =>
		new MemoryEntityStorageConnector<OdrlPolicy>({
			entitySchema: nameof<OdrlPolicy>()
		})
);
