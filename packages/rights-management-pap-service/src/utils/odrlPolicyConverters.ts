// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import { OdrlContexts } from "@twin.org/standards-w3c-odrl";
import { OdrlPolicy } from "../entities/odrlPolicy";

/**
 * Converts an IOdrlPolicy to an OdrlPolicy for storage.
 * @param policy The policy to convert.
 * @returns The converted policy.
 */
export function convertToStoragePolicy(policy: IOdrlPolicy): OdrlPolicy {
	const storagePolicy = new OdrlPolicy();
	storagePolicy.uid = policy.uid;
	storagePolicy["@type"] = policy["@type"];

	storagePolicy.profile = policy.profile;
	storagePolicy.assigner = policy.assigner;
	storagePolicy.assignee = policy.assignee;
	storagePolicy.target = policy.target;
	storagePolicy.action = policy.action;
	storagePolicy.conflict = policy.conflict;
	storagePolicy.permission = policy.permission;
	storagePolicy.prohibition = policy.prohibition;
	storagePolicy.obligation = policy.obligation;

	return storagePolicy;
}

/**
 * Converts an OdrlPolicy from storage to an IOdrlPolicy.
 * @param storagePolicy The storage policy to convert.
 * @returns The converted IOdrlPolicy.
 */
export function convertFromStoragePolicy(storagePolicy: OdrlPolicy): IOdrlPolicy {
	const policy: IOdrlPolicy = {
		uid: storagePolicy.uid,
		"@type": storagePolicy["@type"],
		"@context": OdrlContexts.Context
	};

	policy.profile = storagePolicy.profile;
	policy.assigner = storagePolicy.assigner;
	policy.assignee = storagePolicy.assignee;
	policy.target = storagePolicy.target;
	policy.action = storagePolicy.action;
	policy.conflict = storagePolicy.conflict;
	policy.permission = storagePolicy.permission;
	policy.prohibition = storagePolicy.prohibition;
	policy.obligation = storagePolicy.obligation;

	return policy;
}
