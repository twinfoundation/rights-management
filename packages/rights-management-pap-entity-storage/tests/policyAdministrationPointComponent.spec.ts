// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { ComponentFactory } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import type { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
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
	let odrlPolicyEntityStorage: MemoryEntityStorageConnector<OdrlPolicy>;

	beforeEach(() => {
		odrlPolicyEntityStorage =
			EntityStorageConnectorFactory.get<MemoryEntityStorageConnector<OdrlPolicy>>("odrl-policy");

		const entityStorageService = new EntityStorageService<OdrlPolicy>({
			entityStorageType: "odrl-policy",
			config: {
				includeNodeIdentity: false,
				includeUserIdentity: false
			}
		});
		ComponentFactory.register("odrl-policy", () => entityStorageService);

		policyAdminPoint = new PolicyAdministrationPointComponentEntityStorage({
			entityStorageType: "odrl-policy"
		});
	});

	afterEach(() => {
		ComponentFactory.unregister("odrl-policy");
	});

	afterAll(async () => {
		if (existsSync(TEST_DIRECTORY_ROOT)) {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		}
	});

	test("should store a policy in entity storage", async () => {
		await policyAdminPoint.store(SAMPLE_POLICY, TEST_USER_IDENTITY, TEST_NODE_IDENTITY);

		const store = odrlPolicyEntityStorage.getStore();
		expect(store).toBeDefined();
		expect(store.length).toEqual(1);

		const storedPolicy = store[0];
		expect(storedPolicy).toBeDefined();
		expect(storedPolicy.uid).toEqual(TEST_POLICY_ID);
		expect(storedPolicy.nodeIdentity).toEqual(TEST_NODE_IDENTITY);
		expect(storedPolicy.permission).toBeDefined();

		const retrievedPolicy = await policyAdminPoint.retrieve(
			TEST_POLICY_ID,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

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

		let store = odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(1);

		const retrievedPolicy = await policyAdminPoint.retrieve(
			TEST_POLICY_ID,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);
		expect(retrievedPolicy).toBeDefined();

		await policyAdminPoint.remove(TEST_POLICY_ID, TEST_USER_IDENTITY, TEST_NODE_IDENTITY);

		store = odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(0);

		await expect(
			policyAdminPoint.retrieve(TEST_POLICY_ID, TEST_USER_IDENTITY, TEST_NODE_IDENTITY)
		).rejects.toThrow();
	});

	test("should query policies without conditions", async () => {
		await createTestPolicies(policyAdminPoint);

		const store = odrlPolicyEntityStorage.getStore();
		expect(store.length).toEqual(10);

		const result = await policyAdminPoint.query(
			undefined,
			undefined,
			undefined,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

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

		const result = await policyAdminPoint.query(
			uidCondition,
			undefined,
			undefined,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

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

		const result = await policyAdminPoint.query(
			uidCondition,
			undefined,
			undefined,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

		expect(result.policies).toBeDefined();
		expect(result.policies.length).toEqual(0);
	});

	test("should handle pagination with cursor", async () => {
		await createTestPolicies(policyAdminPoint);

		const result1 = await policyAdminPoint.query(
			undefined,
			undefined,
			5,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

		expect(result1.policies).toBeDefined();
		expect(result1.policies.length).toEqual(5);
		expect(result1.cursor).toBeDefined();

		const result2 = await policyAdminPoint.query(
			undefined,
			result1.cursor,
			5,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

		expect(result2.policies).toBeDefined();
		expect(result2.policies.length).toEqual(5);

		const firstPageIds = result1.policies.map(p => p.uid);
		const secondPageIds = result2.policies.map(p => p.uid);
		expect(firstPageIds).not.toEqual(secondPageIds);
	});

	test("should handle invalid cursor gracefully", async () => {
		await createTestPolicies(policyAdminPoint);

		const result = await policyAdminPoint.query(
			undefined,
			"invalid-cursor",
			5,
			TEST_USER_IDENTITY,
			TEST_NODE_IDENTITY
		);

		expect(result.policies).toBeDefined();
	});
});
