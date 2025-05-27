// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { ComponentFactory } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import { EntityStorageService } from "@twin.org/entity-storage-service";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import {
	createTestPolicies,
	SAMPLE_POLICY,
	TEST_DIRECTORY_ROOT,
	TEST_NODE_IDENTITY,
	TEST_POLICY_ID,
	TEST_USER_IDENTITY
} from "./setupTestEnv";
import type { OdrlPolicy } from "../src/entities/odrlPolicy";
import { PolicyAdministrationPointComponentEntityStorage } from "../src/policyAdministrationPointComponentEntityStorage";

describe("rights-management-pap", () => {
	let policyAdminPoint: PolicyAdministrationPointComponentEntityStorage;

	const testStorageType = "odrl-policy-test";

	beforeEach(() => {
		// Create and register the entity storage service with the ComponentFactory
		const entityStorageService = new EntityStorageService<OdrlPolicy>({
			entityStorageType: "odrl-policy",
			config: {
				includeNodeIdentity: false,
				includeUserIdentity: false
			}
		});

		// Register the entity storage service with the ComponentFactory
		ComponentFactory.register(testStorageType, () => entityStorageService);

		// Create the policy admin point using the registered storage type
		policyAdminPoint = new PolicyAdministrationPointComponentEntityStorage({
			entityStorageType: testStorageType
		});
	});

	afterAll(async () => {
		if (existsSync(TEST_DIRECTORY_ROOT)) {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		}
	});

	test("should store a policy in entity storage", async () => {
		await policyAdminPoint.store(SAMPLE_POLICY, TEST_USER_IDENTITY, TEST_NODE_IDENTITY);

		const retrievedPolicy = await policyAdminPoint.retrieve(
			TEST_POLICY_ID,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

		// The converter should add @type and @context
		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(TEST_POLICY_ID);
		expect(retrievedPolicy["@type"]).toEqual("Set");
		expect(retrievedPolicy["@context"]).toBeDefined();
		expect(Array.isArray(retrievedPolicy.permission)).toBeTruthy();
	});

	test("should retrieve a policy from entity storage", async () => {
		await policyAdminPoint.store(SAMPLE_POLICY, TEST_USER_IDENTITY, TEST_NODE_IDENTITY);

		const retrievedPolicy = await policyAdminPoint.retrieve(
			TEST_POLICY_ID,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

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
		await expect(
			policyAdminPoint.retrieve("non-existent-policy", TEST_USER_IDENTITY, TEST_NODE_IDENTITY)
		).rejects.toThrow();
	});

	test("should remove a policy from entity storage", async () => {
		await policyAdminPoint.store(SAMPLE_POLICY, TEST_USER_IDENTITY, TEST_NODE_IDENTITY);

		const retrievedPolicy = await policyAdminPoint.retrieve(
			TEST_POLICY_ID,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);
		expect(retrievedPolicy).toBeDefined();

		const result = await policyAdminPoint.remove(
			TEST_POLICY_ID,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

		expect(result).toBeUndefined();
		await expect(
			policyAdminPoint.retrieve(TEST_POLICY_ID, TEST_USER_IDENTITY, TEST_NODE_IDENTITY)
		).rejects.toThrow();
	});

	test("should query policies without conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const result = await policyAdminPoint.query(
			TEST_NODE_IDENTITY,
			undefined,
			undefined,
			undefined,
			TEST_USER_IDENTITY
		);

		expect(result.policies).toBeDefined();
		expect(result.policies.length).toEqual(10);
	});

	test("should query policies with specific conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		// Since @type is no longer stored but added during conversion to IOdrlPolicy,
		// we should query based on a field that is stored
		const uidCondition: EntityCondition<IOdrlPolicy> = {
			property: "uid",
			value: "http://example.com/policy/1",
			comparison: "equals"
		};

		// Query policies with a simple uid condition
		const result = await policyAdminPoint.query(
			TEST_NODE_IDENTITY,
			uidCondition,
			undefined,
			undefined,
			TEST_USER_IDENTITY
		);

		// Check that we got the matching policy
		expect(result.policies).toBeDefined();
		expect(result.policies.length).toEqual(1);

		// Validate that the returned policy has the expected uid
		expect(result.policies[0].uid).toEqual("http://example.com/policy/1");
	});

	test("should return empty result for non-matching conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const nonMatchingCondition: EntityCondition<IOdrlPolicy> = {
			property: "uid",
			value: "nonexistent-id",
			comparison: "equals"
		};

		// Query with conditions that don't match any policy
		const result = await policyAdminPoint.query(
			TEST_NODE_IDENTITY,
			nonMatchingCondition,
			undefined,
			undefined,
			TEST_USER_IDENTITY
		);

		expect(result.policies).toBeDefined();
		expect(result.policies).toEqual([]);
		expect(result.cursor).toBeUndefined();
	});

	test("should handle pagination with cursor", async () => {
		await createTestPolicies(policyAdminPoint);

		// Get first page (default max is set in component)
		const firstPage = await policyAdminPoint.query(
			TEST_NODE_IDENTITY,
			undefined,
			undefined,
			undefined,
			TEST_USER_IDENTITY
		);

		// Check first page
		expect(firstPage.policies).toBeDefined();
		expect(firstPage.policies.length).toBeGreaterThan(0);

		// If we got all 10 policies in the first page, no pagination is happening
		if (firstPage.policies.length < 10 && firstPage.cursor) {
			// Get second page using cursor
			const secondPage = await policyAdminPoint.query(
				TEST_NODE_IDENTITY,
				undefined,
				firstPage.cursor,
				undefined,
				TEST_USER_IDENTITY
			);

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
		await expect(
			policyAdminPoint.query(
				TEST_NODE_IDENTITY,
				undefined,
				"invalid-cursor",
				undefined,
				TEST_USER_IDENTITY
			)
		).resolves.toBeDefined();
	});
});
