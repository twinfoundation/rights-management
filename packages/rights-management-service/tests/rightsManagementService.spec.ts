// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import { RightsManagementService } from "../src/rightsManagementService";
import "./setupTestEnv";

describe("RightsManagementService", () => {
	test("Can create an instance", async () => {
		const service = new RightsManagementService();
		expect(service).toBeInstanceOf(RightsManagementService);
		expect(service.CLASS_NAME).toBe("RightsManagementService");
	});
});
