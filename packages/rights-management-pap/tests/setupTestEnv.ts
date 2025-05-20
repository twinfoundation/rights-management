// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import path from "node:path";
import { Converter, RandomHelper } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import {
	type ActionType,
	OdrlContexts,
	type PolicyType,
	type IOdrlPolicy
} from "@twin.org/standards-w3c-odrl";
import * as dotenv from "dotenv";
import type { OdrlPolicy } from "../src/entities/odrlPolicy";
import type { PolicyAdministrationPointComponent } from "../src/policyAdministrationPointComponent";
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

// Helper function to create test policies
const createTestPolicy = (
	id: string,
	policyType: PolicyType,
	assetId: string,
	action: ActionType
): IOdrlPolicy => ({
	"@context": OdrlContexts.Context,
	"@type": policyType,
	uid: `http://example.com/policy/${id}`,
	permission: [
		{
			target: assetId,
			action
		}
	]
});

// Create multiple policies with different attributes for testing
export const createTestPolicies = async (
	policyAdminPoint: PolicyAdministrationPointComponent
): Promise<void> => {
	// Store 10 policies with different types and targets
	for (let i = 1; i <= 10; i++) {
		const policyType = i % 2 === 0 ? ("Set" as PolicyType) : ("Offer" as PolicyType);
		const assetId = `http://example.com/asset/${Math.ceil(i / 2)}`;
		const action = i % 3 === 0 ? ("display" as ActionType) : ("use" as ActionType);

		await policyAdminPoint.store(createTestPolicy(i.toString(), policyType, assetId, action));
	}
};
