// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { rm } from "node:fs/promises";
import { EntityStorageService } from "@twin.org/entity-storage-service";
import { SAMPLE_POLICY, TEST_DIRECTORY_ROOT, TEST_POLICY_ID } from "./setupTestEnv";
import type { OdrlPolicy } from "../src/entities/odrlPolicy";
import { PolicyAdministrationPointComponent } from "../src/policyAdministrationPointComponent";

describe("rights-management-pap", () => {
	let policyAdminPoint: PolicyAdministrationPointComponent;

	beforeEach(() => {
		const entityStorageService = new EntityStorageService<OdrlPolicy>({
			entityStorageType: "odrl-policy", // This uses the connector registered in setupTestEnv
			config: {
				includeNodeIdentity: false,
				includeUserIdentity: false
			}
		});

		policyAdminPoint = new PolicyAdministrationPointComponent({
			entityStorage: entityStorageService
		});
	});

	afterAll(async () => {
		try {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		} catch {}
	});

	test("should store a policy in entity storage", async () => {
		await policyAdminPoint.store(SAMPLE_POLICY);

		const retrievedPolicy = await policyAdminPoint.retrieve(TEST_POLICY_ID);

		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(TEST_POLICY_ID);
		expect(retrievedPolicy["@type"]).toEqual("Set");
		expect(Array.isArray(retrievedPolicy.permission)).toBeTruthy();
	});

	test("should retrieve a policy from entity storage", async () => {
		await policyAdminPoint.store(SAMPLE_POLICY);

		const retrievedPolicy = await policyAdminPoint.retrieve(TEST_POLICY_ID);

		// Verify the retrieved policy matches the original
		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(TEST_POLICY_ID);
		expect(retrievedPolicy["@type"]).toEqual("Set");

		// Ensure permission exists on both objects before comparing
		expect(retrievedPolicy.permission).toBeDefined();
		expect(SAMPLE_POLICY.permission).toBeDefined();

		if (retrievedPolicy.permission && SAMPLE_POLICY.permission) {
			expect(retrievedPolicy.permission).toHaveLength(1);
			expect(retrievedPolicy.permission[0].target).toEqual(SAMPLE_POLICY.permission[0].target);
			expect(retrievedPolicy.permission[0].action).toEqual(SAMPLE_POLICY.permission[0].action);
		}
	});

	test("should throw error when retrieving non-existent policy", async () => {
		await expect(policyAdminPoint.retrieve("non-existent-policy")).rejects.toThrow();
	});
});
