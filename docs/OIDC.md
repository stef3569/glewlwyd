# Glewlwyd OpenID Connect Plugin documentation

[![License: CC BY 4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](https://creativecommons.org/licenses/by/4.0/)

This plugin is based on the [OpenID Connect Core 1.0 specification](https://openid.net/specs/openid-connect-core-1_0.html) and allows Glewlwyd to act as an OpenID Provider (OP).

## Functionalities summary

The following OpenID Connect and OAuth2 functionalities are currently supported:

- [Authorization Code Flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)
- [Implicit flow](https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth)
- [Hybrid flow](https://openid.net/specs/openid-connect-core-1_0.html#HybridFlowAuth)
- [UserInfo Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo)
- [OAuth 2.0 Multiple Response Types](http://openid.net/specs/oauth-v2-multiple-response-types-1_0.html)
- [OpenID Connect Discovery](http://openid.net/specs/openid-connect-discovery-1_0.html)
- [Address Claims](https://openid.net/specs/openid-connect-core-1_0.html#AddressClaim)
- [Requesting Claims using the "claims" Request Parameter](https://openid.net/specs/openid-connect-core-1_0.html#ClaimsParameter)
- [Requesting Claims using Scope Values](https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims)
- [Client authentication](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication) using HTTP Basic Auth, POST Parameter or JWT
- [Passing Request Parameters as JWTs](https://openid.net/specs/openid-connect-core-1_0.html#JWTRequests)
- [Subject Types public or pairwise](https://openid.net/specs/openid-connect-core-1_0.html#SubjectIDTypes)
- [Proof Key for Code Exchange by OAuth Public Clients](https://tools.ietf.org/html/rfc7636)
- [Token introspection (RFC 7662)](https://tools.ietf.org/html/rfc7662)
- [Token revocation (RFC 7009)](https://tools.ietf.org/html/rfc7009)
- [OpenID Connect Dynamic Registration](http://openid.net/specs/openid-connect-registration-1_0.html)
- [OAuth 2.0 Dynamic Client Registration Protocol](https://tools.ietf.org/html/rfc7591)
- [OAuth 2.0 Dynamic Client Registration Management Protocol](https://tools.ietf.org/html/rfc7592)
- [OAuth 2.0 Form Post Response Mode](http://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html)
- [Messages encryption](https://openid.net/specs/openid-connect-core-1_0.html#Encryption)
- [Session Management](https://openid.net/specs/openid-connect-session-1_0.html)
- [JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens](https://www.rfc-editor.org/rfc/rfc9068.html)
- [OAuth 2.0 for Native Apps](https://tools.ietf.org/html/rfc8252), see [Native Apps Guidelines](#native-apps-guidelines)
- [OAuth 2.0 Device Authorization Grant](https://tools.ietf.org/html/rfc8628)
- [OAuth 2.0 Demonstration of Proof-of-Possession at the Application Layer (DPoP) Draft 04](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-04)
- [JWT Response for OAuth Token Introspection Draft 12](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-jwt-introspection-response-12)
- [Resource Indicators for OAuth 2.0](https://tools.ietf.org/html/rfc8707)
- [OAuth 2.0 Rich Authorization Requests Draft 03](https://www.ietf.org/archive/id/draft-ietf-oauth-rar-03.html)
- [OAuth 2.0 Pushed Authorization Requests](https://datatracker.ietf.org/doc/html/rfc9126)
- [OAuth 2.0 JWT Secured Authorization Request (JAR)](https://datatracker.ietf.org/doc/html/rfc9101)
- [OpenID Connect Client-Initiated Backchannel Authentication Flow](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0.html)
- [OAuth 2.0 Authorization Server Issuer Identification](https://www.ietf.org/id/draft-ietf-oauth-iss-auth-resp-01.html)
- [Financial-grade API Security Profile 1.0 - Part 1: Baseline](https://openid.net/specs/openid-financial-api-part-1-1_0-final.html)
- [Financial-grade API Security Profile 1.0 - Part 2: Advanced](https://openid.net/specs/openid-financial-api-part-2-1_0.html)
- [Financial-grade API: Client Initiated Backchannel Authentication Profile](https://bitbucket.org/openid/fapi/src/master/Financial_API_WD_CIBA.md)
- [OpenID Connect Front-Channel Logout 1.0 - draft 04](https://openid.net/specs/openid-connect-frontchannel-1_0.html)
- [OpenID Connect Back-Channel Logout 1.0 - draft 06](https://openid.net/specs/openid-connect-backchannel-1_0.html)

The following OpenID Connect functionalities are not supported yet:

- [Self-Issued OpenID Provider](https://openid.net/specs/openid-connect-core-1_0.html#SelfIssued)

## Messages encryption

Glewlwyd OIDC plugin relies on Rhonabwy library to sign and encrypt tokens. All the JWT signing algorithms are supported but not all the JWT key management encryption algorithms and data encryption algorithms. The discovery endpoint is up-to-date with the supported encryption algorithms.

Concerning key management encryption using symmetric keys, the encryption key is based on a hash of the client secret or the server secret depending on the token to encrypt.

To generate a symmetric key encryption, you must build a SHA256 hash of the secret for the key management encryption algorithms `A128KW`, `A192KW`, `A256KW`, `A128GCMKW`, `A192GCMKW` and `A256GCMKW`. Depending on the alg value, you must use the n first bytes of the hash as follows:
- `A128KW`, `A128GCMKW`: 16 first bytes of the hash
- `A192KW`, `A192GCMKW`: 24 first bytes of the hash
- `A256KW`, `A256GCMKW`: 32 bytes of the hash

If the key management encryption algorithm is `dir`, you must build a SHA512 hash of the secret, then depending on the `enc` value, you must use the n first bytes of the hash as follows:
- `A128CBC-HS256`, `A128GCM`, `A192GCM`, `A256GCM`: 32 first bytes of the hash
- `A192CBC-HS384`: 48 first bytes of the hash
- `A256CBC-HS512`: 64 bytes of the hash

### Multiple keys

If the plugin has multiple keys available, the client can choose any of them to encrypt their requests. But the client MUST set the `kid` value in the JWT header to specify the key to use for decryption.

### Access tokens, refresh tokens and code encryption

If the client receives an encrypted access tokens, refresh tokens or code, it must decrypt it in order to use it with Glewlwyd. In particular, the encrypted access token must be decrypted and the nested JWS must be extracted to be usable by Glewlwyd for getting access to userinfo, token revocation or introspection, etc.

## Access token format

As a heir of [Glewlwyd OAuth2 plugin](OAUTH2.md), Glewlwyd OpenID Connect plugin uses JWTs as access tokens. Therefore, the access token can be used by the client or the third party web service to identify the user and the scopes available with this access token. The access token claims format implements [JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens - draft 05](https://tools.ietf.org/html/draft-ietf-oauth-access-token-jwt-05).

An access token payload has the following JSON format:

```Javascript
{
  "iss": "https://glewlwyd.tld/", // Issuer
  "sub": "4321zyxdcba",           // subject that was provided this access_token
  "aud": "https://resource.tld/", // The resource this access_token is intended to, or the scope list
  "client_id": "client1",         // client_id the access_token was provided to
  "jti": "abcdxyz1234",           // token identifier
  "type": "access_token",         // Hardcoded
  "iat": 1466556840,              // Issued at time in Epoch Unix format
  "exp": 1466558840,              // Expiration of the token in Epoch Unix format
  "nbf": 1466558840,              // Not before time in Epoch Unix format
  "scope":"scope1 g_profile",     // scopes granted to this access token in a string separated by spaces
  "claims": {},                   // claims asked by the client
  "cnf": {
    "x5t#S256": xxx",             // identifier of the certificate used to sign this JWT
    "jkt": "yyy"                  // thumbprint of the client public key if DPoP is used
  }       
}
```

## Keys for JWT tokens signatures

### Single key pair in PEM format

To create a key/certificate pair for RSA, ECDSA, RSA-PSS or EdDSA format, run the following commands on a Linux shell with openssl installed:

```shell
$ # RSA/RSA-PSS KEY
$ # private key
$ openssl genrsa -out private-rsa.key 4096
$ # public key
$ openssl rsa -in private-rsa.key -outform PEM -pubout -out public-rsa.pem

$ # ECDSA/EdDSA KEY
$ # private key
$ openssl ecparam -genkey -name secp521r1 -noout -out private-ecdsa.key
$ # public key
$ openssl ec -in private-ecdsa.key -pubout -out public-ecdsa.pem
```

For more information on keys generation, see [OpenSSL Documentation](https://www.openssl.org/docs/).

### Multiple private keys in JWKS format

If you want to use multiple keys for signatures, you need to setup the keys in JWKS format. The JWKS must follow these rules:

- All keys in the JWKS must be either private ECC/RSA keys or symmetric keys
- All keys must have a `'alg'` property with the value corresponding to the algorithm to use
- All keys must have a `'kid'` property

If the `'default-kid'` value is empty in the configuration, the first key in the JWKS will be the default signing key.

### Generate JWKS using rnbyc

The library [Rhonabwy](https://github.com/babelouest/rhonabwy) comes with the command-line program [rnbyc](https://babelouest.github.io/rhonabwy/md_tools_rnbyc_README.html). You should have the program available if you installed Glewlwyd with the packages or using CMake.

This tool can be used to generate a new private key or key pair in JWKS format and/or parse a key in JWKS or PEM format.

Check out [rnbyc documentation](https://babelouest.github.io/rhonabwy/md_tools_rnbyc_README.html) for more information about this tool.

#### Example 1: Generate a JWKS with a single ECDSA 256 private key

This simple example shows how to generate a ECDSA 256 private key.

```shell
$ rnbyc -j -g ec256 -k key-1 -a ES256 -p /dev/null
{
  "keys": [
    {
      "kty": "EC",
      "x": "AN64-jEEs_0zQfuUJI-9Rik6hkYMrIDHzSUfT3jlrA-q",
      "y": "APmN2Hk4SxihpBzQAZRVHlpxJS6O_0q-k8JgCcN-hj88",
      "d": "BvC2P98BQsYiMHqPqqfsguXe2Vl92JmZnB6Pj0jTHsM",
      "crv": "P-256",
      "kid": "key-1",
      "alg": "ES256"
    }
  ]
}
```

#### Example 2: Generate a JWKS with a ECDSA 256 private key and a 2048 bits RSA key

```shell
$ rnbyc -j -g ecdsa256 -k key-1 -p /dev/null -g rsa2048 -k key-2 -p /dev/null
{
  "keys": [
    {
      "kty": "EC",
      "x": "AN64-jEEs_0zQfuUJI-9Rik6hkYMrIDHzSUfT3jlrA-q",
      "y": "APmN2Hk4SxihpBzQAZRVHlpxJS6O_0q-k8JgCcN-hj88",
      "d": "BvC2P98BQsYiMHqPqqfsguXe2Vl92JmZnB6Pj0jTHsM",
      "crv": "P-256",
      "kid": "key-1",
      "alg": "ES256"
    },
    {
      "kty": "RSA",
      "n": "ANpN63DvHZKWlMEk94xq3vheqfSPMyrkvIDLoTeD_ONmZFfiJ9fjRKa8uZPIJ01woRGTMawVnqSCN8dusR79mv7lQn9jTMPMVUqD2ndGS6t5V2fW1YZO6TFjkFONvFB8U3G9JaB1apYSxZfx8oQwq6rQ3lLBDi07SlMbzl9cQGMceaFMC9mRquIh9svDdTzx9L7otRzET756i0whl7uKEfJ7wTR17LaeCf7eW_s7XVCgPRNSlR5FfQjoCM4AMGRbEn5HwVTds9jBxyFGLTj1sN570NIzg2bNtIdk4EDjAE5ZBrLn02nCH4B75Cx4R9zzZ4rhMV4UR39kpIt7gqjY9zs",
      "e": "AQAB",
      "d": "AI032LV-yVeZd3MWUdkRDVoICtN8izIVM-fxUkISbNZB12mOkA21JCTkcvwpf1s2H8u5t2lFtxFed2zYq1WL4uc_MWwstWz30rjYYMvFuo-beDJhJFG03F8ptCSIzKgYNPaf0CZjrmaUkCQBzMs8nOBsK1XHMz-JWkQ2-aJwj-pMQFBjXX02j-rokXVCsEflgFCjXgTGaC8wAOlF1omKU53heW8DzjpQgVHCKumIw2B8eLNOW4LlR_jxg-dqta4G-6Hqou5zdXnEeHbkXV-bnS2l3mIcqAt-Hp0EbpSBFzth3uUpgihwx1uiwCFoULNiZWGbnrUEuZBpJngleWUr-Fk",
      "p": "APRew0zj8zGv7xoByRi41XqaH2ZfC_GrddAK3gYVdYWDAt3pHbUQofrT-yhF6CsQTz-L7iR4VHNf-j7S3knRUPf6hggB1sb4_6D8a2fH4rI1TrDwXf5Mm9PDfOjkx6ukgzgsbiICsS8kK4Vpy3IvbNqGtCribU5B0-kpHgHjsnvH",
      "q": "AOSxltWZopKfA74DFSs4fjnq_P4jl58IRmMMtnzfy-xXxVCJ-VPmzABfKlrhqtIckdYLeJE5Xxt76Mcq3-4YBSwWUHSkejGUAaLGfJspIEx7l3xOiCwpP2jVtpYUrhEMTbRZMlc7E5Ko1R7tU_pviMfLZwK5JrakQcYhgbG2wKDt",
      "qi": "XNkpOGrFesrOkdSteU7Ew-aaB4xxSLEE2xz50nbJ2ck8qR5u6C7r1F4AeaKxGABpT_HKcoZ7pD3NUnR_yzTwQTW8Sn3WWeeRazXXxXxTw6prgLRiA189RLLuzatPd7Lyl_mwWpmWHR6pA-iWIXDlByoNMVPTXKoCU3CBs-s1DS4",
      "dp": "TFl_M3rU9OU_EyUTq4G0UUXuIZH4rV0gxgtfKw9xVHGGZ8b53SSBN1kb041j6HCEEhqqIQLnf9Sw3wgLI40eexvu3HmWnTwWwjmbZSVykrNNDsNK2rUcyqD9WdaA_AO-a8KV9lJZAZ2Pa3OOePKQVAZaLDvqYtT2XJbYJUb68Ok",
      "dq": "AKox9APw-4lMqBdP6gApYd8un6tux5cGLIPoYSMb1oKEa4bdt90WBTo9mKLcESmfM3VtQgQqAzrMA1e987sYyzidPrEf-wRMls8SEofSmoPw8rMDKtpatCML8X9N0qFDW8zdGNbMU2uxFDKZAwd82_l8yaPAMSx5n62ZIBEm5cKd",
      "kid": "key-2"
    }
  ]
}
```

#### Example 3: Key rotation using rnbyc and reload config automatically using API Keys

In this example, you need to generate a new key every week, and want to keep the previous key *alive* for compatibility reasons.

In Glewlwyd's OIDC plugin, if you provide several private keys without specifying the default kid, the first one will be the default key to sign the JWTs. So in this example, the new key will be the first in the list, and the previous one will be the second one. Therefore clients and resource providers will be able to verify a token signature for valid tokens. Each private key generated will be stored in a file.

First, generate a *week 0* private key:

```shell
$ # week 0: generate a first private key ECDSA256
$ rnbyc -j -g ecdsa256 -o $(date +%Y-%V).jwks -p /dev/null -n 0
$ # use the generated file content as the private key for token signature
$ cp $(date +%Y-%V).jwks private.jwks
```

Every other week, generate a new private key and concat last week's private key in the generated JWKS

```shell
$ # next weeks: generate a new private key ECDSA256 and concat this week and last week's private key in the generated JWKS
$ rnbyc -j -g ecdsa256 -o $(date +%Y-%V).jwks -p /dev/null -n 0
$ rnbyc -j -f $(date +%Y-%V).jwks -f $(date --date="last week" +%Y-%V).jwks -o private.jwks -p /dev/null -n 0
```

Then, after each key generation, you can use the content of the file `private.jwks` to update your OIDC plugin configuration.

The following commands show an example on how to automatically update an OIDC plugin with the new private key with an [API key](GETTING_STARTED.md#access-to-administration-api-via-api-keys), and the command-line tools [curl](https://curl.haxx.se/) and [jq](https://stedolan.github.io/jq/).

```shell
$ # Get the current configuration for plugin 'oidc'
$ curl -s 'http://localhost:4593/api/mod/plugin/oidc' -H 'Authorization: token XJcv1MRnK33EHAedPGELl0yXx2W6vUPu' -o oidc.json
$ # Set the content of the file private.jwks to an environment variable
$ export private=$(cat private.jwks)
$ # update the current configuration with the new private key JWKS file and save to file oidc-2.json
$ jq '.parameters ."jwks-private" = env.private' --compact-output oidc.json > oidc-2.json
$ # Update the configuration for plugin 'oidc'
$ curl -s -H 'Authorization: token XJcv1MRnK33EHAedPGELl0yXx2W6vUPu' -X "PUT" -H "Content-Type: application/json" -d @oidc-2.json 'http://localhost:4593/api/mod/plugin/oidc'
$ # Reset the plugin 'oidc' to load the new private keys
$ curl -s -H 'Authorization: token XJcv1MRnK33EHAedPGELl0yXx2W6vUPu' -X "PUT" 'http://localhost:4593/api/mod/plugin/oidc/reset'
```

## Installation

![plugin-oidc](screenshots/plugin-oidc.png)

In the administration page, go to `Parameters/Plugins` and add a new plugin by clicking on the `+` button. In the modal, enter a name and a display name (the name must be unique among all user backend instances).
Select the type `Glewlwyd OpenID Connect plugin` in the Type drop-down button.

Below is the definition of all parameters.

### Name

Name (identifier) of the plugin instance, must be unique among all the plugin instances, even of a different type.

### Display name

Name of the instance displayed to the user.

### Issuer

Issuer that will be added in all ID Tokens, must correspond to your Glewlwyd instance URL.

### Subject type identifier

Specify the way to identify subjects.

If the selected value is `public`, the `sub` value in access tokens and id tokens will always have the same value.

If the selected value is `pairwise`, the `sub` value in access tokens and id tokens will have a different values for clients of different `sector_identifier_uri` or if the `sector_identifier_uri` is empty, for different clients.

### Supported scopes

Specify the list of scopes available in the property `scopes_supported` in the discovery endpoint.

Important note: This list has no effect on what scopes are actually allowed by users for clients in the plugin instance, because by design, all scopes are available for use. The availability of a scope for a user to a client depends on the configuration of those 3 items, and you can't restrict the use of some scopes in the OpenID Connect plugin.

The meaning of existence of this list is to allow the administrator to choose which scopes will be shown on the discovery endpoint.

Therefore, the administrator can chose to show in the discovery endpoint all scopes, only `openid` (which is mandatory in the specification) or a subset of all scopes available, including `openid`.

### Client restrict-scope property

Specify the client property to store the list of scopes a client is allowed to get grant access from a user.

Important note: If this configuration is set, then **all** clients must have the restrict scope list set according to the scopes they are allowed to ask for in a request.

### JWKS URI

URI to fetch the private keys JWKS. This uri is loaded each time the plugin is enabled. If you want to update your server keys, you must restart the Glewlwyd server or call the API [Enable or disable an existing plugin module instance](API.md#enable-or-disable-an-existing-plugin-module-instance) with the action value `reset`.

### JWKS to use

Enter the JWKS value directly or select the local file tat contains the private keys JWKS.

### Default Key ID (KID)

The default KID that will be used to sign tokens if the client does not specify a `sign_kid` value. If not set, the default KID will be the first one in the JWKS.

### Client sign_kid property

Client property that will hold the default kid. This option is used to specify a different KID than the default one for a specific client.

### Public JWKS URI

URI to fetch the public keys JWKS. This uri is loaded each time the plugin is enabled. If you want to update your server keys, you must restart the Glewlwyd server or call the API [Enable or disable an existing plugin module instance](API.md#enable-or-disable-an-existing-plugin-module-instance) with the action value `reset`.

Note: This setting value is optional, if you omit this value, the public key will be extracted from your JWKS private key. Use this setting if you want to specify the public keys available in the public JWKS endpoint: `/api/<plugin_name>/jwks`

### Public JWKS

Enter the JWKS value directly or select the local file tat contains the private keys JWKS.

Note: This setting value is optional, if you omit this value, the public key will be extracted from your JWKS private key. Use this setting if you want to specify the public keys available in the public JWKS endpoint: `/api/<plugin_name>/jwks`

### JWT Type

Algorithm used to sign access tokens and ID Tokens.

The algorithm supported are `RSA` and `ECDSA` using a private and a public key, and `SHA` using a shared secret.

### Key size

Size of the key to sign the tokens. The sizes supported are 256 bits, 384 bits or 512 bits.

### Secret key

Private key file used to sign if the selected algorithm is `RSA` or `ECDSA`. Must be a PEM format file.
Shared secret if the selected algorithm is `SHA`.

### Public key

Public key file used to validate access tokens if the selected algorithm is `RSA` or `ECDSA`. Must be a PEM format file.

### Access token duration (seconds)

Duration of each access tokens. Default value is 3600 (1 hour).

### Refresh token duration (seconds)

Duration of validity of each refresh tokens. Default value is 1209600 (14 days).

### Code duration (seconds)

Duration of validity of each code sent to the client before requesting a refresh token. Default value is 600 (10 minutes).

### Refresh token rolling

If this option is checked, every time an access token is requested using a refresh token, the refresh token issued at time will be reset to the current time. This option allows infinite validity for the refresh tokens if it's not manually disabled, but if a refresh token isn't used for more of the value `Refresh token duration`, it will be disabled.

### One-time use refresh token

Updates the one-time use for refresh tokens.

Values available are
- `Never`: The one-time use is disabled
- `Always`: The one-time use is always on
- `Client-driven`: The one-time use is enabled only for clients who allow it with a specified property

A one-time use refresh token will be disabled after successfully getting an access token from it, but then a new refresh token will be available along with the new access token in the JSON response. A chain of refresh token will be created, adding a new and enabled refresh token and disabling the previous one on each refresh.

However, if a refresh token is used twice, the chain will be considered broken (i.e. a refresh token has been stolen), therefore the last refresh token of the chain will be disabled.

### refresh-token-one-use property

Enter the client property that will hold the `refresh-token-one-use` flag of the client. This property value will tell if the client allows to encrypt refresh tokens code.

### Allow non OIDC but valid OAuth2 requests

If this option is checked, the plugin instance will allow requests that are not allowed in the OIDC standard but valid in the OAuth2 standard, such as response_type: `token` (alone), `password` or `client_credential`. In those cases, the request will be treated as a normal OAuth2 but the response will not have an ID Token.

### Authentication type code enabled

Enable response type `code`.

### Revoke all tokens if a client tries to replay a code

If this option is set, when a code is replayed to gain a refresh token, all the refresh and access tokens delivered for this code will be revoked. This option can be used to mitigate replay attacks and enforce tokens security.

### Authentication type token enabled

Enable response type `token`.

### Authentication type ID Token enabled

This option is enabled and can't be disabled.

### Authentication type password enabled

Enable response type `password`.

### Authentication type client enabled

Enable response type `client_credential`.

### Authentication type device enabled

Enable response type `device_code`.

### Authentication type refresh enabled

Enable response type `refresh_token`.

### Service documentation URL (optional)

`openid-configuration` URL to the service documentation to help users or client to connect to Glewlwyd server, default is Glewlwyd GitHub documentation.

### Service policy URL (optional)

`openid-configuration` URL to the service policy.

### Terms of service URL (optional)

`openid-configuration` URL to the terms of service.

### JWKS available

Enable JWKS available at the address `<plugin_root>/jwks`. Note, JWKS will display public keys for key types `RSA` and `ECDSA` only.

### X5C certificate chain (optional)

Add or remove the chain of X5C certificate to help clients and users validate the certificate chain of each `id_token` or `access_token`. Ignored if the keys are specified via JWKS.

### Specific scope parameters

This section allows to put specific settings for an scope that will override the plugin settings.

The settings that you can override are `Refresh token duration` and/or `Rolling refresh`.

Please note that a specific scope parameter has a higher priority than the plugin settings, and if have multiple scopes in a request that have specific settings, the settings will follow the following algorithm:
- Refresh token duration: The duration provided will be the lowest duration among all the specific scope parameters.
- Rolling refresh: The value `No`has higher priority, therefore rolling refresh provided will be `No` if one scope has the value `No`, `Yes` otherwise

### Additional token values

This section allows to add specific values to the access_tokens that will be taken from the user property values.

You can add as many additional values as you want. If the property isn't present in the user data, it will be ignored. If the value is multiple, all values will be present, separated by a comma `,`.

### Additional claims in the ID Token or the /userinfo endpoint

This section allows to add specific claims in ID Tokens or userinfo results and to specify name, e-mail and granted scope claim handling.

`Name claim`, `E-mail claim` and `Scope` properties can have one of the following values:
- No: The value will never be available on ID Tokens or userinfo results
- On demand: The value will be available if specifically asked in the `claims` parameter
- Mandatory: The value will always be available on ID Tokens or userinfo results

In addition, you can add these claims as scope claims.

If you add additional claims, the options available are the following.

If you specify a type `number`, the value will be converted from a string to an integer.

If the conversion fails, the value will be ignored. If you specify a type `boolean`, you must specify the values for `true` and `false`. If the value doesn't match, it will be ignored.

If you check the option `Mandatory`, the claim will be added in all ID Tokens or userinfo calls, even if the claim isn't requested by the user.

Finally, you add scopes to additional claims.

### Address claim properties

This section allows to specify how to handle address claim.

If the drop-down button `Use claim address` is set to `No`, the claim address isn't available for any user.

If the drop-down button `Use claim address` is set to `On demand` or 'Mandatory', you must specify which properties available in the user profile will match the address claim properties.

If an address claim property is empty or its corresponding property value in the user profile is empty or unavailable, the value will not be present in the address claim. If the address claim is empty, it will not be present in the result.

## Claims request

You can specify claims in your request according to the ["claims" request parameter](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims). The claims request parameter can be present in the URL in JSON format url-encoded if the HTTP method is `GET`, in the post body parameter in JSON format url-encoded if the HTTP method is `POST`, or in the JWT payload if you use JWT request parameter.

The supported options for a claim are `null`, `value` and `values`. Option `essential` isn't supported.

For example:

```Javascript
{
 "userinfo":
  {
   "given_name": null,
   "nickname": null,
   "email": {"value": "dev@glewlwyd.tld"},
   "picture": null,
  },
 "id_token":
  {
   "acr": {"values": ["urn:mace:incommon:iap:silver"] }
  }
}
```

To have a claim available in the claim request, it must be set to `on-demand` in the plugin configuration.

## JWT requests, public keys and JWKS

### Allow passing request parameter as JWT

Allow using request parameters as JWT with `request` objects or `request_uri` links.

### Strict compliance with IETF request parameter

If this is set, the JWT requests must be strictly compliant with the [IETF definition](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-jwsreq-32) rather than the [OIDC definition](https://openid.net/specs/openid-connect-core-1_0.html#JWTRequests). The main difference are:
- The `client_id` value present in the JWT and the url
- The JWT `typ` header value must be `oauth-authz-req+jwt`
- The response content-type when using a `request_uri` must be `application/oauth-authz-req+jwt` or `application/jwt`

### Allow encrypted request parameter as JWT

The client can send a nested JWT by using its secret value or the server public keys to encrypt the claims.

### Allow request_uri and jwks_uri to a unsecured https:// uri

If the specified `request_uri` link points to an insecure https:// page with invalid certificate or hostname, allow it anyway.

Warning! This may lead to unsecured connections or MITM attacks.

### Maximum expiration time authorized for JWT requests

Maximum time a token JWT request is allowed to use in seconds. A JWT request with a higher expiration time will be refused.

### pubkey property

Enter the client property that will hold a public key in PEM format.

### JWKS property

Enter the client property that will hold the JWKS of the client.

### JWKS_URI property

Enter the client property that will hold the JWKS_URI of the client. The JWKS will be downloaded each time the JWKS is requested.

## Encrypt out tokens

### Allow out token encryption

Allow to encrypt out tokens for client that have an encryption setup.

### enc property

Enter the client property that will hold the `enc` of the client. If not set, the `enc` value will be set to default `A128CBC-HS256`.

### alg property

Enter the client property that will hold the `alg` of the client. If not set token encryption will be disabled for all.

### kid_alg property

Enter the client property that will hold the `kid_alg` of the client. Mandatory if the client uses jwks, ignored if the client uses a public key in PEM format.

### encrypt_code property

Enter the client property that will hold the `encrypt_code` flag of the client. This property value will tell if the client allows to encrypt authorization code.

### encrypt_at property

Enter the client property that will hold the `encrypt_at` flag of the client. This property value will tell if the client allows to encrypt access tokens.

### encrypt_userinfo property

Enter the client property that will hold the `encrypt_userinfo` flag of the client. This property value will tell if the client allows to encrypt userinfo when sent as JWT.

### encrypt_id_token property

Enter the client property that will hold the `encrypt_id_token` flag of the client. This property value will tell if the client allows to encrypt id_tokens.

### encrypt_refresh_token property

Enter the client property that will hold the `encrypt_refresh_token` flag of the client. This property value will tell if the client allows to encrypt refresh tokens code.

## PKCE - Code challenge (RFC 7636)

This section is used to configure [Proof Key for Code Exchange by OAuth Public Clients](https://tools.ietf.org/html/rfc7636).

### PKCE allowed

Allow if you want to support code challenge.

### Method plain allowed

Enable this feature if you want to allow method `plain` in the code challenge feature. It is not recommended to enable this feature unless you know what you do because this feature is slightly less secure than default method `S256`.

According to [the specifications](https://tools.ietf.org/html/rfc7636#section-4.2):

```
Clients are
permitted to use "plain" only if they cannot support "S256" for some
technical reason and know via out-of-band configuration that the
server supports "plain".
```

#### Scopes where PKCE is mandatory

Select the scopes for which PKCE is mandatory when using `auth` or `par` requests.

#### PKCE required

Allow if you want to require all clients to use PKCE when using `auth` or `par` requests.

## Tokens Introspection (RFC 7662) and Revocation (RFC 7009)

**IMPORTANT NOTICE!**

Glewlwyd access tokens are [JWTs](https://tools.ietf.org/html/rfc7519), the original way for resource services to check if an access token or an id_token is valid and reliable is to check its signature and its expiration date. Token introspection and revocation have been introduced in Glewlwyd, but if the resource service doesn't use the introspection endpoint, it will miss an inactive token and still consider it valid.

The endpoints `/userinfo`, `/introspect` and `/revoke` when they are given an access token to authenticate will check if the token is revoked or not.

### Allow tokens introspection and invocation

Enable this feature if you want your oauth2 instance to enable endpoints `/introspect` and `/revoke`.

### Allow for the token client

Enable this feature if your want to allow clients to use endpoints `/introspect` and `/revoke` using their client_id and secret as HTTP Basic Auth. The client will be allowed to introspect and revoke tokens if it has the auhtorization type `client_credentials`.

### Required scopes in the access token

Add one or more scopes if you want to allow to use endpoints `/introspect` and `/revoke` using valid access tokens to authenticate the requests. The access tokens must have the scopes required in their payload to be valid.

## Clients registration

This section is used to parameter client registration as defined in [OpenID Connect Dynamic Registration](http://openid.net/specs/openid-connect-registration-1_0.html). If enabled, the administrator can (should?) require an access token with the proper scope to be able to register a new client.

How this `access_token` is provided is out of scope of this documentation.

### Allow client registration via API /register

Enable this feature if you want to enable client registration endpoint `/register`.

### Required scopes in the access token

Add on or more scopes if you want to allow to use endpoint `/register` using valid access tokens to authenticate the requests. The access tokens must have the scopes required in their payload to be valid.

### Scopes to add to the new clients

Default scopes that will be added to the registered clients, can be empty. This scope list is only used in `client_credentials` response type.

### Allow clients to manage their registration

Add endpoints for clients to manage their registration as defined in [OAuth 2.0 Dynamic Client Registration Management Protocol](https://tools.ietf.org/html/rfc7592).

### Default properties

Add default properties and values to clients during registration.

## Session management

### Allow session management endpoints

If this is set to true, a session ID will be used to identify the user's session, the same `sid` parameter will be added to all ID Tokens for the same session.

The following session management endpoints will be available:

- `GET /api/{plugin_name}/end_session`: Start the end session flow. The query parameter `id_token_hint` referencing the ID Token's session to close. In addition, the optional parameters `post_logout_redirect_uri` and `state` can be passsed. If a valid id_token is used as parameter, the endpoint will redirect to the login page with valid parameters to complete the session ending
- `GET /api/{plugin_name}/session/:sid/:client_id`: Get the list of clients which are referrenced by this session and use OpenID Connect Front-Channel Logout (if enabled)
- `DELETE /api/{plugin_name}/session/:sid/`: Confirm the suppression of this session and send an end session token to the clients which are referrenced by this session and use OpenID Connect Back-Channel Logout (if enabled)
- `GET /api/{plugin_name}/check_session_iframe`: Check the current session as standardized in [Session Management](https://openid.net/specs/openid-connect-session-1_0.html)

## Device Authorization management

### Code expiration (seconds)

`device_code` expiration in seconds.

### Suggested interval between code verification (seconds)

If the client sends the device code in a shorter period, it will receive a `slow_down` error response.

## Client secret vs password

When you add or edit a client in Glewlwyd, you can set a `client secret` or a `password`. Both can be used to authenticate confidential clients.

The primary difference is that a client secret is a string stored 'as is' in the backend (database or LDAP), without hashing, where a client password is stored in a hashed form in the backend, so makes it more difficult for attackers to retrieve it.

A client secret has priority over a client password, which means that if a client has set both client secret and client password, the authentication will be executed with client secret only.

The `client secret` can also be used to authenticate a client using the method `client_secret_jwt`.

## Mutual-TLS Client Authentication (rfc8705)

!!!Full disclosure!!!
This authentication scheme has been implemented based on the documentation and examples I could find. But there may be other and better ways to implement this type of authentication.
If you find bugs, weird behaviours, or wish new features, please [open an issue](https://github.com/babelouest/glewlwyd/issues) in the GitHub repository or send an e-mail.

If you intent to use Glewlwyd directly, set this option to `TLS Session`. You must also configure Glewlwyd in secure mode with the proper `secure_connection_ca_file` value. This configuration value must be set to your CA certificate or your CA chain certificate in order to validate clients certificates provided.

Self-signed certificates couldn't be tested in TLS sessions.

### Certificate source

Where to retrieve the client certificate. Values available are:
- `None` to disable Mutual-TLS Client Authentication
- `TLS session` to retrieve the client certificate in the TLS session
- `HTTP header` to retrieve the client certificate in the HTTP header
- `Both` to retrieve the client certificate both in the TLS session and the header

Important security warning!
If you don't use Glewlwyd behind a reverse proxy to forward the certificate in the header, this option MUST be set to `TLS Session` only, otherwise, an attacker could manually change the header value, to fake any valid user without having to know its certificate key.

If you set this value to `HTTP Header` or `both`, it allows to use Glewlwyd behind a reverse proxy such as Apache's mod `proxy`. You must then configure the proxy to validate the clients certificate and key using your CA certificate and if the client certificate is valid, the proxy must forward the X509 certificate to Glewlwyd in a specified header.

### Corresponding header property

Header property name to retrieve client certificate. Must be set if certificate source is `header` or `Both`.

### Use alias for client endpoints

If this is set to true, new client endpoints will be added: `mtls/token` as well as `mtls/introspect`, `mtls/revoke` and `mtls/device_authorization` if necessary.

### Allow self-signed certificates

If this is set to true, clients will be allowed to use self-signed certificates for authentication.

**WARNING** This setting must be used with high precaution! Self-signed certificates are less secure than certificates delivered by trusted CA.

## OAuth 2.0 Demonstration of Proof-of-Possession at the Application Layer (DPoP) (Draft 01)

Glewlwyd OIDC plugin supports OAuth 2.0 Demonstration of Proof-of-Possession at the Application Layer (DPoP) (Draft 01). The DPoP header can be used during a response_type `code` or `device_code`, also the endpoints `/userinfo` and `/token` will validate the DPoP header if the access token used has a `jkt` property. The endpoints `/register`, `/introspect` or `/revoke` won't validate the DPoP header by design.

### Allow DPoP

If this is set to true, the DPoP header will be parsed and validated when enabled.

### DPoP Token iat claim maximum duration (seconds)

Maximum duration authorized for a DPoP iat property.

## Resource Indicators (RFC 8707)

### Allow resource indicators

If this is set to true, clients will be allowed to use the resource parameter during `/auth` or `/token` requests. If this is set to false, the resource parameter will be ignored, and the `aud` claim will be set to the scope list. If there's no resource parameter, the `aud` claim will be set to the scope list as well.

### Allow to change resource indicator on access token refresh

If this is set to true, client will be allowed to change the resource parameter while refreshing an access token.

### Resource list by scope

For all scopes, you can specify a list of allowed resources available.

When the client is claiming multiple scopes, the given resource parameter must match at least one of the resource of one of the scopes.

### Client resource list property

The client property that will store the resources allowed for this client

### And/Or

Configure if the claimed resource must be available in one of the clained scopes **and/or** in the client resource list available.

## OAuth 2.0 Rich Authorization Requests (Draft 03)

This settings will allow your Glewlwyd instance to provide `authorization_details` objects in the access tokens or the introspection endpoint, based on the `authorization_details` request specified by the client.

### Allow OAuth 2.0 Rich Authorization Requests

If this is set to true, client will be allowed to use rich authorization requests.

### Allow unsigned OAuth 2.0 Rich Authorization Requests

If this is set to true, clients will be allowed to add a `authorization_details` in the url in JSON format. This setting is disabled by default because then the `authorization_details` value an be changed by the user or a third party, and lead to data leaks or broken process. If you want to enable this feature, you must be aware of the risks.

### Allow unencrypted OAuth 2.0 Rich Authorization Requests

If this is set to true, clients will be allowed to add a `authorization_details` in authorization request objects without encryption, signed requests are mandatory though.

### Client authorization_data_types property

The client property that will store the authorization requests types allowed for this client

### New type

Enter the name of a new type

### Allowed scopes

List of scopes allwed to be used with that type. If one of the allowed scopes is included in the request, the `authorization_details` request will be allowed.

### Description

Description for the authorization request. Will be displayed to the user when consent is asked.

### Allowed locations (optional, one per line)

`locations` values allowed for this authorization request. If a client requests a location not present in this list, the request is invalid.

### Allowed actions (optional, one per line)

`actions` values allowed for this authorization request. If a client requests an action not present in this list, the request is invalid.

### Allowed datatypes (optional, one per line)

`datatypes` values allowed for this authorization request. If a client requests a datatype not present in this list, the request is invalid.

### Enriched authorization details - user properties (optional, one per line)

List of user properties available for enriched authorization details. If a client requests a property not present in this list, the request is invalid.

The client must set the enriched properties in a `access` object in the `authorization_details` request. The properties requested are the keys of the object, the values for each keys are ignored.

Example of an `authorization_details` request with `access` object:

```JSON
[
   {
      "type": "account_information",
      "access": {
         "accounts": [],
         "balances": [],
         "transactions": []
      }
   }
]
```

## OAuth 2.0 Pushed Authorization Requests (Draft 05)

This settings is used to configure pushed authorization requests to enforce client privacy and security.

### Allow Pushed Authorization Requests

If this is set to true, clients will be allowed to use pushed authorization requests via the endpoint `POST /par` to initiate the authentication.

### Require Pushed Authorization Request

If this is set to true, pushed authorization requests will be mandatory, no client will be able to initiate an authorization request directly via `GET /auth`.

### request_uri prefix

Value of the prefix that will be added to every request_uri.

### request_uri duration (seconds)

Duration of a request_uri before user first accesses to the `/auth` using this `request_uri`.

## Client-Initiated Backchannel Authentication Flow

This settings is used to configure Client-Initiated Backchannel Authentication Flow (CIBA).

### Allow Client-Initiated Backchannel Authentication Flow (CIBA)

If this is set to true, clients will be allowed to initiate CIBA requests via the endpoint `POST /ciba`.

### Ping mode allowed

If this is set to true, clients will be allowed to use ping mode on CIBA requests.

### Poll mode allowed

If this is set to true, clients will be allowed to use poll mode on CIBA requests.

### Push mode allowed

If this is set to true, clients will be allowed to use push mode on CIBA requests.

### Allow uot requests ping and push to a insecure https://

If this is set to true, if a `backchannel_client_notification_endpoint` points to an invalid server certificate, the request will continue.

### user_code parameter allowed

If this is set to true, the client can use the `user_code` to verify the user identity.

### user_code property

User property to use to match the `user_code`.

### Default expiration time (seconds)

Default expiration time for a CIBA request when the client doesn't specify one.

### Maximum duration expiration time (seconds)

Maximum duration of a CIBA request if the client specify one.

### Send an e-mail to the targeted user

If this is set to true, an e-mail will be sent to the user when a CIBA request is created for this user.

### SMTP Server

Address of the SMTP server that will relay the messages to the users, mandatory.

### Port SMTP (0: System default)

TCP port the SMTP server is listening to. Must be between 0 and 65535. If 0 is set, Glewlwyd will use the system default port for SMTP, usually 25 or 587, mandatory.

### Use a TLS connection

Check this option if the SMTP server requires TLS to connect.

### Check server certificate

Check this option if you want Glewlwyd to check the SMTP server certificate before relaying the e-mail. This is highly recommended if TLS connection is checked, useless otherwise.

### SMTP username (if required)

username used to authenticate to the SMTP server if required by the SMTP server, optional.

### SMTP password (if required)

password used to authenticate to the SMTP server if required by the SMTP server, optional.

### E-mail sender address

Address used as sender in the e-mails, required.

### Content-Type

Content-Type for the e-mails, default is plain text but you can set an HTML body if youo need to.

### User lang property

User property which will contain the default lang value used for the e-mail templates. The lang value must be an exact match of the lang template. If the user lang doens't exist in the templates or if the user has no lang property, the e-mail template will use the default language.

### Lang

Dropdown value to select, add or remove lang templates for the e-mails.

### Default lang

Checkbox to specify what lang is the default language. In case the user has no language value or its language value doesn't exist in the templates.

### E-mail subject

Subject used on the e-mails for the current lang, required.

### E-mail body template, {CONNECT_URL} required, {CANCEL_URL}, {CLIENT} and {BINDING_MESSAGE} optional

The pattern for the body on the e-mails for the current lang, You must use at least once the pattern `{CONNECT_URL}` in the template to be replaced by the connection url. The patterns `{CLIENT}`, `{CANCEL_URL}` and `{BINDING_MESSAGE}` are optional.

Example, by using the following e-mail pattern:

```
Your authorization is required by the client {CLIENT}.

Message from the client: {BINDING_MESSAGE}.

Click on the following link to accept: {CONNECT_URL}.

Click on the following link to cancel: {CANCEL_URL}
```

## Financial-grade API additional options (FAPI)

### Select all below

If this is set to true, all FAPI related options will be set to true and all encryption algorithms will be allowed, except for `dir` and `RSA1_5`.

### Allow JWT responses in /auth (JARM)

If this is set to true, JWT response mode will be allowed.

### Add s_hash in id_token

If this is set to true, the state hash will be added in the id_token payload as `s_hash`.

### Verify nbf property

If this is set to true, the `nbf` parameter will be mandatory in jwt requests and `exp-nbf` must not succeed 60 minutes.

### Allow restricted algs for encryption

If this is set to true, glewlwyd may restrict some algorithms for encryption.

### Allowed algs

Dropdown menu to select allowed encryption algorithms. By design, algorithms `dir` and `RSA1_5` are forbidden in FAPI mode.

### Allow clients with multiple similar kid

If this is set to true, clients with the same kid in its public key set is allowed.

### CIBA allowed clients must be confidential

If this is set to true, clients must be confidential to use CIBA endpoint.

### Push mode forbidden

If this is set to true, clients must use CIBA with poll or ping mode.

## Native Apps Guidelines

Glewlwyd is conform to [OAuth 2.0 for Native Apps](https://tools.ietf.org/html/rfc8252) best current practice considering the following configuration:

- Any `redirect_uri` is allowed if the client is manually added by an admin in the admin app
- Any `https://` URL is allowed or unsecured loopback URL (locahost/127.0.0.1/[::1]) when the client uses the client registration endpoint. `redirect_uris` accepted in the client registration endpoint **MUST NOT** contain username attribute (`https://username@domain.tld`)
- [PKCE](https://tools.ietf.org/html/rfc7636) extension is supported
- A client can be specified as public (i.e. not confidential), without secret or public key

## Glewlwyd OpenID Connect endpoints specifications

This document is intended to describe Glewlwyd OpenID Connect plugin implementation.

OpenID Connect endpoints are used to authenticate the user, and to send tokens, id_tokens or other authentication and identification data. The complete specification is available in the [OpenID Connect Core](http://openid.net/specs/openid-connect-core-1_0.html). If you see an issue or have a question on Glewlwyd OpenID Connect plugin implementation, you can open an issue or send an email to the following address [mail@babelouest.org](mailto:mail@babelouest.org).

- [Endpoints authentication](#endpoints-authentication)
- [Prefix](#prefix)
- [Login and grant URIs](#login-and-grant-uris)
- [Scope](#scope)
- [OpenID Connect endpoints](#openid-connect-endpoints)
  - [Authorization endpoint](#authorization-endpoint)
  - [Token endpoint](#token-endpoint)
- [OpenID Connect schemes](#openid-connect-schemes)
  - [Authorization code grant - Authorization request](#authorization-code-grant---authorization-request)
  - [Authorization code grant - Authorization Response](#authorization-code-grant---authorization-response)
  - [Implicit Grant](#implicit-grant)
  - [ID Token Grant](#id-token-grant)
  - [Resource Owner Password Credentials Grant](#resource-owner-password-credentials-grant)
  - [Client Credentials Grant](#client-credentials-grant)
  - [Refresh token](#refresh-token)
  - [Invalidate refresh token](#invalidate-refresh-token)
- [Userinfo endpoint](#userinfo-endpoint)
- [openid-configuration endpoint](#openid-configuration-endpoint)
- [Get JSON Web Key](#get-json-web-key)
- [Manage refresh tokens endpoints](#manage-refresh-tokens-endpoints)
  - [List refresh tokens](#list-refresh-tokens)
  - [Disable a refresh token by its signature](#disable-a-refresh-token-by-its-signature)
- [Token introspection and revocation](#token-introspection-and-revocation)
  - [Token introspection](#token-introspection)
  - [Token revocation](#token-revocation)
- [Client registration](#client-registration)
- [Session Management](#session-management)

### Endpoints authentication

Authentication has different faces, and differs with the authorization scheme.

### Prefix

All URIs are based on the prefix you will setup. In this document, all API endpoints will assume they use the prefix `/api/oidc`, and all static file endpoints will assume they use the prefix `/`.

### Login and grant URIs

In this document, the login URI will be displayed as `http://login.html`, this will be replaced by the values from your environment that you can define in the config file.

### OpenID Connect endpoints

#### Authorization endpoint

This is a multi-method, multi-parameters, versatile endpoint, used to provide authentication management. It handles the following authorization schemes as describe in the [OpenID Connect Core](http://openid.net/specs/openid-connect-core-1_0.html):

- Authorization Code Grant (Authorization part)
- Implicit Grant
- Hybrid Grant

##### URL

`/api/oidc/auth`

##### Method

`GET`
`POST`

#### Token endpoint

This endpoint is used to provide tokens to the user. It handles the following authorization schemes as describe in the [OpenID Connect Core](http://openid.net/specs/openid-connect-core-1_0.html):

- Authorization Code Grant (Access Token part)
- ID Token Grant
- Resource Owner Password Credentials Grant (if enabled)
- Client Credentials Grant (if enabled)
- Refreshing a token
- Deleting a token

##### URL

`/api/oidc/token`

##### Method

`POST`

### OAuth 2 schemes

Each scheme is described in the following chapter. The description may not be as complete as the [OAuth 2 RFC document](https://tools.ietf.org/html/rfc6749), consider the RFC as the authority standard.

#### Authorization code grant - Authorization request

##### URL

`/api/oidc/auth`

##### Method

`GET`
`POST`

##### URL (GET) or body (POST) Parameters

Required

```
`response_type`: text, must be set to `code`
`client_id`: text, client_id that sends the request on behalf of the resource owner, must be a valid client_id
`redirect_uri`: text, redirect_uri to send the resource owner to after the connection, must be a valid redirect_uri for the specified client_id
`scope`: text, scope list that the resource owner will grant access to the client, multiple scope values must be separated by a space, scope `openid` is mandatory in an OpenID Connect request
`nonce`: text, recommended for response type code, mandatory for all other response types
```

Optional

`state`: text, an identifier used to prevent requests collisions and bypass, will be sent back as is to the client

##### Result

###### Resource owner not authenticated

Code 302

Resource owner is not authenticated with a valid session.

Redirect to `http://login.html?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&additional_parameters` for authentication.

See login paragraph for details.

###### Scope not granted to the client

Code 302

Redirect to `http://login.html?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&additional_parameters` for grant access.

###### Success response

Code 302

Redirect to `redirect_uri`?code=`code`&state=`state`

with `redirect_uri` specified in the request, a `code` generated for the access, and the state specified in the request if any.

###### Error Scope

Scope is not allowed for this user

Code 302

Redirect to `redirect_uri`?error=invalid_scope&state=`state`

with `redirect_uri` specified in the request, `invalid_scope` as error value, and the state specified in the request if any.

###### Error client

Client is invalid, redirect_uri is invalid for this client, or client is not allowed to use this scheme

Code 302

Redirect to `redirect_uri`?error=unauthorized_client&state=`state`

with `redirect_uri` specified in the request, `unauthorized_client` as error value, and the state specified in the request if any.

#### Authorization code grant - Authorization Response

##### URL

`/api/oidc/token`

##### Method

`POST`

##### Security

If `client_id` refers to a confidential client, then client_id and client_password must be sent via Basic HTTP Auth.

##### Data Parameters

Request body parameters must be encoded using the `application/x-www-form-urlencoded` format.

```
grant_type: text, must be set to "authorization_code".
code: text, required
redirect_uri: text, must be same redirect_uri used in the authorization request that sent back this code
client_id: text, must be the same client_id used in the authorization request that sent back this code
```

##### Success response

Code 200

Content

```javascript
{
  "access_token": text, jwt token
  "token_type": text, value is "bearer",
  "expires_in": number, set by server configuration
  "refresh_token": text,
  "id_token": text, jwt token
}
```

##### Error Response

Code 400

Error input parameters

The combination code/redirect_uri/client_id is incorrect.

#### Implicit Grant

##### URL

`/api/oidc/auth`

##### Method

`GET`

##### URL Parameters

Required

```
`response_type`: text, must be set to `token`
`client_id`: text, client_id that sends the request on behalf of the resource owner, must be a valid client_id
`redirect_uri`: text, redirect_uri to send the resource owner to after the connection, must be a valid redirect_uri for the specified client_id
`scope`: text, scope list that the resource owner will grant access to the client, multiple scope values must be separated by a space
```

Optional

`state`: text, an identifier used to prevent requests collisions and bypass, will be sent back as is to the client

##### Result

###### Resource owner not authenticated

Code 302

Resource owner is not authenticated with a valid session.

Redirect to `http://login.html?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&additional_parameters` for authentication.

See login paragraph for details.

###### Scope not granted to the client

Code 302

Redirect to `http://grant.html?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&additional_parameters` for grant access.

See grant paragraph for details.

###### Success response

Code 302

Redirect to `redirect_uri`#token=`token`&state=`state`

with `redirect_uri` specified in the request, a `code` generated for the access, and the state specified in the request if any.

###### Error Scope

Scope is not allowed for this user

Code 302

Redirect to `redirect_uri`#error=invalid_scope&state=`state`

with `redirect_uri` specified in the request, `invalid_scope` as error value, and the state specified in the request if any.

###### Error client

Client is invalid, redirect_uri is invalid for this client, or client is not allowed to use this scheme

Code 302

Redirect to `redirect_uri`#error=unauthorized_client&state=`state`

with `redirect_uri` specified in the request, `unauthorized_client` as error value, and the state specified in the request if any.

#### ID Token Grant

##### URL

`/api/oidc/auth`

##### Method

`GET`

##### URL Parameters

Required

```
`response_type`: text, must be set to `id_token`
`client_id`: text, client_id that sends the request on behalf of the resource owner, must be a valid client_id
`redirect_uri`: text, redirect_uri to send the resource owner to after the connection, must be a valid redirect_uri for the specified client_id
`scope`: text, scope list that the resource owner will grant access to the client, multiple scope values must be separated by a space
`nonce`: text, nonce value generated by the client, mandatory
```

Optional

`state`: text, an identifier used to prevent requests collisions and bypass, will be sent back as is to the client

##### Result

###### Resource owner not authenticated

Code 302

Resource owner is not authenticated with a valid session.

Redirect to `http://login.html?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&additional_parameters` for authentication.

See login paragraph for details.

###### Scope not granted to the client

Code 302

Redirect to `http://login.html?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&additional_parameters` for grant access.

See grant paragraph for details.

###### Success response

Code 302

Redirect to `redirect_uri`#id_token=`token`&state=`state`

with `redirect_uri` specified in the request, a `code` generated for the access, and the state specified in the request if any.

###### Error Scope

Scope is not allowed for this user

Code 302

Redirect to `redirect_uri`#error=invalid_scope&state=`state`

with `redirect_uri` specified in the request, `invalid_scope` as error value, and the state specified in the request if any.

###### Error client

Client is invalid, redirect_uri is invalid for this client, or client is not allowed to use this scheme

Code 302

Redirect to `redirect_uri`#error=unauthorized_client&state=`state`

with `redirect_uri` specified in the request, `unauthorized_client` as error value, and the state specified in the request if any.

#### Resource Owner Password Credentials Grant

##### URL

`/api/oidc/token`

##### Method

`POST`

##### Data Parameters

Request body parameters must be encoded using the `application/x-www-form-urlencoded` format.

```
grant_type: text, must be set to "password".
username: text
password: text
scope: text
```

##### Success response

Code 200

Content

```javascript
{
  "access_token": text, jwt token
  "token_type": text, value is "bearer",
  "expires_in": number, set by server configuration
  "refresh_token": text, jwt token
}
```

##### Error Response

Code 403

username or password invalid.

#### Client Credentials Grant

##### URL

`/api/oidc/token`

##### Method

`POST`

##### Security

HTTP Basic authentication with client_id/client_password credentials. Client_id must be set as confidential

##### URL Parameters

Required

Optional

##### Data Parameters

Request body parameters must be encoded using the `application/x-www-form-urlencoded` format.

```
grant_type: text, must be set to "client_credentials".
scope: text
```

##### Success response

Code 200

Content

```javascript
{
  "access_token": text, jwt token
  "token_type": text, value is "bearer",
  "expires_in": number, set by server configuration
}
```

##### Error Response

Code 403

Access denied

#### Refresh token

Send a new access_token based on a valid refresh_token

##### URL

`/api/oidc/token`

##### Method

`POST`

##### Data Parameters

Request body parameters must be encoded using the `application/x-www-form-urlencoded` format.

```
grant_type: text, must be set to "refresh_token".
refresh_token: text, a valid ref refresh_token, mandatory
scope: text, must the same scope or a sub scope of the scope used to provide the refresh_token, optional
```

##### Success response

Code 200

Content

```javascript
{
  "access_token": text, jwt token
  "token_type": text, value is "bearer",
  "expires_in": number, set by server configuration
}
```

##### Error Response

Code 400

Error input parameters

#### Invalidate refresh token

Mark a refresh_token as invalid, to prevent further access_token to be generated

##### URL

`/api/oidc/token`

##### Method

`POST`

##### Data Parameters

Request body parameters must be encoded using the `application/x-www-form-urlencoded` format.

```
grant_type: text, must be set to "delete_token".
refresh_token: text, a valid refresh_token, mandatory
```

##### Success response

Code 200

##### Error Response

Code 400

Error input parameters

### Userinfo endpoint

This endpoint is defined in the OpenID Connect core: [Userinfo Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo). It's used to get information about a user in JSON format. Default information are displayed, and additional claims can be requested.

#### URL

`/api/oidc/userinfo`

#### Method

`GET`, `POST`

#### Security

A valid access token is required to access this endpoint. The user shown in this endpoint result will be the one the access token was created for.

#### URL or POST body Parameters

Optional

```
claims: text, list of additional claims separated by space
format=jwt: send the result in JSON Web Token (JWT) format
```

#### Header parameters

By default, the response format is `Application/JSON`, but the client can request a JWT response. The JWT will be signed with the server's private key, and can be encrypted using the client's secret or public key.

```
Accept: application/jwt - send the result in JSON Web Token (JWT) format
```

##### Result

##### Success response

Code 200

**JSON Format**

Content

```javascript
{
  "sub": text, subject of the endpoint (user)
  "name": text, name of the user
  "email": text, email of the user
}
```

**JWT Format**

Content

```javascript
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

##### Error Response

Code 403

Access denied

### openid-configuration endpoint

This endpoint implements the [OpenID Connect discovery](http://openid.net/specs/openid-connect-discovery-1_0.html) API.

#### URL

`/api/oidc/.well-known/openid-configuration`

#### Method

`GET`

##### Result

##### Success response

Code 200

Content

`openid-configuration` content in JSON format.

Example:

```javascript
{
   "issuer":"https://glewlwyd.tld",
   "authorization_endpoint":"http://localhost:4593/api/oidc/auth",
   "token_endpoint":"http://localhost:4593/api/oidc/token",
   "userinfo_endpoint":"http://localhost:4593/api/oidc/userinfo",
   "jwks_uri":"http://localhost:4593/api/oidc/jwks",
   "token_endpoint_auth_methods_supported":[
      "client_secret_basic"
   ],
   "token_endpoint_auth_signing_alg_values_supported":[
      "HS256"
   ],
   "scopes_supported":[
      "openid"
   ],
   "response_types_supported":[
      "code",
      "id_token",
      "token id_token",
      "code id_token",
      "code token id_token",
      "none",
      "password",
      "token",
      "client_credentials",
      "refresh_token"
   ],
   "response_modes_supported":[
      "query",
      "fragment"
   ],
   "grant_types_supported":[
      "authorization_code",
      "implicit"
   ],
   "display_values_supported":[
      "page",
      "touch",
      "wap"
   ],
   "claim_types_supported":[
      "normal"
   ],
   "claims_supported":[

   ],
   "ui_locales_supported":[
      "en",
      "fr"
   ],
   "claims_parameter_supported":true,
   "request_parameter_supported":true,
   "request_uri_parameter_supported":true,
   "require_request_uri_registration":false
}
```

#### Get JSON Web Key

##### URL

`/api/oidc/jwks`

##### Method

`GET`

##### Result

##### Success response

Code 200

Content

`jwks` content in JSON format.

Example:

```javascript
{
   "keys":[
      {
         "use":"sig",
         "alg":"RS256",
         "x5c":[
            "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwtpMAM4l1H995oqlqdMh\nuqNuffp4+4aUCwuFE9B5s9MJr63gyf8jW0oDr7Mb1Xb8y9iGkWfhouZqNJbMFry+\niBs+z2TtJF06vbHQZzajDsdux3XVfXv9v6dDIImyU24MsGNkpNt0GISaaiqv51NM\nZQX0miOXXWdkQvWTZFXhmsFCmJLE67oQFSar4hzfAaCulaMD+b3Mcsjlh0yvSq7g\n6swiIasEU3qNLKaJAZEzfywroVYr3BwM1IiVbQeKgIkyPS/85M4Y6Ss/T+OWi1Oe\nK49NdYBvFP+hNVEoeZzJz5K/nd6C35IX0t2bN5CVXchUFmaUMYk2iPdhXdsC720t\nBwIDAQAB\n-----END PUBLIC KEY-----"
         ],
         "kid":"h7uJEqXw_h4UXW_wCm3oBuboSGyuxf7XucGDKohPwxo",
         "kty":"RSA",
         "e":"AQAB",
         "n":"AMLaTADOJdR_feaKpanTIbqjbn36ePuGlAsLhRPQebPTCa-t4Mn_I1tKA6-zG9V2_MvYhpFn4aLmajSWzBa8vogbPs9k7SRdOr2x0Gc2ow7Hbsd11X17_b-nQyCJslNuDLBjZKTbdBiEmmoqr-dTTGUF9Jojl11nZEL1k2RV4ZrBQpiSxOu6EBUmq-Ic3wGgrpWjA_m9zHLI5YdMr0qu4OrMIiGrBFN6jSymiQGRM38sK6FWK9wcDNSIlW0HioCJMj0v_OTOGOkrP0_jlotTniuPTXWAbxT_oTVRKHmcyc-Sv53egt-SF9LdmzeQlV3IVBZmlDGJNoj3YV3bAu9tLQc"
      }
   ]
}
```

##### Error Response

Code 403

JWK unavailable (if denied by parameter or if the algorithm isn't based on public/private key.

### Manage refresh tokens endpoints

The following endpoints require a valid session cookie to identify the user. If the user has the scope `g_admin`, it's possible to impersonate a user with the optional query parameter `?username={username}`.

#### List refresh tokens

##### URL

`/api/oidc/token`

##### Method

`GET`

##### URL Parameters

Optional

```
`offset`: number, the offset to start the list, default 0
`limit`: number, the number of elements to return, default 100
`pattern`: text, a pattern to filter results, pattern will filter the properties `user_agent` or `issued_for`
`sort`: text, the column to order the results, values available are `authorization_type`, `client_id`, `issued_at`, `last_seen`, `expires_at`, `issued_for`, `user_agent`, `enabled` and `rolling_expiration`
`desc`: no value, is set, the column specified in the `sort` parameter will be ordered by descending order, otherwise ascending
```

##### Result

##### Success response

Code 200

Content

```javascript
[{
  "token_hash": text, refresh token hash signature
  "authorization_type": text, authorization type used to generate this refresh token, value can be "code" or "password"
  "client_id": text, client_id this refresh token was sent to
  "issued_at": number, date when this refresh token was issued, epoch time format
  "expires_at": number, date when this refresh token will expire, epoch time format
  "last_seen": number, last date when this refresh token was used to generate an access token, epoch time format
  "rolling_expiration": boolean, weather this refresh token is a rolling token, i.e. its expiration date will be postponed on each use to generate a new access token
  "issued_for": text, IP address of the device which requested this refresh token
  "user_agent": text, user-agent of the device which requested this refresh token
  "enabled": boolean, set to true if this refresh token is enabled, i.e. can be used to generate new access tokens, or not
}]
```

##### Error Response

Code 403

Access denied

#### Disable a refresh token by its signature

##### URL

`/api/oidc/token/{token_hash}`

##### Method

`DELETE`

##### URL Parameters

Required

```
`token_hash`: text, hash value of the refresh token to disable, must be url-encoded
```

##### Result

##### Success response

Code 200

##### Error Response

Code 403

Access denied

Code 404

Refresh token hash not found for this user

### Token introspection and revocation

The endpoints `POST` `/introspect` and `POST` `/revoke` are implementations of the corresponding RFCs [Token introspection and revocation](https://tools.ietf.org/html/rfc7662) and [OAuth 2.0 Token Revocation](https://tools.ietf.org/html/rfc7009).

Both of them rely on 2 distinct ways to authenticate:
- HTTP Basic Auth corresponding to the client credentials whose client the token was submitted
- Authorized Access Token that includes the required scopes for those endpoints

Both authentication methods are non exclusive and the administrator may enable or disable each of them.

#### Token introspection

##### URL

`/api/oidc/introspect`

##### Method

`POST`

##### Data Parameters

Request body parameters must be encoded using the `application/x-www-form-urlencoded` format.

```
token: text, the token to introspect, required
token_type_hint: text, optional, values available are 'access_token', 'refresh_token' or 'id_token'
```

#### Header parameters

By default, the response format is `Application/JSON`, but the client can request a JWT response, either using the default JSON format as the JWT claim, or using the [JWT Response for OAuth Token Introspection Draft 10](https://tools.ietf.org/html/draft-ietf-oauth-jwt-introspection-response-10) format. The JWT will be signed with the server's private key, and can be encrypted using the client's secret or public key.

```
Accept: application/jwt - send the result in JSON Web Token (JWT) format
Accept: Accept: application/token-introspection+jwt - send the result in JWT Response for OAuth Token Introspection format
```

##### Result

##### Success response

Code 200

Content

Active token
```javascript
{
  "sub": text, identifier for the user associated to the token, if any
  "aud": text, identifier for the client associated to the token, if any
  "username": text, username the token was issued for, if any
  "client_id": text, client the token was issued for, if any
  "iat": number, epoch time when the token was issued
  "nbf": number, epoch time when the token was issued
  "exp": number, epoch time when the token will be (or is supposed to be) expired
  "scope": text, scope list this token was emitted with, separated with spaces
  "token_type": text, type of the token, values may be 'access_token', 'refresh_token' or 'id_token'
}
```

##### Error Response

Code 401

Access denied

Code 400

Invalid parameters

#### Token revocation

##### URL

`/api/oidc/revoke`

##### Method

`POST`

##### Data Parameters

Request body parameters must be encoded using the `application/x-www-form-urlencoded` format.

```
token: text, the token to introspect, required
token_type_hint: text, optional, values available are 'access_token', 'refresh_token' or 'id_token'
```

##### Result

##### Success response

Code 200

##### Error Response

Code 401

Access denied

Code 400

Invalid parameters

### Client registration

##### URL

`/api/oidc/register`

##### Method

`POST`

##### Data Parameters

Input data must be a JSON object.

```javascript
{
  "client_name": text, name of the new client
  "redirect_uris": array of strings, each string must be a 'https://' or http://localhot' url, at least one value is mandatory
  "response_types": array of strings, values available are 'code', 'token', 'id_token', 'password', 'client_credentials', 'refresh_token' or 'delete_token', if empty the client will have the response types 'code' and 'refresh_token'
  "application_type": text, values available are 'web' or 'native'
  "contacts": array of strings
  "client_confidential": boolean, if false then no client_secret will be provided
  "logo_uri": string, url using the format 'https://' or 'http://'
  "client_uri": string, url using the format 'https://' or 'http://'
  "policy_uri": string, url using the format 'https://' or 'http://'
  "tos_uri": string, url using the format 'https://' or 'http://'
  "jwks_uri": string, url using the format 'https://'
  "jwks": JWKS object
}
```

Parameters `jwks_uri` and `jwks` can't coexist at the same time.

##### Result

##### Success response

Code 200

Content

This is a non normative sample response.

```javascript
{
  "client_name": "New Client",
  "client_id": "i4bmq8izuc8c65p8", 
  "client_secret": "EpurvxmR712c1WPfMUtiXWxsA6ReFw9B", 
  "client_id_issued_at": 1583695374, 
  "client_secret_expires_at": 0,
  "redirect_uris": ["https://client.tld/callback"], 
  "response_types": ["code", "token", "id_token", "password", "client_credentials", "refresh_token", "delete_token"], 
  "application_type": "web", 
  "contacts": ["contact@client.tld"], 
  "logo_uri": "https://client.tld/logo.png", 
  "client_uri": "https://client.tld/", 
  "policy_uri": "https://client.tld/policy", 
  "tos_uri": "https://client.tld/tos", 
  "jwks": {"keys": [{"kty": "EC", "crv": "P-256", "x": "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4", "y": "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM", "use": "enc", "kid": "1"}]}
}
```

##### Error Response

Code 401

Access denied

Code 400

Invalid parameters

### Session Management

#### Check Session iframe

This is the iframe content to be used by the client to verify if the user status has changed. Due to Glewlwyd's design, the iframe only checks if the user associated to the id_token is still connected to Glewlwyd and the active user via its session cookie. No other check is performed. Therefore, the advantage of `check_session_iframe` in Glewlwyd is limited.

##### URL

`/api/oidc/check_session_iframe`

##### Method

`GET`

##### Result

##### Success response

Code 200

Content

An HTML page adapted for check_session_iframe, this iframe is intended to indicate to the client web page that the user status has changed. Check [OIDC Session Status Change Notification](https://openid.net/specs/openid-connect-session-1_0.html#ChangeNotification) for more details and an example on how to use it.

### End session

##### URL

`/api/oidc/end_session`

##### Method

`GET`

##### Data Parameters

Optional

```
`post_logout_redirect_uri`: string, the uri to redirect the user after end registration is complete and successful. Must be previously registered by the client and will be used only if a valid `id_token_hint` is passed too.
`id_token_hint`: string, the last id_token sent to the client for the user, must be a valid `id_token`. The `id_token` will be invalidated by Glewlwyd on end session.
`state`: text, a client-defined string that will be sent back to the client via the `post_logout_redirect_uri`
```

##### Result

##### Success response

Code 302

Redirect the user to the login page with a end session prompt. If the user chooses to end the session, then the session will end and the user will be redirected to `post_logout_redirect_uri` if a valid one is given.

### CIBA endpoints

The following 2 endpoints are the 2 additional endpoints required for CIBA requests. The `/ciba` endpoint is not explained here as it is defined in its [Core document](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0.html).

#### Get CIBA requests for the connected user

##### URL

`/api/oidc/check_session_iframe`

##### Method

`GET`

##### Result

##### Success response

Code 200

Content

An HTML page adapted for check_session_iframe, this iframe is intended to indicate to the client web page that the user status has changed. Check [OIDC Session Status Change Notification](https://openid.net/specs/openid-connect-session-1_0.html#ChangeNotification) for more details and an example on how to use it.

### End session

##### URL

`/api/oidc/ciba_user_list`

##### Method

`GET`

#### Security

User identified with its cookie session.

##### Result

##### Success response

Code 200

Content

This is a non normative sample response.

```javascript
{
  "client_name": "New Client",
  "client_id": "i4bmq8izuc8c65p8", 
  "client_description": "Client description",
  "user_req_id": "abcd1234",
  "binding_message": "xyz9876",
  "scopes": ["openid", "scope1"]
}
```

#### Check CIBA request for the connected user

This endpoint behaves like the `/auth` endpoint. To validate the request, the session cookie used to authenticate must be for the user specified by the `login_hint`, with at least one of the specified scope granted and authorized.

##### URL

`/api/oidc/ciba_user_check`

##### Method

`GET`

##### URL Parameters

`user_req_id`: identifier of the request for the user, mandatory

##### Result

##### Success response

Code 302

If the user isn't fully authenticated yet, the endpoint redirects to `login.html` with the required scopes.

If the user has no scope required, the endpoint redirects to `login.html` with an error message.

If the is fully authenticated and at least one scope is granted to the client, the request is validated, and the endpoint redirects to `login.html` with a message "authentication complete".

If the user cancels the request, the endpoint redirects to `login.html` with a message "authentication cancelled".
