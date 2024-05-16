import {
  AuthorizationServerMetadata,
  CredentialSupported,
  CredentialIssuerMetadata,
  CredentialSupportedTypeV1_0_08,
  CredentialSupportedV1_0_08,
  IssuerMetadataV1_0_08,
  MetadataDisplay,
  OID4VCICredentialFormat,
  OpenId4VCIVersion,
} from '../types';
import { IssuerMetadataV1_0_13 } from '../types';

export function getSupportedCredentials(options?: {
  issuerMetadata?: CredentialIssuerMetadata | IssuerMetadataV1_0_08 | IssuerMetadataV1_0_13;
  version: OpenId4VCIVersion;
  types?: string[][];
  format?: OID4VCICredentialFormat | string | (OID4VCICredentialFormat | string)[];
}): Record<string, CredentialSupported> {
  if (options?.types && Array.isArray(options.types)) {
    return options.types
      .map((typeSet) => {
        return getSupportedCredential({ ...options, types: typeSet });
      })
      .reduce(
        (acc, result) => {
          Object.assign(acc, result);
          return acc;
        },
        {} as Record<string, CredentialSupported>,
      );
  }

  return getSupportedCredential(options ? { ...options, types: undefined } : undefined);
}

export function getSupportedCredential(opts?: {
  issuerMetadata?: CredentialIssuerMetadata | IssuerMetadataV1_0_08 | IssuerMetadataV1_0_13;
  version: OpenId4VCIVersion;
  types?: string | string[];
  format?: (OID4VCICredentialFormat | string) | (OID4VCICredentialFormat | string)[];
}): Record<string, CredentialSupported> {
  const { issuerMetadata, types, format } = opts ?? {};

  if (!issuerMetadata || !issuerMetadata.credential_configurations_supported) {
    return {};
  }

  const configurations = issuerMetadata.credential_configurations_supported;
  const formats = Array.isArray(format) ? format : format ? [format] : [];
  const normalizedTypes = Array.isArray(types) ? types : types ? [types] : [];

  const filteredConfigs: Record<string, CredentialSupported> = {};
  Object.entries(configurations).forEach(([key, value]) => {
    const isTypeMatch = normalizedTypes.length === 0 || normalizedTypes.includes(key);
    const isFormatMatch = formats.length === 0 || formats.includes(value.format);

    if (isTypeMatch && isFormatMatch) {
      filteredConfigs[key] = value;
    }
  });

  return filteredConfigs;
}

export function getTypesFromCredentialSupported(
  credentialSupported: CredentialSupported,
  opts?: { filterVerifiableCredential: boolean },
) {
  let types: string[] = [];
  if (
    credentialSupported.format === 'jwt_vc_json' ||
    credentialSupported.format === 'jwt_vc' ||
    credentialSupported.format === 'jwt_vc_json-ld' ||
    credentialSupported.format === 'ldp_vc'
  ) {
    types = credentialSupported.types;
  } else if (credentialSupported.format === 'vc+sd-jwt') {
    types = [credentialSupported.vct];
  }

  if (!types || types.length === 0) {
    throw Error('Could not deduce types from credential supported');
  }
  if (opts?.filterVerifiableCredential) {
    return types.filter((type) => type !== 'VerifiableCredential');
  }
  return types;
}

export function credentialsSupportedV8ToV13(supportedV8: CredentialSupportedTypeV1_0_08): Record<string, CredentialSupported> {
  const credentialConfigsSupported: Record<string, CredentialSupported> = {};
  Object.entries(supportedV8).flatMap((entry) => {
    const type = entry[0];
    const supportedV8 = entry[1];
    Object.assign(credentialConfigsSupported, credentialSupportedV8ToV13(type, supportedV8));
  });
  return credentialConfigsSupported;
}

export function credentialSupportedV8ToV13(key: string, supportedV8: CredentialSupportedV1_0_08): Record<string, CredentialSupported> {
  const credentialConfigsSupported: Record<string, CredentialSupported> = {};
  Object.entries(supportedV8.formats).map((entry) => {
    const format = entry[0];
    const credentialSupportBrief = entry[1];
    if (typeof format !== 'string') {
      throw Error(`Unknown format received ${JSON.stringify(format)}`);
    }
    const credentialConfigSupported: Partial<CredentialSupported> = {
      format: format as OID4VCICredentialFormat,
      display: supportedV8.display,
      ...credentialSupportBrief,
      credentialSubject: supportedV8.claims,
    };
    credentialConfigsSupported[key] = credentialConfigSupported as CredentialSupported;
  });
  return credentialConfigsSupported;
}

export function getIssuerDisplays(metadata: CredentialIssuerMetadata | IssuerMetadataV1_0_08, opts?: { prefLocales: string[] }): MetadataDisplay[] {
  const matchedDisplays =
    metadata.display?.filter(
      (item) => !opts?.prefLocales || opts.prefLocales.length === 0 || (item.locale && opts.prefLocales.includes(item.locale)) || !item.locale,
    ) ?? [];
  return matchedDisplays.sort((item) => (item.locale ? opts?.prefLocales.indexOf(item.locale) ?? 1 : Number.MAX_VALUE));
}

/**
 * TODO check again when WAL-617 is done to replace how we get the issuer name.
 */
export function getIssuerName(
  url: string,
  credentialIssuerMetadata?: Partial<AuthorizationServerMetadata> & (CredentialIssuerMetadata | IssuerMetadataV1_0_08),
): string {
  if (credentialIssuerMetadata) {
    const displays: Array<MetadataDisplay> = credentialIssuerMetadata ? getIssuerDisplays(credentialIssuerMetadata) : [];
    for (const display of displays) {
      if (display.name) {
        return display.name;
      }
    }
  }
  return url;
}
