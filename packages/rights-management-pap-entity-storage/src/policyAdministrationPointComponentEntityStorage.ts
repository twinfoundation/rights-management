// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, NotFoundError } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import type { IEntityStorageComponent } from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import type { IPolicyAdministrationPointComponent } from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { OdrlPolicy } from "./entities/odrlPolicy";
import type { IPolicyAdministrationPointComponentEntityStorageOptions } from "./models/IPolicyAdministrationPointComponentEntityStorageOptions";
import { convertFromStoragePolicy, convertToStoragePolicy } from "./utils/odrlPolicyConverters";

/**
 * Class implementation of Policy Administration Point Component that uses Entity Storage.
 */
export class PolicyAdministrationPointComponentEntityStorage
	implements IPolicyAdministrationPointComponent
{
	/**
	 * The namespace supported by the Policy Administration Point entity storage implementation.
	 */
	public static readonly NAMESPACE: string = "entity-storage";

	/**
	 * Default maximum query results.
	 * @internal
	 */
	private static readonly _DEFAULT_MAX_QUERY_RESULTS: number = 10;

	/**
	 * The class name of the Policy Administration Point Component.
	 */
	public readonly CLASS_NAME: string = nameof<PolicyAdministrationPointComponentEntityStorage>();

	/**
	 * The entity storage component for storing policies.
	 */
	private readonly _entityStorage: IEntityStorageComponent<OdrlPolicy>;

	/**
	 * Create a new instance of PolicyAdministrationPointComponent.
	 * @param options The options for the component.
	 */
	constructor(options: IPolicyAdministrationPointComponentEntityStorageOptions) {
		Guards.object(this.CLASS_NAME, nameof(options), options);
		Guards.stringValue(this.CLASS_NAME, nameof(options.entityStorage), options.entityStorage);

		this._entityStorage = ComponentFactory.get<IEntityStorageComponent<OdrlPolicy>>(
			options.entityStorage
		);
	}

	/**
	 * Store a policy in the entity storage.
	 * @param policy The policy to store.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 */
	public async store(
		policy: IOdrlPolicy,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<void> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);
		if (userIdentity !== undefined) {
			Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
		}
		if (nodeIdentity !== undefined) {
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		}

		const storagePolicy = convertToStoragePolicy(policy);
		await this._entityStorage.set(storagePolicy, userIdentity, nodeIdentity);
	}

	/**
	 * Retrieve a policy from the entity storage.
	 * @param policyId The ID of the policy to retrieve.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns The policy.
	 */
	public async retrieve(
		policyId: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<IOdrlPolicy> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		if (userIdentity !== undefined) {
			Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
		}
		if (nodeIdentity !== undefined) {
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		}

		const storagePolicy = await this._entityStorage.get(
			policyId,
			undefined,
			userIdentity,
			nodeIdentity
		);
		if (!storagePolicy) {
			throw new NotFoundError(this.CLASS_NAME, "policyNotFound");
		}
		return convertFromStoragePolicy(storagePolicy);
	}

	/**
	 * Remove a policy from the entity storage.
	 * @param policyId The ID of the policy to remove.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 */
	public async remove(
		policyId: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		if (userIdentity !== undefined) {
			Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
		}
		if (nodeIdentity !== undefined) {
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		}

		await this._entityStorage.remove(policyId, userIdentity, nodeIdentity);
	}

	/**
	 * Query the entity storage for policies.
	 * @param conditions The conditions to query the entity storage with.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns The policies.
	 */
	public async query(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		pageSize?: number,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		if (conditions !== undefined) {
			Guards.object(this.CLASS_NAME, nameof(conditions), conditions);
		}
		if (cursor !== undefined) {
			Guards.stringValue(this.CLASS_NAME, nameof(cursor), cursor);
		}
		if (pageSize !== undefined) {
			Guards.number(this.CLASS_NAME, nameof(pageSize), pageSize);
		}
		if (userIdentity !== undefined) {
			Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
		}
		if (nodeIdentity !== undefined) {
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		}

		const result = await this._entityStorage.query(
			conditions as unknown as EntityCondition<OdrlPolicy>,
			undefined,
			undefined,
			undefined,
			cursor,
			pageSize ?? PolicyAdministrationPointComponentEntityStorage._DEFAULT_MAX_QUERY_RESULTS,
			userIdentity,
			nodeIdentity
		);
		return {
			cursor: result.cursor,
			policies: result.entities.map(entity =>
				// Check if entity has the required properties
				convertFromStoragePolicy(entity as OdrlPolicy)
			)
		};
	}
}
