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
	 * Include the user identity when performing storage operations, defaults to true.
	 * @internal
	 */
	private readonly _includeUserIdentity: boolean;

	/**
	 * Include the node identity when performing storage operations, defaults to true.
	 * @internal
	 */
	private readonly _includeNodeIdentity: boolean;

	/**
	 * Create a new instance of RightsManagementPapService.
	 * @param options The options for the service.
	 */
	constructor(options?: IPolicyAdministrationPointServiceConstructorOptions) {
		this._defaultNamespace = options?.config?.defaultNamespace ?? "odrl-policy";
		this._includeUserIdentity = options?.config?.includeUserIdentity ?? true;
		this._includeNodeIdentity = options?.config?.includeNodeIdentity ?? true;

		const entityStorageService = new EntityStorageService({
			entityStorageType: this._defaultNamespace,
			config: {
				includeNodeIdentity: this._includeNodeIdentity,
				includeUserIdentity: this._includeUserIdentity
			}
		});

		this._papComponent = new PolicyAdministrationPointComponent({
			entityStorage: entityStorageService,
			config: {
				includeNodeIdentity: this._includeNodeIdentity,
				includeUserIdentity: this._includeUserIdentity
			}
		});
	}

	/**
	 * Store a policy.
	 * @param policy The policy to store.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Nothing.
	 */
	public async store(
		policy: IOdrlPolicy,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<void> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);
		if (this._includeUserIdentity) {
			Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
		}
		if (this._includeNodeIdentity) {
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		}

		try {
			await this._papComponent.store(policy, userIdentity, nodeIdentity);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "storeFailed", undefined, error);
		}
	}

	/**
	 * Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
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
		if (this._includeUserIdentity) {
			Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
		}
		if (this._includeNodeIdentity) {
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		}

		try {
			const policy = await this._papComponent.retrieve(policyId, userIdentity, nodeIdentity);
			return policy;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "retrieveFailed", undefined, error);
		}
	}

	/**
	 * Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Nothing.
	 */
	public async remove(
		policyId: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		if (this._includeUserIdentity) {
			Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
		}
		if (this._includeNodeIdentity) {
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		}

		try {
			await this._papComponent.remove(policyId, userIdentity, nodeIdentity);
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "removeFailed", undefined, error);
		}
	}

	/**
	 * Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param userIdentity The identity of the user performing the operation.
	 * @param nodeIdentity The identity of the node the operation is performed on.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	public async query(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		userIdentity?: string,
		nodeIdentity?: string
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		if (this._includeUserIdentity) {
			Guards.stringValue(this.CLASS_NAME, nameof(userIdentity), userIdentity);
		}
		if (this._includeNodeIdentity) {
			Guards.stringValue(this.CLASS_NAME, nameof(nodeIdentity), nodeIdentity);
		}

		try {
			const result = await this._papComponent.query(conditions, cursor, userIdentity, nodeIdentity);
			return result;
		} catch (error) {
			throw new GeneralError(this.CLASS_NAME, "queryFailed", undefined, error);
		}
	}
}
