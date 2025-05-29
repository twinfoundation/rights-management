// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError, Guards, Is } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyAdministrationPointComponent,
	IRightsManagementComponent
} from "@twin.org/rights-management-models";
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
		this._papComponent = ComponentFactory.get<IPolicyAdministrationPointComponent>(
			options?.papComponentType ?? "pap"
		);
	}

	/**
	 * PAP: Store a policy.
	 * @param policy The policy to store.
	 * @returns Nothing.
	 */
	public async papStore(policy: IOdrlPolicy): Promise<void> {
		try {
			Guards.object(this.CLASS_NAME, nameof(policy), policy);

			await this._papComponent.store(policy);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papStoreFailed", undefined, error);
		}
	}

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @returns The policy.
	 */
	public async papRetrieve(policyId: string): Promise<IOdrlPolicy> {
		try {
			Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

			const policy = await this._papComponent.retrieve(policyId);
			return policy;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papRetrieveFailed", undefined, error);
		}
	}

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	public async papRemove(policyId: string): Promise<void> {
		try {
			Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

			await this._papComponent.remove(policyId);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papRemoveFailed", undefined, error);
		}
	}

	/**
	 * PAP: Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	public async papQuery(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		pageSize?: number
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		try {
			if (!Is.empty(conditions)) {
				Guards.object(this.CLASS_NAME, nameof(conditions), conditions);
			}
			if (!Is.empty(cursor)) {
				Guards.stringValue(this.CLASS_NAME, nameof(cursor), cursor);
			}
			if (!Is.empty(pageSize)) {
				Guards.integer(this.CLASS_NAME, nameof(pageSize), pageSize);
			}

			const result = await this._papComponent.query(conditions, cursor, pageSize);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "papQueryFailed", undefined, error);
		}
	}
}
