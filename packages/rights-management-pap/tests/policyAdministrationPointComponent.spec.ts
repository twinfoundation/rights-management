// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import type { EntityCondition } from "@twin.org/entity";
import { EntityStorageService } from "@twin.org/entity-storage-service";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import {
	createTestPolicies,
	SAMPLE_POLICY,
	TEST_DIRECTORY_ROOT,
	TEST_POLICY_ID
} from "./setupTestEnv";
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
		// Only attempt to remove the directory if it exists
		if (existsSync(TEST_DIRECTORY_ROOT)) {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		}
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

	test("should remove a policy from entity storage", async () => {
		await policyAdminPoint.store(SAMPLE_POLICY);

		const retrievedPolicy = await policyAdminPoint.retrieve(TEST_POLICY_ID);
		expect(retrievedPolicy).toBeDefined();

		const result = await policyAdminPoint.remove(TEST_POLICY_ID);

		expect(result).toBeUndefined();
		await expect(policyAdminPoint.retrieve(TEST_POLICY_ID)).rejects.toThrow();
	});

	describe("query method", () => {
		test("should query policies without conditions", async () => {
			await createTestPolicies(policyAdminPoint);

			const result = await policyAdminPoint.query();

			expect(result.policies).toBeDefined();
			expect(result.policies.length).toEqual(10);
		});

		test("should query policies with specific conditions", async () => {
			await createTestPolicies(policyAdminPoint);

			// Create a condition for policies of type "Offer" using proper IComparator structure
			const typeCondition: EntityCondition<IOdrlPolicy> = {
				property: "@type",
				value: "Offer",
				comparison: "equals"
			};

			// Query policies with the type condition
			const result = await policyAdminPoint.query(typeCondition);

			// Check only "Offer" policies were returned
			expect(result.policies).toBeDefined();
			expect(result.policies.length).toEqual(5);

			// Validate that only Offer policies were returned
			for (const policy of result.policies) {
				expect(policy["@type"]).toEqual("Offer");
			}
		});

		test("should return empty result for non-matching conditions", async () => {
			await createTestPolicies(policyAdminPoint);

			// Condition that won't match any policy using proper IComparator structure
			const nonMatchingCondition: EntityCondition<IOdrlPolicy> = {
				property: "@type",
				value: "NonExistentType",
				comparison: "equals"
			};

			// Query with conditions that don't match any policy
			const result = await policyAdminPoint.query(nonMatchingCondition);

			expect(result.policies).toBeDefined();
			expect(result.policies).toEqual([]);
			expect(result.cursor).toBeUndefined();
		});

		test("should handle pagination with cursor", async () => {
			await createTestPolicies(policyAdminPoint);

			// Get first page (default max is set in component)
			const firstPage = await policyAdminPoint.query();

			// Check first page
			expect(firstPage.policies).toBeDefined();
			expect(firstPage.policies.length).toBeGreaterThan(0);

			// If we got all 10 policies in the first page, no pagination is happening
			if (firstPage.policies.length < 10 && firstPage.cursor) {
				// Get second page using cursor
				const secondPage = await policyAdminPoint.query(undefined, firstPage.cursor);

				// Check second page
				expect(secondPage.policies).toBeDefined();
				expect(secondPage.policies.length).toBeGreaterThan(0);

				// Combine pages and verify no duplicates
				const allPolicyIds = [
					...firstPage.policies.map(p => p.uid),
					...secondPage.policies.map(p => p.uid)
				];

				const uniqueIds = new Set(allPolicyIds);
				expect(uniqueIds.size).toEqual(allPolicyIds.length);
				expect(uniqueIds.size).toBeGreaterThanOrEqual(10);
			}
		});

		test("should handle invalid cursor gracefully", async () => {
			await createTestPolicies(policyAdminPoint);

			await expect(policyAdminPoint.query(undefined, "invalid-cursor")).resolves.toBeDefined();
		});
	});
});
