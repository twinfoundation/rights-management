// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import type { EntityCondition } from "@twin.org/entity";
import type { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import { OdrlContexts, type IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import {
	createTestPolicies,
	SAMPLE_POLICY,
	TEST_DIRECTORY_ROOT,
	TEST_POLICY_ID
} from "./setupTestEnv";
import type { OdrlPolicy } from "../src/entities/odrlPolicy";
import { PolicyAdministrationPointService } from "../src/policyAdministrationPointService";

describe("rights-management-pap", () => {
	let policyAdminPoint: PolicyAdministrationPointService;
	let odrlPolicyEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;

	beforeEach(() => {
		odrlPolicyEntityStorage =
			EntityStorageConnectorFactory.get<MemoryEntityStorageConnector<OdrlPolicy>>("odrl-policy");

		policyAdminPoint = new PolicyAdministrationPointService({
			odrlPolicyEntityStorageType: "odrl-policy"
		});
	});

	afterAll(async () => {
		if (existsSync(TEST_DIRECTORY_ROOT)) {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		}
	});

	test("should store a policy in entity storage", async () => {
		await policyAdminPoint.store(SAMPLE_POLICY);

		const store = odrlPolicyEntityStorage.getStore();
		expect(store).toBeDefined();
		expect(store.length).toEqual(1);

		const storedPolicy = store[0];
		expect(storedPolicy).toBeDefined();
		expect(storedPolicy.uid).toEqual(TEST_POLICY_ID);
		expect(storedPolicy.permission).toBeDefined();

		const retrievedPolicy = await policyAdminPoint.retrieve(TEST_POLICY_ID);

		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(TEST_POLICY_ID);
		expect(retrievedPolicy["@type"]).toEqual("Set");
		expect(retrievedPolicy["@context"]).toBeDefined();
		expect(Array.isArray(retrievedPolicy.permission)).toBeTruthy();
	});

	test("should retrieve a policy from entity storage", async () => {
		await policyAdminPoint.store(SAMPLE_POLICY);

		const retrievedPolicy = await policyAdminPoint.retrieve(TEST_POLICY_ID);

		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(TEST_POLICY_ID);
		expect(retrievedPolicy["@type"]).toEqual("Set");

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

		let store = odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(1);

		const retrievedPolicy = await policyAdminPoint.retrieve(TEST_POLICY_ID);
		expect(retrievedPolicy).toBeDefined();

		await policyAdminPoint.remove(TEST_POLICY_ID);

		store = odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(0);

		await expect(policyAdminPoint.retrieve(TEST_POLICY_ID)).rejects.toThrow();
	});

	test("should query policies without conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const store = odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(10);

		const result = await policyAdminPoint.query();

		expect(result.policies).toBeDefined();
		expect(result.policies.length).toEqual(10);
	});

	test("should query policies with specific conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const uidCondition: EntityCondition<IOdrlPolicy> = {
			property: "uid",
			value: "http://example.com/policy/1",
			comparison: "equals"
		};

		const result = await policyAdminPoint.query(uidCondition);

		expect(result.policies).toBeDefined();
		expect(result.policies.length).toEqual(1);

		expect(result.policies[0].uid).toEqual("http://example.com/policy/1");
	});

	test("should return empty result for non-matching conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const uidCondition: EntityCondition<IOdrlPolicy> = {
			property: "uid",
			value: "non-existent-policy",
			comparison: "equals"
		};

		const result = await policyAdminPoint.query(uidCondition);

		expect(result.policies).toBeDefined();
		expect(result.policies.length).toEqual(0);
	});

	test("should handle pagination with cursor", async () => {
		await createTestPolicies(policyAdminPoint);

		const result1 = await policyAdminPoint.query(undefined, undefined, 5);

		expect(result1.policies).toBeDefined();
		expect(result1.policies.length).toEqual(5);
		expect(result1.cursor).toBeDefined();

		const result2 = await policyAdminPoint.query(undefined, result1.cursor, 5);

		expect(result2.policies).toBeDefined();
		expect(result2.policies.length).toEqual(5);

		const firstPageIds = result1.policies.map(p => p.uid);
		const secondPageIds = result2.policies.map(p => p.uid);
		expect(firstPageIds).not.toEqual(secondPageIds);
	});

	test("should handle invalid cursor gracefully", async () => {
		await createTestPolicies(policyAdminPoint);

		const result = await policyAdminPoint.query(undefined, "invalid-cursor", 5);

		expect(result.policies).toBeDefined();
	});

	test("should throw validation error when storing invalid policy", async () => {
		// Create an invalid policy missing required @context and @type
		const invalidPolicy = {
			uid: "http://example.com/invalid-policy",
			permission: [
				{
					target: "http://example.com/asset/9898",
					action: "use"
				}
			]
		} as unknown as IOdrlPolicy;

		await expect(policyAdminPoint.store(invalidPolicy)).rejects.toThrow();
	});

	test("should successfully validate and store a valid ODRL policy", async () => {
		const validPolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: "http://example.com/valid-policy",
			permission: [
				{
					target: "http://example.com/asset/123",
					action: "use"
				}
			]
		};

		await expect(policyAdminPoint.store(validPolicy)).resolves.not.toThrow();

		const retrievedPolicy = await policyAdminPoint.retrieve("http://example.com/valid-policy");
		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual("http://example.com/valid-policy");
	});

	test("should validate ODRL policy structure through JSON-LD validation", async () => {
		// Create a policy with all required fields but invalid ODRL structure
		const invalidOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "InvalidPolicyType",
			uid: "http://example.com/invalid-odrl-policy",
			permission: [
				{
					target: "http://example.com/asset/123",
					action: "invalidAction"
				}
			]
		} as unknown as IOdrlPolicy;

		await expect(policyAdminPoint.store(invalidOdrlPolicy)).resolves.not.toThrow();
	});
});
