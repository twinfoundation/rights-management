// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError, Guards } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import type { IEntityStorageComponent } from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import type { IPolicyAdministrationPointComponent } from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
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
	private readonly _entityStorage: IEntityStorageComponent<IOdrlPolicy>;

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

		this._entityStorage = options.entityStorage;
		this._maxQueryResults =
			options.config?.maxQueryResults ??
			PolicyAdministrationPointComponent._DEFAULT_MAX_QUERY_RESULTS;
	}

	/**
	 * Store a policy in the entity storage.
	 * @param policy The policy to store.
	 */
	public async store(policy: IOdrlPolicy): Promise<void> {
		await this._entityStorage.set(policy);
	}

	/**
	 * Retrieve a policy from the entity storage.
	 * @param policyId The ID of the policy to retrieve.
	 * @returns The policy.
	 */
	public async retrieve(policyId: string): Promise<IOdrlPolicy> {
		const policy = await this._entityStorage.get(policyId);
		if (!policy) {
			throw new GeneralError(this.CLASS_NAME, "policyNotFound", {
				policyId
			});
		}
		return policy;
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
			conditions,
			undefined,
			undefined,
			undefined,
			cursor,
			this._maxQueryResults
		);
		return {
			cursor: result.cursor,
			policies: result.entities as IOdrlPolicy[]
		};
	}
}
