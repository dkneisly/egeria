/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

export default function generateBasicServerConfig(options) {

  const {
    newServerName,
    newServerLocalURLRoot,
    newServerLocalServerType,
    newServerOrganizationName,
    newServerLocalUserId,
    newServerLocalPassword,
    newServerMaxPageSize,
  } = options;

  if (!newServerName) {
    return new Error(`Cannot create OMAG server configuration without Server Name`);
  }

  if (!newServerLocalURLRoot) {
    return new Error(`Cannot create OMAG server configuration without Local Server URL Root`);
  }

  if (!newServerLocalServerType) {
    return new Error(`Cannot create OMAG server configuration without Local Server Type`);
  }

  if (!newServerOrganizationName) {
    return new Error(`Cannot create OMAG server configuration without Organization Name`);
  }

  if (!newServerLocalUserId) {
    return new Error(`Cannot create OMAG server configuration without Local Server User ID`);
  }

  if (!newServerLocalPassword) {
    return new Error(`Cannot create OMAG server configuration without Local Server Password`);
  }

  return {
    "class": "OMAGServerConfig",
    "versionId": "V2.0",
    "localServerName": newServerName,
    "localServerType": newServerLocalServerType,
    "organizationName": newServerOrganizationName,
    "localServerURL": newServerLocalURLRoot,
    "localServerUserId": newServerLocalUserId,
    "localServerPassword": newServerLocalPassword,
    "maxPageSize": newServerMaxPageSize,
  }

}