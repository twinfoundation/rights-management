// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	Guards,
	Is,
	NotFoundError,
	Validation,
	type IValidationFailure,
	GeneralError,
	Converter,
	RandomHelper,
	ObjectHelper
} from "@twin.org/core";
import { JsonLdHelper } from "@twin.org/data-json-ld";
import type { EntityCondition } from "@twin.org/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import type { IPolicyAdministrationPointComponent } from "@twin.org/rights-management-models";
import { OdrlDataTypes, type IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
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
	 * Create a new instance of PolicyAdministrationPointService (PAP).
	 * @param options The options for the component.
	 */
	constructor(options?: IPolicyAdministrationPointServiceOptions) {
		OdrlDataTypes.registerRedirects();
		OdrlDataTypes.registerTypes();

		this._odrlPolicyEntityStorage = EntityStorageConnectorFactory.get(
			options?.odrlPolicyEntityStorageType ?? "odrl-policy"
		);
	}

	/**
	 * Create a new policy with optional UID.
	 * @param policy The policy to create (uid is optional and will be auto-generated if not provided).
	 * @returns The UID of the created policy.
	 */
	public async create(
		policy: Omit<IOdrlPolicy, "uid"> & { uid?: string }
	): Promise<{ uid: string }> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);

		let uid = policy.uid;

		if (uid) {
			const existingPolicy = await this._odrlPolicyEntityStorage.get(uid);
			if (existingPolicy) {
				throw new GeneralError(this.CLASS_NAME, "policyAlreadyExists", { uid });
			}
		} else {
			uid = `urn:rights-management:${Converter.bytesToHex(RandomHelper.generate(32))}`;
		}

		const completePolicy: IOdrlPolicy = {
			...policy,
			uid
		} as IOdrlPolicy;

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(completePolicy, validationFailures);
		Validation.asValidationError(this.CLASS_NAME, nameof(completePolicy), validationFailures);

		const storagePolicy = convertToStoragePolicy(completePolicy);
		await this._odrlPolicyEntityStorage.set(storagePolicy);

		return { uid };
	}

	/**
	 * Update an existing policy.
	 * @param policyId The ID of the policy to update.
	 * @param updates The policy updates to apply.
	 * @returns The updated policy.
	 */
	public async update(policyId: string, updates: IOdrlPolicy): Promise<IOdrlPolicy> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);
		Guards.object(this.CLASS_NAME, nameof(updates), updates);

		const existingStoragePolicy = await this._odrlPolicyEntityStorage.get(policyId);
		if (!existingStoragePolicy) {
			throw new NotFoundError(this.CLASS_NAME, "policyNotFound");
		}

		const existingPolicy = convertFromStoragePolicy(existingStoragePolicy);

		if (updates.uid && updates.uid !== policyId) {
			throw new GeneralError(this.CLASS_NAME, "cannotUpdateUid");
		}

		const updatedPolicy: IOdrlPolicy = ObjectHelper.merge(existingPolicy, {
			...updates,
			uid: policyId // Ensure UID cannot be changed
		});

		const validationFailures: IValidationFailure[] = [];
		await JsonLdHelper.validate(updatedPolicy, validationFailures);
		Validation.asValidationError(this.CLASS_NAME, nameof(updatedPolicy), validationFailures);

		const storagePolicy = convertToStoragePolicy(updatedPolicy);
		await this._odrlPolicyEntityStorage.set(storagePolicy);

		return updatedPolicy;
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
