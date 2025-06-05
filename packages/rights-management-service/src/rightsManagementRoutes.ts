// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	HttpParameterHelper,
	type ICreatedResponse,
	type IHttpRequestContext,
	type INoContentResponse,
	type IRestRoute,
	type ITag
} from "@twin.org/api-models";
import { ComponentFactory, Coerce, Guards } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	IPapCreateRequest,
	IPapQueryRequest,
	IPapQueryResponse,
	IPapRemoveRequest,
	IPapRetrieveRequest,
	IPapRetrieveResponse,
	IPapUpdateRequest,
	IRightsManagementComponent
} from "@twin.org/rights-management-models";
import { OdrlContexts } from "@twin.org/standards-w3c-odrl";
import { HttpStatusCode } from "@twin.org/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "rightsManagementRoutes";

/**
 * The tag to associate with the routes.
 */
export const tags: ITag[] = [
	{
		name: "Policy Administration Point",
		description: "Endpoints for managing ODRL policies in the Policy Administration Point"
	}
];

/**
 * The REST routes for the Rights Management.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesRightsManagement(
	baseRouteName: string,
	componentName: string
): IRestRoute[] {
	const createRoute: IRestRoute<IPapCreateRequest, ICreatedResponse> = {
		operationId: "papCreate",
		summary: "Create a policy",
		tag: tags[0].name,
		method: "POST",
		path: `${baseRouteName}/pap/`,
		handler: async (httpRequestContext, request) =>
			papCreate(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapCreateRequest>(),
			examples: [
				{
					id: "papCreateExample",
					request: {
						body: {
							"@context": OdrlContexts.ContextRoot,
							"@type": "Set",
							permission: [
								{
									target: "http://example.com/asset/1",
									action: "use"
								}
							]
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<ICreatedResponse>(),
				examples: [
					{
						id: "papCreateResponseExample",
						response: {
							statusCode: 201,
							headers: {
								location: "urn:rights-management:abc123def456"
							}
						}
					}
				]
			}
		]
	};

	const updateRoute: IRestRoute<IPapUpdateRequest, INoContentResponse> = {
		operationId: "papUpdate",
		summary: "Update a policy",
		tag: tags[0].name,
		method: "PUT",
		path: `${baseRouteName}/pap/:id`,
		handler: async (httpRequestContext, request) =>
			papUpdate(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapUpdateRequest>(),
			examples: [
				{
					id: "papUpdateExample",
					request: {
						pathParams: {
							id: "http://example.com/policy/1"
						},
						body: {
							"@context": OdrlContexts.ContextRoot,
							"@type": "Set",
							uid: "http://example.com/policy/1",
							permission: [
								{
									target: "http://example.com/asset/2",
									action: "read"
								}
							]
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<INoContentResponse>()
			}
		]
	};

	const retrieveRoute: IRestRoute<IPapRetrieveRequest, IPapRetrieveResponse> = {
		operationId: "papRetrieve",
		summary: "Retrieve a policy",
		tag: tags[0].name,
		method: "GET",
		path: `${baseRouteName}/pap/:id`,
		handler: async (httpRequestContext, request) =>
			papRetrieve(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapRetrieveRequest>(),
			examples: [
				{
					id: "papRetrieveExample",
					request: {
						pathParams: {
							id: "http://example.com/policy/1"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPapRetrieveResponse>(),
				examples: [
					{
						id: "papRetrieveResponseExample",
						response: {
							body: {
								"@context": OdrlContexts.ContextRoot,
								"@type": "Set",
								uid: "http://example.com/policy/1",
								permission: [
									{
										target: "http://example.com/asset/1",
										action: "use"
									}
								]
							}
						}
					}
				]
			}
		]
	};

	const removeRoute: IRestRoute<IPapRemoveRequest, INoContentResponse> = {
		operationId: "papRemove",
		summary: "Remove a policy",
		tag: tags[0].name,
		method: "DELETE",
		path: `${baseRouteName}/pap/:id`,
		handler: async (httpRequestContext, request) =>
			papRemove(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapRemoveRequest>(),
			examples: [
				{
					id: "papRemoveExample",
					request: {
						pathParams: {
							id: "http://example.com/policy/1"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<INoContentResponse>()
			}
		]
	};

	const queryRoute: IRestRoute<IPapQueryRequest, IPapQueryResponse> = {
		operationId: "papQuery",
		summary: "Query policies",
		tag: tags[0].name,
		method: "GET",
		path: `${baseRouteName}/pap/query`,
		handler: async (httpRequestContext, request) =>
			papQuery(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapQueryRequest>(),
			examples: [
				{
					id: "papQueryExample",
					request: {
						query: {
							cursor: "optional-pagination-cursor"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPapQueryResponse>(),
				examples: [
					{
						id: "papQueryResponseExample",
						response: {
							body: {
								cursor: "next-page-cursor",
								policies: [
									{
										"@context": OdrlContexts.ContextRoot,
										"@type": "Set",
										uid: "http://example.com/policy/1",
										permission: [
											{
												target: "http://example.com/asset/1",
												action: "use"
											}
										]
									}
								]
							}
						}
					}
				]
			}
		]
	};

	return [createRoute, updateRoute, retrieveRoute, removeRoute, queryRoute];
}

/**
 * PAP: Create a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papCreate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapCreateRequest
): Promise<ICreatedResponse> {
	Guards.object<IPapCreateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapCreateRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);
	Guards.stringValue(
		ROUTES_SOURCE,
		nameof(httpRequestContext.nodeIdentity),
		httpRequestContext.nodeIdentity
	);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);

	const policy = request.body;
	const uid = await component.papCreate(policy);

	return {
		statusCode: HttpStatusCode.created,
		headers: {
			location: uid
		}
	};
}

/**
 * PAP: Update a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papUpdate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapUpdateRequest
): Promise<INoContentResponse> {
	Guards.object(ROUTES_SOURCE, nameof(request), request);
	Guards.object(ROUTES_SOURCE, nameof(request.pathParams), request.pathParams);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);
	Guards.object(ROUTES_SOURCE, nameof(request.body), request.body);
	Guards.stringValue(
		ROUTES_SOURCE,
		nameof(httpRequestContext.nodeIdentity),
		httpRequestContext.nodeIdentity
	);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	await component.papUpdate(request.body);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * PAP: Retrieve a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papRetrieve(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapRetrieveRequest
): Promise<IPapRetrieveResponse> {
	Guards.object<IPapRetrieveRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapRetrieveRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);
	Guards.stringValue(
		ROUTES_SOURCE,
		nameof(httpRequestContext.nodeIdentity),
		httpRequestContext.nodeIdentity
	);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const policy = await component.papRetrieve(request.pathParams.id);

	return {
		body: policy
	};
}

/**
 * PAP: Remove a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papRemove(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapRemoveRequest
): Promise<INoContentResponse> {
	Guards.object<IPapRemoveRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapRemoveRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	await component.papRemove(request.pathParams.id);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * PAP: Query policies.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papQuery(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapQueryRequest
): Promise<IPapQueryResponse> {
	Guards.object<IPapQueryRequest>(ROUTES_SOURCE, nameof(request), request);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const result = await component.papQuery(
		HttpParameterHelper.objectFromString(request.query?.conditions),
		request.query?.cursor,
		Coerce.integer(request.query?.pageSize)
	);

	return {
		body: {
			cursor: result.cursor,
			policies: result.policies
		}
	};
}
