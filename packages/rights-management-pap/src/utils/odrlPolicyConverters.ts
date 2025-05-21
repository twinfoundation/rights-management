// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	ActionType,
	ConflictStrategyType,
	IOdrlPolicy,
	PolicyType
} from "@twin.org/standards-w3c-odrl";
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
	storagePolicy["@context"] = JSON.stringify(policy["@context"]);
	storagePolicy["@type"] = policy["@type"];

	if (policy.profile) {
		storagePolicy.profile =
			typeof policy.profile === "string" ? policy.profile : JSON.stringify(policy.profile);
	}

	if (policy.assigner) {
		storagePolicy.assigner =
			typeof policy.assigner === "string" ? policy.assigner : JSON.stringify(policy.assigner);
	}

	if (policy.assignee) {
		storagePolicy.assignee =
			typeof policy.assignee === "string" ? policy.assignee : JSON.stringify(policy.assignee);
	}

	if (policy.target) {
		storagePolicy.target =
			typeof policy.target === "string" ? policy.target : JSON.stringify(policy.target);
	}

	if (policy.action) {
		storagePolicy.action =
			typeof policy.action === "string" ? policy.action : JSON.stringify(policy.action);
	}

	if (policy.conflict) {
		storagePolicy.conflict = policy.conflict;
	}

	if (policy.permission) {
		storagePolicy.permission = JSON.stringify(policy.permission);
	}

	if (policy.prohibition) {
		storagePolicy.prohibition = JSON.stringify(policy.prohibition);
	}

	if (policy.obligation) {
		storagePolicy.obligation = JSON.stringify(policy.obligation);
	}

	return storagePolicy;
}

/**
 * Converts an OdrlPolicy from storage to an IOdrlPolicy.
 * @param storagePolicy The storage policy to convert.
 * @returns The converted IOdrlPolicy.
 */
export function convertFromStoragePolicy(storagePolicy: OdrlPolicy): IOdrlPolicy {
	// Start with minimal required fields
	const policy = {
		uid: storagePolicy.uid,
		"@type": storagePolicy["@type"] as PolicyType
	} as IOdrlPolicy;

	// Convert context which is required
	try {
		policy["@context"] = JSON.parse(storagePolicy["@context"]);
	} catch {
		// If parsing fails, use the string directly
		policy["@context"] = OdrlContexts.Context;
	}

	// Convert profile if present
	if (storagePolicy.profile) {
		try {
			const profileStr =
				typeof storagePolicy.profile === "string"
					? storagePolicy.profile
					: storagePolicy.profile[0]; // Use first element if it's an array

			if (profileStr.startsWith("[") || profileStr.startsWith("{")) {
				policy.profile = JSON.parse(profileStr);
			} else {
				policy.profile = storagePolicy.profile;
			}
		} catch {
			policy.profile = storagePolicy.profile;
		}
	}

	// Convert assigner if present
	if (storagePolicy.assigner) {
		try {
			// Only parse if it looks like JSON
			if (typeof storagePolicy.assigner === "string" && storagePolicy.assigner.startsWith("{")) {
				policy.assigner = JSON.parse(storagePolicy.assigner);
			} else {
				policy.assigner = storagePolicy.assigner;
			}
		} catch {
			policy.assigner = storagePolicy.assigner;
		}
	}

	// Convert assignee if present
	if (storagePolicy.assignee) {
		try {
			// Only parse if it looks like JSON
			if (typeof storagePolicy.assignee === "string" && storagePolicy.assignee.startsWith("{")) {
				policy.assignee = JSON.parse(storagePolicy.assignee);
			} else {
				policy.assignee = storagePolicy.assignee;
			}
		} catch {
			policy.assignee = storagePolicy.assignee;
		}
	}

	// Convert target if present
	if (storagePolicy.target) {
		try {
			const targetStr =
				typeof storagePolicy.target === "string" ? storagePolicy.target : storagePolicy.target[0]; // Use first element if it's an array

			if (targetStr.startsWith("[") || targetStr.startsWith("{")) {
				policy.target = JSON.parse(targetStr);
			} else {
				policy.target = storagePolicy.target;
			}
		} catch {
			policy.target = storagePolicy.target;
		}
	}

	// Convert action if present
	if (storagePolicy.action) {
		try {
			// Only parse if it looks like JSON
			if (
				typeof storagePolicy.action === "string" &&
				(storagePolicy.action.startsWith("[") || storagePolicy.action.startsWith("{"))
			) {
				policy.action = JSON.parse(storagePolicy.action);
			} else {
				policy.action = storagePolicy.action as ActionType;
			}
		} catch {
			policy.action = storagePolicy.action as ActionType;
		}
	}

	// Convert conflict if present
	if (storagePolicy.conflict) {
		policy.conflict = storagePolicy.conflict as ConflictStrategyType;
	}

	// Convert permission if present
	if (storagePolicy.permission) {
		try {
			policy.permission = JSON.parse(storagePolicy.permission);
		} catch {
			// If parsing fails, leave undefined
		}
	}

	// Convert prohibition if present
	if (storagePolicy.prohibition) {
		try {
			policy.prohibition = JSON.parse(storagePolicy.prohibition);
		} catch {
			// If parsing fails, leave undefined
		}
	}

	// Convert obligation if present
	if (storagePolicy.obligation) {
		try {
			policy.obligation = JSON.parse(storagePolicy.obligation);
		} catch {
			// If parsing fails, leave undefined
		}
	}

	return policy;
}
