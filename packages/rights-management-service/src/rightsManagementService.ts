// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import { EntityStorageService } from "@twin.org/entity-storage-service";
import { nameof } from "@twin.org/nameof";
import {
	type IRightsManagementComponent,
	PolicyAdministrationPointComponentFactory,
	type IPolicyAdministrationPointComponent
} from "@twin.org/rights-management-models";
import {
	createEntityStoragePolicyAdministrationPointComponentFactory,
	PolicyAdministrationPointComponentEntityStorage
} from "@twin.org/rights-management-pap-entity-storage";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IRightsManagementServiceConstructorOptions } from "./models/IRightsManagementServiceConstructorOptions";

/**
 * Service for performing Rights Management operations.
 * This is a unified service that provides access to all Rights Management components.
 */
export class RightsManagementService implements IRightsManagementComponent {
	/**
	 * The namespace supported by the Rights Management service.
	 */
	public static readonly NAMESPACE: string = "rights-management";

	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<RightsManagementService>();

	/**
	 * The PAP component implementation.
	 * @internal
	 */
	private readonly _papComponent: IPolicyAdministrationPointComponent;

	/**
	 * Create a new instance of RightsManagementService.
	 * @param options The options for the service.
	 */
	constructor(options?: IRightsManagementServiceConstructorOptions) {
		// Initialize PAP component
		const papNamespace =
			options?.config?.papNamespace ?? PolicyAdministrationPointComponentEntityStorage.NAMESPACE;
		const defaultEntityStorageType = options?.config?.defaultEntityStorageType ?? "odrl-policy";
		const includeUserIdentity = options?.config?.includeUserIdentity ?? true;
		const includeNodeIdentity = options?.config?.includeNodeIdentity ?? true;
		const maxQueryResults = options?.config?.maxQueryResults;

		const entityStorageService = new EntityStorageService({
			entityStorageType: defaultEntityStorageType,
			config: {
				includeNodeIdentity,
				includeUserIdentity
			}
		});

		// Register the entity storage implementation with the factory if not already registered
		const registeredNames = PolicyAdministrationPointComponentFactory.names();

		if (!registeredNames.includes(papNamespace)) {
			PolicyAdministrationPointComponentFactory.register(
				papNamespace,
				createEntityStoragePolicyAdministrationPointComponentFactory(
					entityStorageService,
					maxQueryResults
				)
			);
		}

		// Get the component from the factory
		this._papComponent = PolicyAdministrationPointComponentFactory.get(papNamespace);
	}

	/**
	 * PAP: Store a policy.
	 * @param policy The policy to store.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Nothing.
	 */
	public async papStore(
		policy: IOdrlPolicy,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<void> {
		try {
			await this._papComponent.store(policy, userIdentity, nodeIdentity);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papStoreFailed", undefined, error);
		}
	}

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns The policy.
	 */
	public async papRetrieve(
		policyId: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<IOdrlPolicy> {
		try {
			const policy = await this._papComponent.retrieve(policyId, userIdentity, nodeIdentity);
			return policy;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papRetrieveFailed", undefined, error);
		}
	}

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Nothing.
	 */
	public async papRemove(
		policyId: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<void> {
		try {
			await this._papComponent.remove(policyId, userIdentity, nodeIdentity);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papRemoveFailed", undefined, error);
		}
	}

	/**
	 * PAP: Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	public async papQuery(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		try {
			const result = await this._papComponent.query(conditions, cursor, userIdentity, nodeIdentity);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papQueryFailed", undefined, error);
		}
	}
}
