// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HttpParameterHelper } from "@twin.org/api-models";
import { ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import type {
	IRightsManagementComponent,
	IPolicyAdministrationPointComponent
} from "@twin.org/rights-management-models";
import { PolicyAdministrationPointComponentEntityStorage } from "@twin.org/rights-management-pap-entity-storage";
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

		// Get the component from the factory
		this._papComponent = ComponentFactory.get<IPolicyAdministrationPointComponent>(papNamespace);
	}

	/**
	 * PAP: Store a policy.
	 * @param policy The policy to store.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @param userIdentity The identity of the user performing the operation.
	 * @returns Nothing.
	 */
	public async papStore(
		policy: IOdrlPolicy,
		nodeIdentity: string,
		userIdentity?: string
	): Promise<void> {
		try {
			Guards.object(this.CLASS_NAME, nameof(policy), policy);
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
			if (userIdentity !== undefined) {
				Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
			}

			await this._papComponent.store(policy, nodeIdentity, userIdentity);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papStoreFailed", undefined, error);
		}
	}

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @param userIdentity The identity of the user performing the operation.
	 * @returns The policy.
	 */
	public async papRetrieve(
		policyId: string,
		nodeIdentity: string,
		userIdentity?: string
	): Promise<IOdrlPolicy> {
		try {
			Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
			if (userIdentity !== undefined) {
				Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
			}

			const policy = await this._papComponent.retrieve(policyId, nodeIdentity, userIdentity);
			return policy;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papRetrieveFailed", undefined, error);
		}
	}

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @param userIdentity The identity of the user performing the operation.
	 * @returns Nothing.
	 */
	public async papRemove(
		policyId: string,
		nodeIdentity: string,
		userIdentity?: string
	): Promise<void> {
		try {
			Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
			if (userIdentity !== undefined) {
				Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
			}

			await this._papComponent.remove(policyId, nodeIdentity, userIdentity);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papRemoveFailed", undefined, error);
		}
	}

	/**
	 * PAP: Query the policies using the specified conditions.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @param userIdentity The identity of the user performing the operation.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	public async papQuery(
		nodeIdentity: string,
		conditions?: string,
		cursor?: string,
		pageSize?: number,
		userIdentity?: string
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		try {
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
			if (conditions !== undefined) {
				Guards.stringValue(this.CLASS_NAME, nameof(conditions), conditions);
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

			let conditionsObj: EntityCondition<IOdrlPolicy> | undefined;
			if (conditions) {
				conditionsObj = HttpParameterHelper.objectFromString(conditions);
				if (Is.object(conditionsObj)) {
					conditionsObj = conditionsObj as unknown as EntityCondition<IOdrlPolicy>;
				}
			}
			const result = await this._papComponent.query(
				nodeIdentity,
				conditionsObj,
				cursor,
				pageSize,
				userIdentity
			);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papQueryFailed", undefined, error);
		}
	}
}
