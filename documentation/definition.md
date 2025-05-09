# Capacitor Plugin Definition

Api documentation for [Capacitor Plugin Definition](https://github.com/reclaimprotocol/reclaim-inapp-capacitor-sdk/blob/main/src/definitions.ts)

## API

<docgen-index>

* [`startVerification(...)`](#startverification)
* [`startVerificationFromUrl(...)`](#startverificationfromurl)
* [`setOverrides(...)`](#setoverrides)
* [`clearAllOverrides()`](#clearalloverrides)
* [`setVerificationOptions(...)`](#setverificationoptions)
* [`reply(...)`](#reply)
* [`replyWithString(...)`](#replywithstring)
* [`ping()`](#ping)
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


### ping()

```typescript
ping() => Promise<{ value: boolean; }>
```

**Returns:** <code>Promise&lt;{ value: boolean; }&gt;</code>

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

| Prop                    | Type                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`appId`**             | <code>string</code>                                                       | The Reclaim application ID for the verification process. If not provided, the appId will be fetched from: - the `AndroidManifest.xml` metadata along with secret on android: ```xml &lt;meta-data android:name="org.reclaimprotocol.inapp_sdk.APP_ID"             android:value="YOUR_RECLAIM_APP_ID" /&gt; ``` - the `ReclaimInAppSDKParam.ReclaimAppId` in Info.plist along with secret on iOS: ```xml &lt;key&gt;ReclaimInAppSDKParam&lt;/key&gt; &lt;dict&gt;     &lt;key&gt;ReclaimAppId&lt;/key&gt;     &lt;string&gt;YOUR_RECLAIM_APP_ID&lt;/string&gt;     &lt;key&gt;ReclaimAppSecret&lt;/key&gt;     &lt;string&gt;YOUR_RECLAIM_APP_SECRET&lt;/string&gt; &lt;/dict&gt; ```                |
| **`secret`**            | <code>string</code>                                                       | The Reclaim application secret for the verification process. If not provided, the secret will be fetched from: - the `AndroidManifest.xml` metadata along with appId on android: ```xml &lt;meta-data android:name="org.reclaimprotocol.inapp_sdk.APP_SECRET"             android:value="YOUR_RECLAIM_APP_SECRET" /&gt; ``` - the `ReclaimInAppSDKParam.ReclaimAppSecret` in Info.plist along with appId on iOS: ```xml &lt;key&gt;ReclaimInAppSDKParam&lt;/key&gt; &lt;dict&gt;     &lt;key&gt;ReclaimAppId&lt;/key&gt;     &lt;string&gt;YOUR_RECLAIM_APP_ID&lt;/string&gt;     &lt;key&gt;ReclaimAppSecret&lt;/key&gt;     &lt;string&gt;YOUR_RECLAIM_APP_SECRET&lt;/string&gt; &lt;/dict&gt; ``` |
| **`providerId`**        | <code>string</code>                                                       | The identifier for the Reclaim data provider to use in verification                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **`session`**           | <code><a href="#sessioninformation">SessionInformation</a> \| null</code> | Optional session information. If nil, SDK generates new session details.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **`contextString`**     | <code>string</code>                                                       | Additional data to associate with the verification attempt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **`parameters`**        | <code>{ [key: string]: string; }</code>                                   | Key-value pairs for prefilling claim creation variables                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **`acceptAiProviders`** | <code>boolean</code>                                                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **`webhookUrl`**        | <code>string \| null</code>                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |


#### SessionInformation

| Prop            | Type                | Description                                                                                                                                                                                                                                                                     |
| --------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`timestamp`** | <code>string</code> | The timestamp of the session creation. Represented as a string from number of milliseconds since the "Unix epoch" 1970-01-01T00:00:00Z (UTC). This value is independent of the time zone. This value is at most 8,640,000,000,000,000ms (100,000,000 days) from the Unix epoch. |
| **`sessionId`** | <code>string</code> | Unique identifier for the verification session                                                                                                                                                                                                                                  |
| **`signature`** | <code>string</code> | Cryptographic signature to validate the session                                                                                                                                                                                                                                 |


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

| Prop                                                | Type                         | Description                                                                                            |
| --------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| **`cookiePersist`**                                 | <code>boolean \| null</code> | Whether to persist a cookie. Optional, defaults to null.                                               |
| **`singleReclaimRequest`**                          | <code>boolean \| null</code> | Whether to allow a single reclaim request. Optional, defaults to null.                                 |
| **`idleTimeThresholdForManualVerificationTrigger`** | <code>number \| null</code>  | Idle time threshold (in milliseconds?) for triggering manual verification. Optional, defaults to null. |
| **`sessionTimeoutForManualVerificationTrigger`**    | <code>number \| null</code>  | Session timeout (in milliseconds?) for triggering manual verification. Optional, defaults to null.     |
| **`attestorBrowserRpcUrl`**                         | <code>string \| null</code>  | URL for the Attestor Browser RPC. Optional, defaults to null.                                          |
| **`isAIFlowEnabled`**                               | <code>boolean \| null</code> | Whether AI flow is enabled. Optional, defaults to null.                                                |


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

| Prop              | Type                 | Description                                                    |
| ----------------- | -------------------- | -------------------------------------------------------------- |
| **`appName`**     | <code>string</code>  | The name of the application.                                   |
| **`appImageUrl`** | <code>string</code>  | The URL of the application's image.                            |
| **`isRecurring`** | <code>boolean</code> | Whether the reclaim is recurring. Optional, defaults to false. |


#### VerificationOptionsOptional

| Prop          | Type                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| **`options`** | <code><a href="#verificationoptions">VerificationOptions</a> \| null</code> |


#### VerificationOptions

| Prop                                           | Type                                   | Description                                                                   |
| ---------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| **`canDeleteCookiesBeforeVerificationStarts`** | <code>boolean</code>                   |                                                                               |
| **`canUseAttestorAuthenticationRequest`**      | <code>boolean</code>                   |                                                                               |
| **`claimCreationType`**                        | <code>'standalone' \| 'meChain'</code> | The type of claim creation to use. Defaults to 'standalone'.                  |
| **`canAutoSubmit`**                            | <code>boolean</code>                   | Whether to automatically submit the proof after generation. Defaults to true. |
| **`isCloseButtonVisible`**                     | <code>boolean</code>                   | Whether the close button is visible. Defaults to true.                        |

</docgen-api>
