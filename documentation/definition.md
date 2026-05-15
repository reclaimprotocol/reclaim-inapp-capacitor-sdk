# Capacitor Plugin Definition

Api documentation for [Capacitor Plugin Definition](https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/src/definitions.ts)

## API

<docgen-index>

* [`startVerification(...)`](#startverification)
* [`startVerificationFromUrl(...)`](#startverificationfromurl)
* [`startVerificationFromJson(...)`](#startverificationfromjson)
* [`setOverrides(...)`](#setoverrides)
* [`clearAllOverrides()`](#clearalloverrides)
* [`setVerificationOptions(...)`](#setverificationoptions)
* [`setConsoleLogging(...)`](#setconsolelogging)
* [`reply(...)`](#reply)
* [`replyWithString(...)`](#replywithstring)
* [`startEventSubscription(...)`](#starteventsubscription)
* [`removeEventSubscription(...)`](#removeeventsubscription)
* [`ping()`](#ping)
* [`addListener('onLogs', ...)`](#addlisteneronlogs-)
* [`addListener('onSessionLogs', ...)`](#addlisteneronsessionlogs-)
* [`addListener('onSessionCreateRequest', ...)`](#addlisteneronsessioncreaterequest-)
* [`addListener('onSessionUpdateRequest', ...)`](#addlisteneronsessionupdaterequest-)
* [`addListener('onProviderInformationRequest', ...)`](#addlisteneronproviderinformationrequest-)
* [`addListener('onReclaimAttestorAuthRequest', ...)`](#addlisteneronreclaimattestorauthrequest-)
* [`addListener('onSessionIdentityUpdate', ...)`](#addlisteneronsessionidentityupdate-)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### startVerification(...)

```typescript
startVerification(request: Request) => Promise<Response>
```

| Param         | Type                                        |
| ------------- | ------------------------------------------- |
| **`request`** | <code><a href="#request">Request</a></code> |

**Returns:** <code>Promise&lt;<a href="#response">Response</a>&gt;</code>

--------------------


### startVerificationFromUrl(...)

```typescript
startVerificationFromUrl(requestUrl: { value: string; }) => Promise<Response>
```

| Param            | Type                            |
| ---------------- | ------------------------------- |
| **`requestUrl`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;<a href="#response">Response</a>&gt;</code>

--------------------


### startVerificationFromJson(...)

```typescript
startVerificationFromJson(args: { template: string; }) => Promise<Response>
```

| Param      | Type                               |
| ---------- | ---------------------------------- |
| **`args`** | <code>{ template: string; }</code> |

**Returns:** <code>Promise&lt;<a href="#response">Response</a>&gt;</code>

--------------------


### setOverrides(...)

```typescript
setOverrides(overrides: Overrides) => Promise<void>
```

| Param           | Type                                            |
| --------------- | ----------------------------------------------- |
| **`overrides`** | <code><a href="#overrides">Overrides</a></code> |

--------------------


### clearAllOverrides()

```typescript
clearAllOverrides() => Promise<void>
```

--------------------


### setVerificationOptions(...)

```typescript
setVerificationOptions(args: VerificationOptionsOptional) => Promise<void>
```

| Param      | Type                                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| **`args`** | <code><a href="#verificationoptionsoptional">VerificationOptionsOptional</a></code> |

--------------------


### setConsoleLogging(...)

```typescript
setConsoleLogging(args: SetConsoleLoggingOptions) => Promise<void>
```

| Param      | Type                                                                          |
| ---------- | ----------------------------------------------------------------------------- |
| **`args`** | <code><a href="#setconsoleloggingoptions">SetConsoleLoggingOptions</a></code> |

--------------------


### reply(...)

```typescript
reply(args: { replyId: string; reply: boolean; }) => void
```

| Param      | Type                                              |
| ---------- | ------------------------------------------------- |
| **`args`** | <code>{ replyId: string; reply: boolean; }</code> |

--------------------


### replyWithString(...)

```typescript
replyWithString(args: { replyId: string; value: string; }) => void
```

| Param      | Type                                             |
| ---------- | ------------------------------------------------ |
| **`args`** | <code>{ replyId: string; value: string; }</code> |

--------------------


### startEventSubscription(...)

```typescript
startEventSubscription(args: { event: string; }) => Promise<void>
```

| Param      | Type                            |
| ---------- | ------------------------------- |
| **`args`** | <code>{ event: string; }</code> |

--------------------


### removeEventSubscription(...)

```typescript
removeEventSubscription(args: { event: string; }) => Promise<void>
```

| Param      | Type                            |
| ---------- | ------------------------------- |
| **`args`** | <code>{ event: string; }</code> |

--------------------


### ping()

```typescript
ping() => Promise<{ value: boolean; }>
```

**Returns:** <code>Promise&lt;{ value: boolean; }&gt;</code>

--------------------


### addListener('onLogs', ...)

```typescript
addListener(eventName: 'onLogs', listener: (event: { value: string; }) => void) => Promise<PluginListenerHandle>
```

| Param           | Type                                                |
| --------------- | --------------------------------------------------- |
| **`eventName`** | <code>'onLogs'</code>                               |
| **`listener`**  | <code>(event: { value: string; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onSessionLogs', ...)

```typescript
addListener(eventName: 'onSessionLogs', listener: (event: SessionLogEvent) => void) => Promise<PluginListenerHandle>
```

| Param           | Type                                                                            |
| --------------- | ------------------------------------------------------------------------------- |
| **`eventName`** | <code>'onSessionLogs'</code>                                                    |
| **`listener`**  | <code>(event: <a href="#sessionlogevent">SessionLogEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onSessionCreateRequest', ...)

```typescript
addListener(eventName: 'onSessionCreateRequest', listener: (event: SessionCreateRequestEvent) => void) => Promise<PluginListenerHandle>
```

| Param           | Type                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------- |
| **`eventName`** | <code>'onSessionCreateRequest'</code>                                                               |
| **`listener`**  | <code>(event: <a href="#sessioncreaterequestevent">SessionCreateRequestEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onSessionUpdateRequest', ...)

```typescript
addListener(eventName: 'onSessionUpdateRequest', listener: (event: SessionUpdateRequestEvent) => void) => Promise<PluginListenerHandle>
```

| Param           | Type                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------- |
| **`eventName`** | <code>'onSessionUpdateRequest'</code>                                                               |
| **`listener`**  | <code>(event: <a href="#sessionupdaterequestevent">SessionUpdateRequestEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onProviderInformationRequest', ...)

```typescript
addListener(eventName: 'onProviderInformationRequest', listener: (event: ProviderInformationRequest) => void) => Promise<PluginListenerHandle>
```

| Param           | Type                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| **`eventName`** | <code>'onProviderInformationRequest'</code>                                                           |
| **`listener`**  | <code>(event: <a href="#providerinformationrequest">ProviderInformationRequest</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onReclaimAttestorAuthRequest', ...)

```typescript
addListener(eventName: 'onReclaimAttestorAuthRequest', listener: (event: ReclaimAttestorAuthRequest) => void) => Promise<PluginListenerHandle>
```

| Param           | Type                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| **`eventName`** | <code>'onReclaimAttestorAuthRequest'</code>                                                           |
| **`listener`**  | <code>(event: <a href="#reclaimattestorauthrequest">ReclaimAttestorAuthRequest</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onSessionIdentityUpdate', ...)

```typescript
addListener(eventName: 'onSessionIdentityUpdate', listener: (event: ReclaimSessionIdentityUpdate) => void) => Promise<PluginListenerHandle>
```

| Param           | Type                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| **`eventName`** | <code>'onSessionIdentityUpdate'</code>                                                                    |
| **`listener`**  | <code>(event: <a href="#reclaimsessionidentityupdate">ReclaimSessionIdentityUpdate</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### Interfaces


#### Response

Contains the proof and response data after verification

| Prop                              | Type                                   | Description                                                  |
| --------------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| **`sessionId`**                   | <code>string</code>                    | The session ID for the verification attempt                  |
| **`didSubmitManualVerification`** | <code>boolean</code>                   | Whether the proof was submitted manually                     |
| **`proofs`**                      | <code>{ [key: string]: any; }[]</code> | The list of proofs generated during the verification attempt |


#### Request

Represents a request for a verification attempt.

You can create a request using the [ReclaimVerification.Request] constructor or the [ReclaimVerification.<a href="#request">Request</a>.fromManifestMetaData] factory method.

| Prop                  | Type                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`appId`**           | <code>string</code>                                                       | The Reclaim application ID for the verification process. If not provided, the appId will be fetched from: - the `AndroidManifest.xml` metadata along with secret on android: ```xml &lt;meta-data android:name="org.reclaimprotocol.inapp_sdk.APP_ID" android:value="YOUR_RECLAIM_APP_ID" /&gt; ``` - the `ReclaimInAppSDKParam.ReclaimAppId` in Info.plist along with secret on iOS: ```xml &lt;key&gt;ReclaimInAppSDKParam&lt;/key&gt; &lt;dict&gt; &lt;key&gt;ReclaimAppId&lt;/key&gt; &lt;string&gt;YOUR_RECLAIM_APP_ID&lt;/string&gt; &lt;key&gt;ReclaimAppSecret&lt;/key&gt; &lt;string&gt;YOUR_RECLAIM_APP_SECRET&lt;/string&gt; &lt;/dict&gt; ```                |
| **`secret`**          | <code>string</code>                                                       | The Reclaim application secret for the verification process. If not provided, the secret will be fetched from: - the `AndroidManifest.xml` metadata along with appId on android: ```xml &lt;meta-data android:name="org.reclaimprotocol.inapp_sdk.APP_SECRET" android:value="YOUR_RECLAIM_APP_SECRET" /&gt; ``` - the `ReclaimInAppSDKParam.ReclaimAppSecret` in Info.plist along with appId on iOS: ```xml &lt;key&gt;ReclaimInAppSDKParam&lt;/key&gt; &lt;dict&gt; &lt;key&gt;ReclaimAppId&lt;/key&gt; &lt;string&gt;YOUR_RECLAIM_APP_ID&lt;/string&gt; &lt;key&gt;ReclaimAppSecret&lt;/key&gt; &lt;string&gt;YOUR_RECLAIM_APP_SECRET&lt;/string&gt; &lt;/dict&gt; ``` |
| **`providerId`**      | <code>string</code>                                                       | The identifier for the Reclaim data provider to use in verification                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **`session`**         | <code><a href="#sessioninformation">SessionInformation</a> \| null</code> | Optional session information. If nil, SDK generates new session details.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **`contextString`**   | <code>string</code>                                                       | Additional data to associate with the verification attempt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **`parameters`**      | <code>{ [key: string]: string; }</code>                                   | Key-value pairs for prefilling claim creation variables                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **`providerVersion`** | <code><a href="#providerversion">ProviderVersion</a> \| null</code>       | The version of the provider to use in verification                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |


#### SessionInformation

| Prop            | Type                | Description                                                                                                                                                                                                                                                                     |
| --------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`timestamp`** | <code>string</code> | The timestamp of the session creation. Represented as a string from number of milliseconds since the "Unix epoch" 1970-01-01T00:00:00Z (UTC). This value is independent of the time zone. This value is at most 8,640,000,000,000,000ms (100,000,000 days) from the Unix epoch. |
| **`sessionId`** | <code>string</code> | Unique identifier for the verification session                                                                                                                                                                                                                                  |
| **`signature`** | <code>string</code> | Cryptographic signature to validate the session                                                                                                                                                                                                                                 |


#### ProviderVersion

| Prop                    | Type                |
| ----------------------- | ------------------- |
| **`resolvedVersion`**   | <code>string</code> |
| **`versionExpression`** | <code>string</code> |


#### Overrides

| Prop                        | Type                                                                        |
| --------------------------- | --------------------------------------------------------------------------- |
| **`provider`**              | <code><a href="#providerinformation">ProviderInformation</a> \| null</code> |
| **`featureOptions`**        | <code><a href="#featureoptions">FeatureOptions</a> \| null</code>           |
| **`logConsumer`**           | <code><a href="#logconsumer">LogConsumer</a> \| null</code>                 |
| **`sessionManagement`**     | <code><a href="#sessionmanagement">SessionManagement</a> \| null</code>     |
| **`appInfo`**               | <code><a href="#reclaimappinfo">ReclaimAppInfo</a> \| null</code>           |
| **`capabilityAccessToken`** | <code>string \| null</code>                                                 |


#### ProviderInformation

| Prop                                      | Type                 |
| ----------------------------------------- | -------------------- |
| **`url`**                                 | <code>string</code>  |
| **`jsonString`**                          | <code>string</code>  |
| **`canFetchProviderInformationFromHost`** | <code>boolean</code> |


#### FeatureOptions

Interface representing Feature Options.

| Prop                                                | Type                         | Description                                                                                                       |
| --------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **`cookiePersist`**                                 | <code>boolean \| null</code> | Whether to persist a cookie. Optional, defaults to null.                                                          |
| **`singleReclaimRequest`**                          | <code>boolean \| null</code> | Whether to allow a single reclaim request. Optional, defaults to null.                                            |
| **`idleTimeThresholdForManualVerificationTrigger`** | <code>number \| null</code>  | Idle time threshold (in milliseconds?) for triggering manual verification. Optional, defaults to null.            |
| **`sessionTimeoutForManualVerificationTrigger`**    | <code>number \| null</code>  | Session timeout (in milliseconds?) for triggering manual verification. Optional, defaults to null.                |
| **`attestorBrowserRpcUrl`**                         | <code>string \| null</code>  | URL for the Attestor Browser RPC. Optional, defaults to null.                                                     |
| **`isAIFlowEnabled`**                               | <code>boolean \| null</code> | Whether AI flow is enabled. Optional, defaults to null.                                                           |
| **`manualReviewMessage`**                           | <code>string \| null</code>  | Message to display when the user submitting a verification session for manual review. Optional, defaults to null. |
| **`loginPromptMessage`**                            | <code>string \| null</code>  | Message to display when the user is logging in.                                                                   |
| **`useTEE`**                                        | <code>boolean \| null</code> | Whether to use TEE.                                                                                               |
| **`interceptorOptions`**                            | <code>string \| null</code>  | Interceptor options.                                                                                              |
| **`claimCreationTimeoutDurationInMins`**            | <code>number \| null</code>  |                                                                                                                   |
| **`sessionNoActivityTimeoutDurationInMins`**        | <code>number \| null</code>  |                                                                                                                   |
| **`aiProviderNoActivityTimeoutDurationInSecs`**     | <code>number \| null</code>  |                                                                                                                   |
| **`pageLoadedCompletedDebounceTimeoutMs`**          | <code>number \| null</code>  |                                                                                                                   |
| **`potentialLoginTimeoutS`**                        | <code>number \| null</code>  |                                                                                                                   |
| **`screenshotCaptureIntervalSeconds`**              | <code>number \| null</code>  |                                                                                                                   |
| **`teeUrls`**                                       | <code>string \| null</code>  | Hosted TEE services Url that participate in Reclaim's TEE+MPC protocol                                            |
| **`privacyPolicyUrl`**                              | <code>string \| null</code>  | Privacy policy url                                                                                                |
| **`termsOfServiceUrl`**                             | <code>string \| null</code>  | Terms of service url                                                                                              |
| **`potentialFailureReasonsUrl`**                    | <code>string \| null</code>  | Potential failure reasons url                                                                                     |


#### LogConsumer

| Prop                         | Type                 | Description                                                                            |
| ---------------------------- | -------------------- | -------------------------------------------------------------------------------------- |
| **`enableLogHandler`**       | <code>boolean</code> | Handler for consuming logs exported from the SDK. Defaults to false.                   |
| **`canSdkCollectTelemetry`** | <code>boolean</code> | When enabled, logs are sent to reclaim that can be used to help you. Defaults to true. |
| **`canSdkPrintLogs`**        | <code>boolean</code> | Defaults to enabled when not in release mode.                                          |


#### SessionManagement

| Prop                             | Type                 | Description                                                                                                                                                   |
| -------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`enableSdkSessionManagement`** | <code>boolean</code> | Whether to enable SDK session management. Optional, defaults to true. When false, a handler must be provided. We'll not let SDK manage sessions in this case. |


#### ReclaimAppInfo

Interface representing Reclaim App Information.

| Prop              | Type                        | Description                                                    |
| ----------------- | --------------------------- | -------------------------------------------------------------- |
| **`appName`**     | <code>string</code>         | The name of the application.                                   |
| **`appImageUrl`** | <code>string</code>         | The URL of the application's image.                            |
| **`isRecurring`** | <code>boolean</code>        | Whether the reclaim is recurring. Optional, defaults to false. |
| **`theme`**       | <code>string \| null</code> | The theme of the application. Optional, defaults to null.      |


#### VerificationOptionsOptional

| Prop          | Type                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| **`options`** | <code><a href="#verificationoptions">VerificationOptions</a> \| null</code> |


#### VerificationOptions

| Prop                                           | Type                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`canDeleteCookiesBeforeVerificationStarts`** | <code>boolean</code>                   |                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **`canUseAttestorAuthenticationRequest`**      | <code>boolean</code>                   |                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **`claimCreationType`**                        | <code>'standalone' \| 'meChain'</code> | The type of claim creation to use. Defaults to 'standalone'.                                                                                                                                                                                                                                                                                                                                                                                |
| **`canAutoSubmit`**                            | <code>boolean</code>                   | Whether to automatically submit the proof after generation. Defaults to true.                                                                                                                                                                                                                                                                                                                                                               |
| **`isCloseButtonVisible`**                     | <code>boolean</code>                   | Whether the close button is visible. Defaults to true.                                                                                                                                                                                                                                                                                                                                                                                      |
| **`locale`**                                   | <code>string \| null</code>            | A language code & Country code for localization that should be enforced in the verification flow.                                                                                                                                                                                                                                                                                                                                           |
| **`useTeeOperator`**                           | <code>boolean \| null</code>           | Enables use of Reclaim's TEE+MPC protocol for HTTP <a href="#request">Request</a> claim verification and attestation. When set to `true`, the verification will use Trusted Execution Environment (TEE) with Multi-Party Computation (MPC) for enhanced security. When set to `false`, the standard Reclaim's proxy attestor verification flow is used. When `null` (default), inappsdk decides whether to use TEE based on a feature flag. |


#### SetConsoleLoggingOptions

| Prop          | Type                 |
| ------------- | -------------------- |
| **`enabled`** | <code>boolean</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### SessionLogEvent

| Prop             | Type                | Description                                  |
| ---------------- | ------------------- | -------------------------------------------- |
| **`appId`**      | <code>string</code> | The app ID for the verification attempt      |
| **`providerId`** | <code>string</code> | The provider ID for the verification attempt |
| **`sessionId`**  | <code>string</code> | The session ID for the verification attempt  |
| **`logType`**    | <code>string</code> | The type of log event                        |


#### SessionCreateRequestEvent

| Prop                  | Type                | Description                                        |
| --------------------- | ------------------- | -------------------------------------------------- |
| **`appId`**           | <code>string</code> | The app ID for the verification attempt            |
| **`providerId`**      | <code>string</code> | The provider ID for the verification attempt       |
| **`timestamp`**       | <code>string</code> | The session timestamp for the verification attempt |
| **`signature`**       | <code>string</code> | The session signature for the verification attempt |
| **`providerVersion`** | <code>string</code> | The provider version for the verification attempt  |
| **`replyId`**         | <code>string</code> | internal                                           |


#### SessionUpdateRequestEvent

| Prop            | Type                | Description                                 |
| --------------- | ------------------- | ------------------------------------------- |
| **`sessionId`** | <code>string</code> | The session ID for the verification attempt |
| **`status`**    | <code>string</code> | The status type of this session event       |
| **`metadata`**  | <code>string</code> | session update metadata as JSON string      |
| **`replyId`**   | <code>string</code> | internal                                    |


#### ProviderInformationRequest

| Prop                  | Type                | Description |
| --------------------- | ------------------- | ----------- |
| **`appId`**           | <code>string</code> |             |
| **`providerId`**      | <code>string</code> |             |
| **`sessionId`**       | <code>string</code> |             |
| **`signature`**       | <code>string</code> |             |
| **`timestamp`**       | <code>string</code> |             |
| **`resolvedVersion`** | <code>string</code> |             |
| **`replyId`**         | <code>string</code> | internal    |


#### ReclaimAttestorAuthRequest

| Prop                                | Type                | Description |
| ----------------------------------- | ------------------- | ----------- |
| **`reclaimHttpProviderJsonString`** | <code>string</code> |             |
| **`replyId`**                       | <code>string</code> | internal    |


#### ReclaimSessionIdentityUpdate

| Prop             | Type                |
| ---------------- | ------------------- |
| **`appId`**      | <code>string</code> |
| **`providerId`** | <code>string</code> |
| **`sessionId`**  | <code>string</code> |

</docgen-api>
