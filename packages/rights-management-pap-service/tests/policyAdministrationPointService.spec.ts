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

	afterEach(() => {
		odrlPolicyEntityStorage.getStore().length = 0;
	});

	afterAll(async () => {
		if (existsSync(TEST_DIRECTORY_ROOT)) {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		}
	});

	test("should create a policy in entity storage", async () => {
		const result = await policyAdminPoint.create(SAMPLE_POLICY);

		expect(result).toBeDefined();
		expect(result.uid).toEqual(TEST_POLICY_ID);

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
		await policyAdminPoint.create(SAMPLE_POLICY);

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
		await policyAdminPoint.create(SAMPLE_POLICY);

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

	test("should throw validation error when creating invalid policy", async () => {
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

		await expect(policyAdminPoint.create(invalidPolicy)).rejects.toThrow();
	});

	test("should successfully validate and create a valid ODRL policy", async () => {
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

		const result = await policyAdminPoint.create(validPolicy);
		expect(result).toBeDefined();
		expect(result.uid).toEqual("http://example.com/valid-policy");

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

		const result = await policyAdminPoint.create(invalidOdrlPolicy);
		expect(result).toBeDefined();
	});

	test("should auto-generate UID when not provided", async () => {
		const policyWithoutUid = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			permission: [
				{
					target: "http://example.com/asset/123",
					action: "use"
				}
			]
		} as Omit<IOdrlPolicy, "uid">;

		const result = await policyAdminPoint.create(policyWithoutUid);
		expect(result).toBeDefined();
		expect(result.uid).toBeDefined();
		expect(result.uid).toMatch(/^urn:rights-management:/);

		const retrievedPolicy = await policyAdminPoint.retrieve(result.uid);
		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(result.uid);
	});

	test("should throw error when creating policy with existing UID", async () => {
		await policyAdminPoint.create(SAMPLE_POLICY);

		await expect(policyAdminPoint.create(SAMPLE_POLICY)).rejects.toThrow();
	});

	test("should update an existing policy", async () => {
		const createResult = await policyAdminPoint.create(SAMPLE_POLICY);
		const policyId = createResult.uid;

		const updatedPolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: policyId,
			permission: [
				{
					target: "http://example.com/asset/updated",
					action: "read"
				}
			]
		};

		const result = await policyAdminPoint.update(policyId, updatedPolicy);

		expect(result).toBeDefined();
		expect(result.uid).toEqual(policyId);
		expect(result.permission).toBeDefined();
		if (result.permission && result.permission.length > 0) {
			expect(result.permission[0].target).toEqual("http://example.com/asset/updated");
			expect(result.permission[0].action).toEqual("read");
		}
	});

	test("should throw error when updating non-existent policy", async () => {
		const nonExistentId = "http://example.com/non-existent-policy";
		const updatePolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: nonExistentId,
			permission: [
				{
					target: "http://example.com/asset/updated",
					action: "read"
				}
			]
		};

		await expect(policyAdminPoint.update(nonExistentId, updatePolicy)).rejects.toThrow();
	});

	test("should prevent UID updates in update method", async () => {
		const createResult = await policyAdminPoint.create(SAMPLE_POLICY);
		const policyId = createResult.uid;

		// Try to update with different UID
		const updateWithDifferentUid: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: "http://example.com/different-uid",
			permission: [
				{
					target: "http://example.com/asset/updated",
					action: "read"
				}
			]
		};

		await expect(policyAdminPoint.update(policyId, updateWithDifferentUid)).rejects.toThrow();
	});

	test("should deep merge nested objects in update", async () => {
		// Create initial policy with complex structure
		const initialPolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: "http://example.com/merge-test",
			assigner: {
				uid: "http://example.com/party/1",
				"@type": "Party"
			},
			permission: [
				{
					target: "http://example.com/asset/1",
					action: "use",
					constraint: [
						{
							leftOperand: "count",
							operator: "lteq",
							rightOperand: "5"
						}
					]
				}
			]
		};

		const createResult = await policyAdminPoint.create(initialPolicy);
		const policyId = createResult.uid;

		const partialUpdate: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: policyId,
			assigner: {
				uid: "http://example.com/party/1",
				"@type": "Organization"
			},
			assignee: {
				uid: "http://example.com/party/2",
				"@type": "Person"
			}
		};

		const result = await policyAdminPoint.update(policyId, partialUpdate);

		expect(result).toBeDefined();
		expect(result.uid).toEqual(policyId);

		// Check deep merge worked
		expect(result.assigner).toBeDefined();
		if (result.assigner && typeof result.assigner === "object" && "uid" in result.assigner) {
			expect(result.assigner.uid).toEqual("http://example.com/party/1");
			expect(result.assigner["@type"]).toEqual("Organization"); // Updated
		}

		expect(result.assignee).toBeDefined();
		if (result.assignee && typeof result.assignee === "object" && "uid" in result.assignee) {
			expect(result.assignee.uid).toEqual("http://example.com/party/2");
		}

		// Check original permission was preserved
		expect(result.permission).toBeDefined();
		if (result.permission && result.permission.length > 0) {
			expect(result.permission[0].target).toEqual("http://example.com/asset/1");
		}
	});

	test("should replace arrays entirely in update", async () => {
		const initialPolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: "http://example.com/array-test",
			permission: [
				{
					target: "http://example.com/asset/1",
					action: "use"
				},
				{
					target: "http://example.com/asset/2",
					action: "read"
				}
			]
		};

		const createResult = await policyAdminPoint.create(initialPolicy);
		const policyId = createResult.uid;

		const updateWithNewArray: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Set",
			uid: policyId,
			permission: [
				{
					target: "http://example.com/asset/3",
					action: "display"
				}
			]
		};

		const result = await policyAdminPoint.update(policyId, updateWithNewArray);

		expect(result).toBeDefined();
		expect(result.uid).toEqual(policyId);
		expect(result.permission).toBeDefined();
		expect(result.permission).toHaveLength(1);
		if (result.permission && result.permission.length > 0) {
			expect(result.permission[0].target).toEqual("http://example.com/asset/3");
			expect(result.permission[0].action).toEqual("display");
		}
	});

	test("should validate updated policy through JSON-LD validation", async () => {
		const createResult = await policyAdminPoint.create(SAMPLE_POLICY);
		const policyId = createResult.uid;

		const invalidUpdate = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "InvalidType",
			uid: policyId,
			permission: [
				{
					target: "http://example.com/asset/updated",
					action: "invalidAction"
				}
			]
		} as unknown as IOdrlPolicy;

		const result = await policyAdminPoint.update(policyId, invalidUpdate);
		expect(result).toBeDefined();
	});

	test("should update policy and persist changes", async () => {
		const createResult = await policyAdminPoint.create(SAMPLE_POLICY);
		const policyId = createResult.uid;

		const updatedPolicy: IOdrlPolicy = {
			"@context": OdrlContexts.ContextRoot,
			"@type": "Offer",
			uid: policyId,
			permission: [
				{
					target: "http://example.com/asset/new",
					action: "modify"
				}
			],
			assigner: "http://example.com/party/assigner"
		};

		await policyAdminPoint.update(policyId, updatedPolicy);

		const retrievedPolicy = await policyAdminPoint.retrieve(policyId);
		expect(retrievedPolicy).toBeDefined();
		expect(retrievedPolicy.uid).toEqual(policyId);
		expect(retrievedPolicy["@type"]).toEqual("Offer");
		if (retrievedPolicy.permission && retrievedPolicy.permission.length > 0) {
			expect(retrievedPolicy.permission[0].target).toEqual("http://example.com/asset/new");
			expect(retrievedPolicy.permission[0].action).toEqual("modify");
		}
		expect(retrievedPolicy.assigner).toEqual("http://example.com/party/assigner");
	});
});
