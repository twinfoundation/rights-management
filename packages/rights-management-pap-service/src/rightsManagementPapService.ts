// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError, Guards } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import { EntityStorageService } from "@twin.org/entity-storage-service";
import { nameof } from "@twin.org/nameof";
import type { IPolicyAdministrationPointComponent } from "@twin.org/rights-management-models";
import { PolicyAdministrationPointComponent } from "@twin.org/rights-management-pap";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IPolicyAdministrationPointServiceConstructorOptions } from "./models/IPolicyAdministrationPointServiceConstructorOptions";

/**
 * Service for performing Policy Administration Point operations.
 */
export class RightsManagementPapService implements IPolicyAdministrationPointComponent {
	/**
	 * The namespace supported by the PAP service.
	 */
	public static readonly NAMESPACE: string = "pap";

	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<RightsManagementPapService>();

	/**
	 * The default namespace to use for the PAP.
	 * @internal
	 */
	private readonly _defaultNamespace: string;

	/**
	 * The actual PAP component implementation.
	 * @internal
	 */
	private readonly _papComponent: PolicyAdministrationPointComponent;

	/**
	 * Create a new instance of RightsManagementPapService.
	 * @param options The options for the service.
	 */
	constructor(options?: IPolicyAdministrationPointServiceConstructorOptions) {
		this._defaultNamespace = options?.config?.defaultNamespace ?? "odrl-policy";

		// Create an EntityStorageService for OdrlPolicy entities
		const entityStorageService = new EntityStorageService({
			entityStorageType: this._defaultNamespace,
			config: {
				includeNodeIdentity: false,
				includeUserIdentity: false
			}
		});

		// Create the PolicyAdministrationPointComponent
		this._papComponent = new PolicyAdministrationPointComponent({
			entityStorage: entityStorageService
		});
	}

	/**
	 * Store a policy.
	 * @param policy The policy to store.
	 * @returns Nothing.
	 */
	public async store(policy: IOdrlPolicy): Promise<void> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);

		try {
			await this._papComponent.store(policy);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "storeFailed", undefined, error);
		}
	}

	/**
	 * Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @returns The policy.
	 */
	public async retrieve(policyId: string): Promise<IOdrlPolicy> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		try {
			const policy = await this._papComponent.retrieve(policyId);
			return policy;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "retrieveFailed", undefined, error);
		}
	}

	/**
	 * Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	public async remove(policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		try {
			await this._papComponent.remove(policyId);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "removeFailed", undefined, error);
		}
	}

	/**
	 * Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	public async query(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		try {
			const result = await this._papComponent.query(conditions, cursor);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "queryFailed", undefined, error);
		}
	}
}
