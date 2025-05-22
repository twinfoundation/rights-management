// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	GeneralError,
	Guards,
	type IErrorObject,
	Logger,
	type LoggerFactory
} from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import type { IRoute, IApiEndpoint } from "@twin.org/web";
import { Route } from "@twin.org/web";
import type {
	IPapQueryRequest,
	IPapQueryResponse,
	IPapRemoveRequest,
	IPapRetrieveRequest,
	IPapRetrieveResponse,
	IPapStoreRequest
} from "./models/api";
import { RightsManagementService } from "./rightsManagementService";

/**
 * Routes for Rights Management REST API.
 */
export class RightsManagementRoutes {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<RightsManagementRoutes>();

	/**
	 * Logger for the class.
	 */
	private readonly _logger: Logger;

	/**
	 * The service for handling rights management operations.
	 */
	private readonly _service: RightsManagementService;

	/**
	 * Create a new instance of RightsManagementRoutes.
	 * @param service The service to use for handling the operations.
	 * @param loggerFactory The factory to use for creating loggers.
	 */
	constructor(service: RightsManagementService, loggerFactory?: LoggerFactory) {
		Guards.truthy(service, "service");

		this._service = service;
		this._logger = loggerFactory?.createLogger(this.CLASS_NAME) ?? new Logger(this.CLASS_NAME);
	}

	/**
	 * Get the routes for the PAP component.
	 * @returns The routes for the API endpoints.
	 */
	public routes(): IRoute[] {
		return [
			// PAP Routes
			Route.post("/v1/pap/store", this.papStore()),
			Route.post("/v1/pap/retrieve", this.papRetrieve()),
			Route.post("/v1/pap/remove", this.papRemove()),
			Route.post("/v1/pap/query", this.papQuery())
		];
	}

	/**
	 * PAP: Store a policy.
	 * @returns The api endpoint.
	 */
	private papStore(): IApiEndpoint<IPapStoreRequest, void> {
		return async (req, res) => {
			this._logger.debug("papStore", "Store policy");

			try {
				Guards.truthy(req.body, "req.body");
				Guards.truthy(req.body.policy, "req.body.policy");

				const policy = req.body.policy as IOdrlPolicy;

				await this._service.papStore(policy, req.body.userIdentity, req.body.nodeIdentity);

				res.send();
			} catch (error) {
				this._logger.error("papStore", (error as IErrorObject).message);

				throw new GeneralError(this.CLASS_NAME, "papStoreFailed", undefined, error as Error);
			}
		};
	}

	/**
	 * PAP: Retrieve a policy.
	 * @returns The api endpoint.
	 */
	private papRetrieve(): IApiEndpoint<IPapRetrieveRequest, IPapRetrieveResponse> {
		return async (req, res) => {
			this._logger.debug("papRetrieve", "Retrieve policy");

			try {
				Guards.truthy(req.body, "req.body");
				Guards.truthy(req.body.policyId, "req.body.policyId");

				const policy = await this._service.papRetrieve(
					req.body.policyId,
					req.body.userIdentity,
					req.body.nodeIdentity
				);

				res.send({
					policy
				});
			} catch (error) {
				this._logger.error("papRetrieve", (error as IErrorObject).message);

				throw new GeneralError(this.CLASS_NAME, "papRetrieveFailed", undefined, error as Error);
			}
		};
	}

	/**
	 * PAP: Remove a policy.
	 * @returns The api endpoint.
	 */
	private papRemove(): IApiEndpoint<IPapRemoveRequest, void> {
		return async (req, res) => {
			this._logger.debug("papRemove", "Remove policy");

			try {
				Guards.truthy(req.body, "req.body");
				Guards.truthy(req.body.policyId, "req.body.policyId");

				await this._service.papRemove(
					req.body.policyId,
					req.body.userIdentity,
					req.body.nodeIdentity
				);

				res.send();
			} catch (error) {
				this._logger.error("papRemove", (error as IErrorObject).message);

				throw new GeneralError(this.CLASS_NAME, "papRemoveFailed", undefined, error as Error);
			}
		};
	}

	/**
	 * PAP: Query policies.
	 * @returns The api endpoint.
	 */
	private papQuery(): IApiEndpoint<IPapQueryRequest, IPapQueryResponse> {
		return async (req, res) => {
			this._logger.debug("papQuery", "Query policies");

			try {
				Guards.truthy(req.body, "req.body");

				const conditions = req.body.conditions as EntityCondition<IOdrlPolicy> | undefined;

				const result = await this._service.papQuery(
					conditions,
					req.body.cursor,
					req.body.userIdentity,
					req.body.nodeIdentity
				);

				res.send({
					cursor: result.cursor,
					policies: result.policies
				});
			} catch (error) {
				this._logger.error("papQuery", (error as IErrorObject).message);

				throw new GeneralError(this.CLASS_NAME, "papQueryFailed", undefined, error as Error);
			}
		};
	}
}
