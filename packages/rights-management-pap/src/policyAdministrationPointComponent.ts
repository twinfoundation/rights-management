// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError, Guards } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import type { IEntityStorageComponent } from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import type { IPolicyAdministrationPointComponent } from "@twin.org/rights-management-models";
import type {
	ActionType,
	ConflictStrategyType,
	IOdrlPolicy,
	PolicyType
} from "@twin.org/standards-w3c-odrl";
import { OdrlContexts } from "@twin.org/standards-w3c-odrl";
import { OdrlPolicy } from "./entities/odrlPolicy";
import type { IPolicyAdministrationPointComponentOptions } from "./models/IPolicyAdministrationPointComponentOptions";

/**
 * Class implementation of Policy Administration Point Component that uses Entity Storage.
 */
export class PolicyAdministrationPointComponent implements IPolicyAdministrationPointComponent {
	/**
	 * Default maximum query results.
	 * @internal
	 */
	private static readonly _DEFAULT_MAX_QUERY_RESULTS: number = 100;

	/**
	 * The class name of the Policy Administration Point Component.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyAdministrationPointComponent>();

	/**
	 * The entity storage component for storing policies.
	 */
	private readonly _entityStorage: IEntityStorageComponent<OdrlPolicy>;

	/**
	 * The maximum number of policies to return in a query.
	 */
	private readonly _maxQueryResults: number;

	/**
	 * Create a new instance of PolicyAdministrationPointComponent.
	 * @param options The options for the component.
	 */
	constructor(options: IPolicyAdministrationPointComponentOptions) {
		Guards.object(this.CLASS_NAME, nameof(options), options);
		Guards.object(this.CLASS_NAME, nameof(options.entityStorage), options.entityStorage);

		this._entityStorage = options.entityStorage as unknown as IEntityStorageComponent<OdrlPolicy>;
		this._maxQueryResults =
			options.config?.maxQueryResults ??
			PolicyAdministrationPointComponent._DEFAULT_MAX_QUERY_RESULTS;
	}

	/**
	 * Store a policy in the entity storage.
	 * @param policy The policy to store.
	 */
	public async store(policy: IOdrlPolicy): Promise<void> {
		// Convert the IOdrlPolicy to OdrlPolicy for storage
		const storagePolicy = this.convertToStoragePolicy(policy);
		await this._entityStorage.set(storagePolicy);
	}

	/**
	 * Retrieve a policy from the entity storage.
	 * @param policyId The ID of the policy to retrieve.
	 * @returns The policy.
	 */
	public async retrieve(policyId: string): Promise<IOdrlPolicy> {
		const storagePolicy = await this._entityStorage.get(policyId);
		if (!storagePolicy) {
			throw new GeneralError(this.CLASS_NAME, "policyNotFound", {
				policyId
			});
		}
		return this.convertFromStoragePolicy(storagePolicy);
	}

	/**
	 * Remove a policy from the entity storage.
	 * @param policyId The ID of the policy to remove.
	 */
	public async remove(policyId: string): Promise<void> {
		await this._entityStorage.remove(policyId);
	}

	/**
	 * Query the entity storage for policies.
	 * @param conditions The conditions to query the entity storage with.
	 * @param cursor The cursor to use for pagination.
	 * @returns The policies.
	 */
	public async query(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		const result = await this._entityStorage.query(
			conditions as unknown as EntityCondition<OdrlPolicy>,
			undefined,
			undefined,
			undefined,
			cursor,
			this._maxQueryResults
		);
		return {
			cursor: result.cursor,
			policies: result.entities.map(entity =>
				// We need to check if entity has the required properties
				this.convertFromStoragePolicy(entity as OdrlPolicy)
			)
		};
	}

	/**
	 * Converts an IOdrlPolicy to an OdrlPolicy for storage.
	 * @param policy The policy to convert.
	 * @returns The converted policy.
	 * @private
	 */
	private convertToStoragePolicy(policy: IOdrlPolicy): OdrlPolicy {
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
	 * @private
	 */
	private convertFromStoragePolicy(storagePolicy: OdrlPolicy): IOdrlPolicy {
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
				// Check if string is parseable as JSON
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
				// Check if string is parseable as JSON
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
}
