import * as NativeReclaimInappModuleTypes from "./definitions";
import { PluginListenerHandle, registerPlugin } from "@capacitor/core";
import { ReclaimInAppCapacitorSdkPlugin } from "./definitions";

/**
 * [ReclaimVerification] is the main class for interacting with the Reclaim verification system.
 * It provides methods to start verification processes, manage platform configurations,
 * and handle verification options.
 * 
 * The class can be instantiated with a custom platform implementation, or will use
 * the default [PlatformImpl] if none is provided.
 */
export class ReclaimVerification {
  public platform: ReclaimVerification.Platform;

  private static defaultPlatform: ReclaimVerification.Platform | null = null;

  public constructor(platform?: ReclaimVerification.Platform) {
    if (platform) {
      this.platform = platform;
    } else {
      if (ReclaimVerification.defaultPlatform == null) {
        ReclaimVerification.defaultPlatform = new PlatformImpl();
      }
      this.platform = ReclaimVerification.defaultPlatform;
    }
  }

  public async startVerification(request: ReclaimVerification.Request): Promise<ReclaimVerification.Response> {
    return this.platform.startVerification(request);
  }

  public async startVerificationFromUrl(requestUrl: string): Promise<ReclaimVerification.Response> {
    return this.platform.startVerificationFromUrl(requestUrl);
  }

  public async ping(): Promise<boolean> {
    return this.platform.ping();
  }

  public setOverrides(overrides: ReclaimVerification.OverrideConfig) {
    return this.platform.setOverrides(overrides);
  }

  public clearAllOverrides() {
    return this.platform.clearAllOverrides();
  }

  public setVerificationOptions(options?: ReclaimVerification.VerificationOptions | null) {
    return this.platform.setVerificationOptions(options);
  }
}


/**
 * This namespace provides types involved in initiating and managing the verification process
 * for proving claims about user data through various providers.
 */
export namespace ReclaimVerification {
  /**
   * Represents user's session information for a verification attempt.
   * This data class contains the necessary data to identify and validate a verification session.
   */
  export type SessionInformation = NativeReclaimInappModuleTypes.SessionInformation;

  /**
   * Represents a request for a verification attempt.
   *
   * You can create a request using the [ReclaimVerification.Request] constructor or the [ReclaimVerification.Request.fromManifestMetaData] factory method.
   */
  export type Request = NativeReclaimInappModuleTypes.Request;

  /**
   * Contains the proof and response data after verification
   */
  export interface Response extends NativeReclaimInappModuleTypes.Response {
    proofs: ReclaimResult.Proof[];
  }

  export namespace ReclaimResult {
    export interface Proof {
      identifier: string;
      signatures: string[];
      /**
       * A data associated with this [Proof].
       * The data type of this object is dynamic and can be any JSON serializable Javascript object.
       */
      publicData?: any | null;
      witnesses: WitnessData[];
      claimData: ProviderClaimData;
    }

    export const isProof = (value: Record<string, any>): value is Proof => {
      return typeof value === 'object' && value !== null && 'identifier' in value && 'signatures' in value && 'witnesses' in value;
    }

    export const asProofs = (proofs: Record<string, any>[]): Proof[] => {
      return proofs.filter(isProof);
    }

    export interface ProviderClaimData {
      owner: string;
      provider: string;
      /// int
      timestampS: number;
      /// int
      epoch: number;
      context: string;
      identifier: string;
      parameters: string;
    }

    export interface WitnessData {
      id: string;
      url: string;
    }
  }

  export interface VerificationOptions {
    canDeleteCookiesBeforeVerificationStarts: boolean;
    fetchAttestorAuthenticationRequest: (reclaimHttpProviderJsonString: string) => Promise<string>;
    claimCreationType?: 'standalone' | 'meChain'; // Optional
    /**
     * Whether to automatically submit the proof after generation. Defaults to true.
     */
    canAutoSubmit?: boolean; // Optional

    /**
     * Whether the close button is visible. Defaults to true.
     */
    isCloseButtonVisible?: boolean; // Optional
  }

  export namespace Overrides {
    export interface ProviderInformation {
      url?: string;
      jsonString?: string;
      callback?: (request: NativeReclaimInappModuleTypes.ProviderInformationRequest) => Promise<string>;
    }
    export type FeatureOptions = NativeReclaimInappModuleTypes.FeatureOptions;
    export interface LogConsumer {
      /**
       * Handler for consuming logs exported from the SDK.
       * Defaults to false.
       */
      onLogs?: (logJsonString: String, cancel: () => void) => void;

      /**
       * When enabled, logs are sent to reclaim that can be used to help you.
       * Defaults to true.
       */
      canSdkCollectTelemetry?: boolean;

      /**
       * Defaults to enabled when not in release mode.
       */
      canSdkPrintLogs?: boolean;
    }
    export interface SessionManagement {
      onLog: (event: NativeReclaimInappModuleTypes.SessionLogEvent) => void;
      /**
       * Receive request for creating a session and return a session id.
       * @param event Receive request for creating a session and return a session id.
       * @returns A session id.
       */
      onSessionCreateRequest: (event: NativeReclaimInappModuleTypes.SessionCreateRequestEvent) => Promise<string>;
      onSessionUpdateRequest: (event: NativeReclaimInappModuleTypes.SessionUpdateRequestEvent) => Promise<boolean>;
    };
    export type ReclaimAppInfo = NativeReclaimInappModuleTypes.ReclaimAppInfo;
  }

  export type OverrideConfig = {
    provider?: Overrides.ProviderInformation,
    featureOptions?: Overrides.FeatureOptions,
    logConsumer?: Overrides.LogConsumer,
    sessionManagement?: Overrides.SessionManagement,
    appInfo?: Overrides.ReclaimAppInfo,
    capabilityAccessToken?: string | null,
  }

  export enum ExceptionType {
    Cancelled = "Cancelled",
    Dismissed = "Dismissed",
    SessionExpired = "SessionExpired",
    Failed = "Failed",
  }

  export class ReclaimPlatformException extends Error {
    readonly innerError: Error
    readonly reason?: string
    readonly details?: any

    constructor(message: string, innerError: Error) {
      super(message);
      this.innerError = innerError;
      this.reason = innerError.message;
      if ('userInfo' in innerError) {
        const details: any = innerError.userInfo
        this.details = details
        if ('message' in details) {
          this.reason = details.message || this.reason
        }
      }
    }

    static isReclaimPlatformException(error: Error): error is ReclaimPlatformException {
      return error instanceof ReclaimPlatformException
    }
  }

  export class ReclaimVerificationException extends Error {
    readonly innerError: Error
    readonly type: ExceptionType
    readonly sessionId: string
    readonly "didSubmitManualVerification": boolean
    readonly "reason": string

    constructor(
      message: string,
      innerError: Error,
      type: ExceptionType,
      sessionId: string,
      didSubmitManualVerification: boolean,
      reason: string
    ) {
      super(message);
      this.innerError = innerError;
      this.type = type;
      this.sessionId = sessionId;
      this.didSubmitManualVerification = didSubmitManualVerification;
      this.reason = reason;
    }

    private static fromTypeName(name: string): ExceptionType {
      switch (name) {
        case "cancelled":
        case "org.reclaimprotocol.inapp_sdk.ReclaimVerification.ReclaimVerificationException.Cancelled":
          return ExceptionType.Cancelled;
        case "dismissed":
        case "org.reclaimprotocol.inapp_sdk.ReclaimVerification.ReclaimVerificationException.Dismissed":
          return ExceptionType.Dismissed;
        case "sessionExpired":
        case "org.reclaimprotocol.inapp_sdk.ReclaimVerification.ReclaimVerificationException.SessionExpired":
          return ExceptionType.SessionExpired;
        case "failed":
        case "org.reclaimprotocol.inapp_sdk.ReclaimVerification.ReclaimVerificationException.Failed":
          return ExceptionType.Failed;
      }
      return ExceptionType.Failed;
    }

    static fromError(error: Error, sessionIdHint: string): ReclaimVerificationException {
      if ('userInfo' in error) {
        // From native, we send information about error in userInfo
        let userInfo = error.userInfo as any;
        if (userInfo) {
          let type = ReclaimVerification.ReclaimVerificationException.fromTypeName(userInfo.errorType);
          let maybeSessionId = userInfo?.sessionId
          return new ReclaimVerificationException(
            error.message,
            error,
            type,
            (typeof maybeSessionId === 'string' && maybeSessionId)
              ? maybeSessionId : sessionIdHint,
            userInfo?.didSubmitManualVerification ?? false,
            userInfo?.reason ?? ""
          );
        }
      }
      return new ReclaimVerificationException(
        error.message,
        error,
        ReclaimVerification.ExceptionType.Failed,
        sessionIdHint,
        false,
        ""
      );
    }

    static isReclaimVerificationException(error: Error): error is ReclaimVerificationException {
      return error instanceof ReclaimVerificationException
    }
  }

  export abstract class Platform {
    abstract startVerification(request: ReclaimVerification.Request): Promise<ReclaimVerification.Response>

    abstract startVerificationFromUrl(requestUrl: string): Promise<ReclaimVerification.Response>

    abstract ping(): Promise<boolean>

    abstract setOverrides(config: ReclaimVerification.OverrideConfig): Promise<void>

    abstract clearAllOverrides(): Promise<void>

    abstract setVerificationOptions(options?: ReclaimVerification.VerificationOptions | null): Promise<void>
  }
}

const ReclaimInAppCapacitorSdk = registerPlugin<ReclaimInAppCapacitorSdkPlugin>(
  'ReclaimInAppCapacitorSdk',
  {
      web: () => import('./web').then(m => new m.ReclaimInAppCapacitorSdkWeb()),
  },
);

export class PlatformImpl extends ReclaimVerification.Platform {
  override async startVerification(request: ReclaimVerification.Request): Promise<ReclaimVerification.Response> {
      try {
          const response = await ReclaimInAppCapacitorSdk.startVerification(request);
          return {
              ...response,
              proofs: ReclaimVerification.ReclaimResult.asProofs(response.proofs),
          }
      } catch (error) {
          console.info({
              error
          })
          if (error instanceof Error) {
              throw ReclaimVerification.ReclaimVerificationException.fromError(error, request.session?.sessionId ?? "");
          }
          throw error
      }
  }

  override async startVerificationFromUrl(requestUrl: string): Promise<ReclaimVerification.Response> {
      try {
          const response = await ReclaimInAppCapacitorSdk.startVerificationFromUrl({ value: requestUrl });
          return {
              ...response,
              proofs: ReclaimVerification.ReclaimResult.asProofs(response.proofs),
          }
      } catch (error) {
          console.info({
              error
          })
          if (error instanceof Error) {
              throw ReclaimVerification.ReclaimVerificationException.fromError(error, "");
          }
          throw error
      }
  }

  override async ping(): Promise<boolean> {
      return await ReclaimInAppCapacitorSdk.ping().then((result) => result.value);
  }

  private previousSessionManagementCancelCallback: null | (() => void) = null;
  disposeSessionManagement() {
      let callback = this.previousSessionManagementCancelCallback;
      if (callback != null && callback != undefined) {
          callback();
      }
      this.previousSessionManagementCancelCallback = null;
  }

  private previousLogSubscription: PluginListenerHandle | null = null;
  disposeLogListener() {
      this.previousLogSubscription?.remove()
      this.previousLogSubscription = null;
  }

  private previousProviderRequestCancelCallback: null | (() => void) = null;
  private disposeProviderRequestListener() {
      let callback = this.previousProviderRequestCancelCallback;
      if (callback != null && callback != undefined) {
          callback();
      }
      this.previousProviderRequestCancelCallback = null;
  }

  override async setOverrides({
      provider,
      featureOptions,
      logConsumer,
      sessionManagement,
      appInfo,
      capabilityAccessToken
  }: ReclaimVerification.OverrideConfig) {
      let providerCallback = provider?.callback;
      let providerOverride = !provider ? null : {
          url: provider?.url,
          jsonString: provider?.jsonString,
          canFetchProviderInformationFromHost: !!providerCallback,
      }
      if (providerCallback) {
          this.disposeProviderRequestListener();
          let providerRequestSubscription = await ReclaimInAppCapacitorSdk.addListener('onProviderInformationRequest', async (event) => {
              try {
                  let result = await providerCallback(event);
                  ReclaimInAppCapacitorSdk.replyWithString({ replyId: event.replyId, value: result });
              } catch (error) {
                  console.error(error);
                  ReclaimInAppCapacitorSdk.replyWithString({ replyId: event.replyId, value: "" });
              }
          });
          const cancel = async () => {
              return await providerRequestSubscription.remove();
          }
          this.previousProviderRequestCancelCallback = cancel;
      }

      const onLogsListener = logConsumer?.onLogs;
      let logConsumerRequest = !logConsumer ? undefined : {
          enableLogHandler: !!onLogsListener,
          canSdkCollectTelemetry: logConsumer?.canSdkCollectTelemetry,
          canSdkPrintLogs: logConsumer?.canSdkPrintLogs
      }
      if (onLogsListener) {
          this.disposeLogListener();
          const cancel = () => {
              this.previousLogSubscription?.remove();
              this.previousLogSubscription = null;
          };
          this.previousLogSubscription = await ReclaimInAppCapacitorSdk.addListener('onLogs', (arg) => {
              onLogsListener(arg.value, cancel);
          })
      }

      let sessionManagementRequest = !sessionManagement ? undefined : {
          // A handler is provided, so we don't let SDK manage sessions
          enableSdkSessionManagement: false
      }
      if (sessionManagement) {
          this.disposeSessionManagement();
          let sessionCreateSubscription = await ReclaimInAppCapacitorSdk.addListener('onSessionCreateRequest', async (event) => {
              const replyId = event.replyId;
              try {
                  let result = await sessionManagement.onSessionCreateRequest(event);
                  ReclaimInAppCapacitorSdk.replyWithString({ replyId, value: result });
              } catch (error) {
                  console.error(error);
                  ReclaimInAppCapacitorSdk.replyWithString({ replyId, value: '' });
              }
          });
          let sessionUpdateSubscription = await ReclaimInAppCapacitorSdk.addListener('onSessionUpdateRequest', async (event) => {
              const replyId = event.replyId;
              try {
                  let result = await sessionManagement.onSessionUpdateRequest(event);
                  ReclaimInAppCapacitorSdk.reply({ replyId, reply: result });
              } catch (error) {
                  console.error(error);
                  ReclaimInAppCapacitorSdk.reply({ replyId, reply: false });
              }
          });
          let sessionLogsSubscription = await ReclaimInAppCapacitorSdk.addListener('onSessionLogs', (event) => {
              try {
                  sessionManagement.onLog(event);
              } catch (error) {
                  console.error(error);
              }
          });
          const cancel = () => {
              sessionCreateSubscription.remove()
              sessionUpdateSubscription.remove()
              sessionLogsSubscription.remove()
          }
          this.previousSessionManagementCancelCallback = cancel;
      }

      try {
          return await ReclaimInAppCapacitorSdk.setOverrides({
              provider: providerOverride,
              featureOptions,
              logConsumer: logConsumerRequest,
              sessionManagement: sessionManagementRequest,
              appInfo,
              capabilityAccessToken
          });
      } catch (error) {
          throw new ReclaimVerification.ReclaimPlatformException("Failed to set overrides", error as Error);
      }
  }

  override async clearAllOverrides() {
      this.disposeProviderRequestListener();
      this.disposeLogListener();
      this.disposeSessionManagement();
      return ReclaimInAppCapacitorSdk.clearAllOverrides();
  }

  private previousAttestorAuthRequestCancelCallback: null | (() => void) = null;
  disposeAttestorAuthRequestListener() {
      let callback = this.previousAttestorAuthRequestCancelCallback;
      if (callback != null && callback != undefined) {
          callback();
      }
      this.previousAttestorAuthRequestCancelCallback = null;
  }

  override async setVerificationOptions(options?: ReclaimVerification.VerificationOptions | null): Promise<void> {
      let args: NativeReclaimInappModuleTypes.VerificationOptions | null = null
      if (options) {
          let canUseAttestorAuthenticationRequest = options.fetchAttestorAuthenticationRequest != null
          args = {
              canDeleteCookiesBeforeVerificationStarts: options.canDeleteCookiesBeforeVerificationStarts,
              canUseAttestorAuthenticationRequest: canUseAttestorAuthenticationRequest,
              claimCreationType: options.claimCreationType ?? 'standalone',
              canAutoSubmit: options.canAutoSubmit ?? true,
              isCloseButtonVisible: options.isCloseButtonVisible ?? true,
          }
          if (canUseAttestorAuthenticationRequest) {
              this.disposeAttestorAuthRequestListener();
              let attestorAuthRequestSubscription = await ReclaimInAppCapacitorSdk.addListener('onReclaimAttestorAuthRequest', async (event) => {
                  let result = await options.fetchAttestorAuthenticationRequest(event.reclaimHttpProviderJsonString);
                  ReclaimInAppCapacitorSdk.replyWithString({ replyId: event.replyId, value: result });
              });
              const cancel = () => {
                  attestorAuthRequestSubscription.remove();
              }
              this.previousAttestorAuthRequestCancelCallback = cancel;
          }
      }
      try {
          return await ReclaimInAppCapacitorSdk.setVerificationOptions({
              options: args
          });
      } catch (error) {
          throw new ReclaimVerification.ReclaimPlatformException("Failed to set verification options", error as Error);
      }
  }
}