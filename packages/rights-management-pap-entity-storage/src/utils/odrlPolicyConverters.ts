// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy, PolicyType } from "@twin.org/standards-w3c-odrl";
import { OdrlContexts } from "@twin.org/standards-w3c-odrl";
import { OdrlPolicy } from "../entities/odrlPolicy";

/**
 * Converts an IOdrlPolicy to an OdrlPolicy for storage.
 * @param policy The policy to convert.
 * @returns The converted policy.
 */
export function convertToStoragePolicy(policy: IOdrlPolicy): OdrlPolicy {
	// Create a new policy with the required field
	const storagePolicy = new OdrlPolicy();
	storagePolicy.uid = policy.uid;

	// Copy all optional fields directly (we don't need @context or @type)
	if (policy.profile) {
		storagePolicy.profile = policy.profile;
	}
	if (policy.assigner) {
		storagePolicy.assigner = policy.assigner;
	}
	if (policy.assignee) {
		storagePolicy.assignee = policy.assignee;
	}
	if (policy.target) {
		storagePolicy.target = policy.target;
	}
	if (policy.action) {
		storagePolicy.action = policy.action;
	}
	if (policy.conflict) {
		storagePolicy.conflict = policy.conflict;
	}
	if (policy.permission) {
		storagePolicy.permission = policy.permission;
	}
	if (policy.prohibition) {
		storagePolicy.prohibition = policy.prohibition;
	}
	if (policy.obligation) {
		storagePolicy.obligation = policy.obligation;
	}

	return storagePolicy;
}

/**
 * Converts an OdrlPolicy from storage to an IOdrlPolicy.
 * @param storagePolicy The storage policy to convert.
 * @returns The converted IOdrlPolicy.
 */
export function convertFromStoragePolicy(storagePolicy: OdrlPolicy): IOdrlPolicy {
	// Create policy with required fields and standard values
	const policy: IOdrlPolicy = {
		uid: storagePolicy.uid,
		"@type": "Set" as PolicyType, // Default policy type
		"@context": OdrlContexts.Context
	};

	// Copy all optional fields directly
	if (storagePolicy.profile) {
		policy.profile = storagePolicy.profile;
	}
	if (storagePolicy.assigner) {
		policy.assigner = storagePolicy.assigner;
	}
	if (storagePolicy.assignee) {
		policy.assignee = storagePolicy.assignee;
	}
	if (storagePolicy.target) {
		policy.target = storagePolicy.target;
	}
	if (storagePolicy.action) {
		policy.action = storagePolicy.action;
	}
	if (storagePolicy.conflict) {
		policy.conflict = storagePolicy.conflict;
	}
	if (storagePolicy.permission) {
		policy.permission = storagePolicy.permission;
	}
	if (storagePolicy.prohibition) {
		policy.prohibition = storagePolicy.prohibition;
	}
	if (storagePolicy.obligation) {
		policy.obligation = storagePolicy.obligation;
	}

	return policy;
}
