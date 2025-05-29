// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Guards, Is, NotFoundError } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import type { IPolicyAdministrationPointComponent } from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { OdrlPolicy } from "./entities/odrlPolicy";
import type { IPolicyAdministrationPointServiceOptions } from "./models/IPolicyAdministrationPointServiceOptions";
import { convertFromStoragePolicy, convertToStoragePolicy } from "./utils/odrlPolicyConverters";

/**
 * Class implementation of Policy Administration Point Component.
 */
export class PolicyAdministrationPointService implements IPolicyAdministrationPointComponent {
	/**
	 * The namespace supported by the Policy Administration Point entity storage implementation.
	 */
	public static readonly NAMESPACE: string = "pap";

	/**
	 * Default maximum query results.
	 * @internal
	 */
	private static readonly _DEFAULT_MAX_QUERY_RESULTS: number = 10;

	/**
	 * The class name of the Policy Administration Point Service.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyAdministrationPointService>();

	/**
	 * The entity storage component for storing policies.
	 * @internal
	 */
	private readonly _odrlPolicyEntityStorage: IEntityStorageConnector<OdrlPolicy>;

	/**
	 * Create a new instance of PolicyAdministrationPointService.
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyAdministrationPointServiceOptions) {
		this._odrlPolicyEntityStorage = EntityStorageConnectorFactory.get(
			options?.odrlPolicyEntityStorageType ?? "odrl-policy"
		);
	}

	/**
	 * Store a policy in the entity storage.
	 * @param policy The policy to store.
	 */
	public async store(policy: IOdrlPolicy): Promise<void> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);

		const storagePolicy = convertToStoragePolicy(policy);
		await this._odrlPolicyEntityStorage.set(storagePolicy);
	}

	/**
	 * Retrieve a policy from the entity storage.
	 * @param policyId The ID of the policy to retrieve.
	 * @returns The policy.
	 */
	public async retrieve(policyId: string): Promise<IOdrlPolicy> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		const storagePolicy = await this._odrlPolicyEntityStorage.get(policyId);
		if (!storagePolicy) {
			throw new NotFoundError(this.CLASS_NAME, "policyNotFound");
		}
		return convertFromStoragePolicy(storagePolicy);
	}

	/**
	 * Remove a policy from the entity storage.
	 * @param policyId The ID of the policy to remove.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		await this._odrlPolicyEntityStorage.remove(policyId);
	}

	/**
	 * Query the entity storage for policies.
	 * @param conditions The conditions to query the entity storage with.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @returns The policies.
	 */
	public async query(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		pageSize?: number
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		if (!Is.empty(conditions)) {
			Guards.object(this.CLASS_NAME, nameof(conditions), conditions);
		}
		if (!Is.empty(cursor)) {
			Guards.stringValue(this.CLASS_NAME, nameof(cursor), cursor);
		}
		if (!Is.empty(pageSize)) {
			Guards.integer(this.CLASS_NAME, nameof(pageSize), pageSize);
		}

		const result = await this._odrlPolicyEntityStorage.query(
			conditions,
			undefined,
			undefined,
			cursor,
			pageSize ?? PolicyAdministrationPointService._DEFAULT_MAX_QUERY_RESULTS
		);
		return {
			cursor: result.cursor,
			policies: result.entities.map(entity => convertFromStoragePolicy(entity as OdrlPolicy))
		};
	}
}
