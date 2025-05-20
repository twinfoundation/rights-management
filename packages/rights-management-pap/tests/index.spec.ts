// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { rm } from "node:fs/promises";
import {
	SAMPLE_POLICY,
	TEST_DIRECTORY_ROOT,
	TEST_POLICY_ID,
	entityStorageService
} from "./setupTestEnv";
import type { IPolicyAdministrationPointComponentOptions } from "../src/models/IPolicyAdministrationPointComponentOptions";
import { PolicyAdministrationPointComponent } from "../src/policyAdministrationPointComponent";

describe("rights-management-pap", () => {
	// Create the PAP component with the entity storage service
	let policyAdminPoint: PolicyAdministrationPointComponent;

	beforeEach(() => {
		// Create a new PAP component for each test
		const options: IPolicyAdministrationPointComponentOptions = {
			entityStorage: entityStorageService
		};

		policyAdminPoint = new PolicyAdministrationPointComponent(options);
	});

	// Clean up after all tests
	afterAll(async () => {
		try {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		} catch {}
	});

	test("should store a policy in entity storage", async () => {
		// Act - Store the policy
		await policyAdminPoint.store(SAMPLE_POLICY);

		// Assert - Verify the policy was stored
		const retrievedPolicy = await policyAdminPoint.retrieve(TEST_POLICY_ID);

		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(TEST_POLICY_ID);
		expect(retrievedPolicy["@type"]).toEqual("Set");
		expect(Array.isArray(retrievedPolicy.permission)).toBeTruthy();
	});
});
