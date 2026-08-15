import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(ReclaimInAppCapacitorSdkPlugin)
public class ReclaimInAppCapacitorSdkPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ReclaimInAppCapacitorSdkPlugin"
    public let jsName = "ReclaimInAppCapacitorSdk"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "startVerification", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startVerificationFromUrl", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startVerificationFromJson", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setOverrides", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clearAllOverrides", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setVerificationOptions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setConsoleLogging", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reply", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "replyWithString", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startEventSubscription", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "removeEventSubscription", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "ping", returnType: CAPPluginReturnPromise)
    ]

    private let api = Api()

    @objc func startVerification(_ call: CAPPluginCall) {
        Task { @MainActor in
            do {
                var sessionId: String? = nil
                var timestamp: String? = nil
                var signature: String? = nil
                if let session = call.getObject("session") {
                    if let value = session["sessionId"] as? String? {
                        sessionId = value
                    }
                    if let value = session["timestamp"] as? String? {
                        timestamp = value
                    }
                    if let value = session["signature"] as? String? {
                        signature = value
                    }
                }
                var parameters = [String: String]()
                if let params = call.getObject("parameters") {
                    params.keys.forEach { key in
                        parameters[key] = params[key] as? String
                    }
                }
                var providerVersion: [String: String] = [:]
                if let pv = call.getObject("providerVersion") {
                    if let resolved = pv["resolvedVersion"] as? String {
                        providerVersion["resolvedVersion"] = resolved
                    }
                    if let expr = pv["versionExpression"] as? String {
                        providerVersion["versionExpression"] = expr
                    }
                }
                let result = try await api.startVerification(
                    appId: call.getString("appId"),
                    secret: call.getString("secret"),
                    providerId: call.getString("providerId", ""),
                    sessionTimestamp: timestamp,
                    sessionSessionId: sessionId,
                    sessionSignature: signature,
                    context: call.getString("contextString"),
                    parameters: parameters,
                    providerVersion: providerVersion
                )
                call.resolve(result)
            } catch {
                call.reject("Verification Error", "VERIFICATION_ERROR", error)
            }
        }
    }
    @objc func startVerificationFromUrl(_ call: CAPPluginCall) {
        Task { @MainActor in
            do {
                let result = try await api.startVerificationFromUrl(
                    url: call.getString("value", "")
                )
                call.resolve(result)
            } catch {
                call.reject("Verification Error", "VERIFICATION_ERROR", error)
            }
        }
    }
    @objc func startVerificationFromJson(_ call: CAPPluginCall) {
        Task { @MainActor in
            do {
                let result = try await api.startVerificationFromJson(
                    template: call.getString("template", "")
                )
                call.resolve(result)
            } catch {
                call.reject("Verification Error", "VERIFICATION_ERROR", error)
            }
        }
    }
    private static func toNSNumberFromDouble(_ double: Double?) -> NSNumber? {
        if let double = double {
            return NSNumber(value: double)
        }
        return nil
    }
    private static func toNSNumberFromLong(_ value: Any?) -> NSNumber? {
        if let n = value as? NSNumber {
            return n
        }
        if let i = value as? Int {
            return NSNumber(value: Int64(i))
        }
        if let i = value as? Int64 {
            return NSNumber(value: i)
        }
        if let d = value as? Double {
            return NSNumber(value: Int64(d))
        }
        return nil
    }
    private static func toNSNumberFromBool(_ bool: Bool?) -> NSNumber? {
        if let bool = bool {
            return NSNumber(value: bool)
        }
        return nil
    }
    private static func toNSNumberFromBoolDefaults(_ bool: Bool?, _ defaultBool: Bool) -> NSNumber? {
        if let bool = bool {
            return NSNumber(value: bool)
        }
        return NSNumber(value: defaultBool)
    }
    private static func toStringWhenNotEmpty(_ value: String?) -> String? {
        if let value = value, !value.isEmpty {
            return value
        }
        return nil
    }

    @objc func setOverrides(_ call: CAPPluginCall) {
        Task { @MainActor in
            do {
                var overridenProvider: OverridenProviderInformation? = nil
                if let provider = call.getObject("provider") {
                    if let providerUrl = provider["url"] as? String, !providerUrl.isEmpty {
                        overridenProvider = .init(url: providerUrl)
                    } else if let jsonString = provider["jsonString"] as? String, !jsonString.isEmpty {
                        overridenProvider = .init(jsonString: jsonString)
                    } else if let canFetchProviderInformationFromHost = provider["canFetchProviderInformationFromHost"] as? Bool, canFetchProviderInformationFromHost {
                        let callback: OverridenProviderCallbackHandler = .init { appId, providerId, sessionId, signature, timestamp, resolvedVersion, replyId in
                            let data: [String: Any] = [
                              "appId": appId,
                              "providerId": providerId,
                              "sessionId": sessionId,
                              "signature": signature,
                              "timestamp": timestamp,
                              "resolvedVersion": resolvedVersion,
                              "replyId": replyId
                            ]
                            self.notifyListeners("onProviderInformationRequest", data: data)
                        }
                        overridenProvider = .init(callback: callback)
                    }
                }

                var overridenFeatureOptions: OverridenFeatureOptions? = nil
                if let featureOptions = call.getObject("featureOptions") {
                    overridenFeatureOptions = .init(
                        cookiePersist: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromBool(featureOptions["cookiePersist"] as? Bool),
                        singleReclaimRequest: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromBool(featureOptions["singleReclaimRequest"] as? Bool),
                        idleTimeThresholdForManualVerificationTrigger: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromLong(featureOptions["idleTimeThresholdForManualVerificationTrigger"]),
                        sessionTimeoutForManualVerificationTrigger: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromLong(featureOptions["sessionTimeoutForManualVerificationTrigger"]),
                        attestorBrowserRpcUrl: ReclaimInAppCapacitorSdkPlugin.toStringWhenNotEmpty(featureOptions["attestorBrowserRpcUrl"] as? String),
                        isAIFlowEnabled: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromBool(featureOptions["isAIFlowEnabled"] as? Bool),
                        manualReviewMessage: ReclaimInAppCapacitorSdkPlugin.toStringWhenNotEmpty(featureOptions["manualReviewMessage"] as? String),
                        loginPromptMessage: ReclaimInAppCapacitorSdkPlugin.toStringWhenNotEmpty(featureOptions["loginPromptMessage"] as? String),
                        useTEE: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromBool(featureOptions["useTEE"] as? Bool),
                        interceptorOptions: ReclaimInAppCapacitorSdkPlugin.toStringWhenNotEmpty(featureOptions["interceptorOptions"] as? String),
                        claimCreationTimeoutDurationInMins: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromLong(featureOptions["claimCreationTimeoutDurationInMins"]),
                        sessionNoActivityTimeoutDurationInMins: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromLong(featureOptions["sessionNoActivityTimeoutDurationInMins"]),
                        aiProviderNoActivityTimeoutDurationInSecs: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromLong(featureOptions["aiProviderNoActivityTimeoutDurationInSecs"]),
                        pageLoadedCompletedDebounceTimeoutMs: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromLong(featureOptions["pageLoadedCompletedDebounceTimeoutMs"]),
                        potentialLoginTimeoutS: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromLong(featureOptions["potentialLoginTimeoutS"]),
                        screenshotCaptureIntervalSeconds: ReclaimInAppCapacitorSdkPlugin.toNSNumberFromLong(featureOptions["screenshotCaptureIntervalSeconds"]),
                        teeUrls: ReclaimInAppCapacitorSdkPlugin.toStringWhenNotEmpty(featureOptions["teeUrls"] as? String),
                        privacyPolicyUrl: ReclaimInAppCapacitorSdkPlugin.toStringWhenNotEmpty(featureOptions["privacyPolicyUrl"] as? String),
                        termsOfServiceUrl: ReclaimInAppCapacitorSdkPlugin.toStringWhenNotEmpty(featureOptions["termsOfServiceUrl"] as? String),
                        potentialFailureReasonsUrl: ReclaimInAppCapacitorSdkPlugin.toStringWhenNotEmpty(featureOptions["potentialFailureReasonsUrl"] as? String)
                    )
                }

                var overridenLogConsumer: OverridenLogConsumer? = nil
                if let logConsumer = call.getObject("logConsumer") {
                    var logHandler: OverridenLogHandler? = nil
                    if let enableLogHandler = logConsumer["enableLogHandler"] as? Bool, enableLogHandler {
                        logHandler = .init(onLogs: { logs in
                            self.notifyListeners("onLogs", data: ["value": logs])
                        })
                    }
                    let canSdkCollectTelemetry: Bool? = if let value = logConsumer["canSdkCollectTelemetry"] as? Bool? {
                        value
                    } else { nil }
                    let canSdkPrintLogs: Bool? = if let value = logConsumer["canSdkPrintLogs"] as? Bool? {
                        value
                    } else { nil }
                    let canLogMetadata: Bool? = if let value = logConsumer["canLogMetadata"] as? Bool? {
                        value
                    } else { nil }
                    overridenLogConsumer = .init(
                        logHandler: logHandler,
                        canSdkCollectTelemetry: canSdkCollectTelemetry ?? true,
                        canSdkPrintLogs: canSdkPrintLogs == nil ? nil : NSNumber(value: canSdkPrintLogs!),
                        logLevel: ReclaimInAppCapacitorSdkPlugin.toStringWhenNotEmpty(logConsumer["logLevel"] as? String),
                        canLogMetadata: canLogMetadata == nil ? nil : NSNumber(value: canLogMetadata!)
                    )
                }

                var sessionManagement: OverridenSessionManagement? = nil
                if let value = call.getObject("sessionManagement"), let isEnabled = value["enableSdkSessionManagement"] as? Bool?, isEnabled == false {
                    let handler: OverridenSessionManagement.OverridenSessionHandler = .init { appId, providerId, timestamp, signature, providerVersion, replyId in
                        self.notifyListeners("onSessionCreateRequest", data: [
                            "appId": appId,
                            "providerId": providerId,
                            "timestamp": timestamp,
                            "signature": signature,
                            "providerVersion": providerVersion,
                            "replyId": replyId
                        ])
                    } _updateSession: { sessionId, status, replyId in
                        self.notifyListeners("onSessionUpdateRequest", data: [
                            "sessionId": sessionId,
                            "status": status,
                            "replyId": replyId
                        ])
                    } _logSession: { appId, providerId, sessionId, logType in
                        self.notifyListeners("onSessionLogs", data: [
                            "appId": appId,
                            "providerId": providerId,
                            "sessionId": sessionId,
                            "logType": logType
                        ])
                    }
                    sessionManagement = .init(handler: handler)
                }

                var overridenAppInfo: OverridenReclaimAppInfo? = nil
                if let appInfo = call.getObject("appInfo") {
                    let isRecurring: NSNumber? = if let value = appInfo["isRecurring"] as? Bool? {
                        NSNumber.init(value: value ?? false)
                    } else { nil }
                    overridenAppInfo = .init(
                        appName: appInfo["appName"] as? String ?? "",
                        appImageUrl: appInfo["appImageUrl"] as? String ?? "",
                        isRecurring: isRecurring,
                        theme: appInfo["theme"] as? String
                    )
                }

                let capabilityAccessToken: String? = call.getString("capabilityAccessToken")

                let _ = try await api.setOverrides(
                    provider: overridenProvider,
                    featureOptions: overridenFeatureOptions,
                    logConsumer: overridenLogConsumer,
                    sessionManagement: sessionManagement,
                    appInfo: overridenAppInfo,
                    capabilityAccessToken: capabilityAccessToken
                )
                call.resolve()
            } catch {
                call.reject("Error on override", "OVERRIDE_ERROR", error)
            }
        }
    }
    @objc func clearAllOverrides(_ call: CAPPluginCall) {
        Task { @MainActor in
            do {
                try await api.clearAllOverrides()
                call.resolve()
            } catch {
                call.reject("Error on clearing overrides", "OVERRIDE_ERROR", error)
            }
        }
    }
    @objc func setVerificationOptions(_ call: CAPPluginCall) {
        let inputOptions = call.getObject("options")
        var options: ReclaimApiVerificationOptions? = nil
        if let inputOptions {
            let canUseAttestorAuthRequestProvider = inputOptions["canUseAttestorAuthenticationRequest"] as? Bool == true
            var fetchAttestorCallback: ReclaimVerificationOptionFetchAttestorAuthRequestHandler? = nil
            if canUseAttestorAuthRequestProvider {
                fetchAttestorCallback = { reclaimHttpProviderJsonString, replyId in
                    self.notifyListeners("onReclaimAttestorAuthRequest", data: [
                        "reclaimHttpProviderJsonString": reclaimHttpProviderJsonString,
                        "replyId": replyId
                    ])
                }
            }
            let useTeeOperator: NSNumber? = ReclaimInAppCapacitorSdkPlugin.toNSNumberFromBool(inputOptions["useTeeOperator"] as? Bool)
            options = .init(
                canDeleteCookiesBeforeVerificationStarts: (inputOptions["canDeleteCookiesBeforeVerificationStarts"] as? Bool) ?? true,
                fetchAttestorAuthenticationRequest: fetchAttestorCallback,
                claimCreationType: inputOptions["claimCreationType"] as? String ?? "standalone",
                canAutoSubmit: (inputOptions["canAutoSubmit"] as? Bool) ?? true,
                isCloseButtonVisible: (inputOptions["isCloseButtonVisible"] as? Bool) ?? true,
                locale: inputOptions["locale"] as? String,
                useTeeOperator: useTeeOperator
            )
        }

        Task { @MainActor in
            do {
                try await api.setVerificationOptions(options: options)
                call.resolve()
            } catch {
                call.reject("Error on setting verification options", "VERIFICATION_OPTIONS_ERROR", error)
            }
        }
    }
    @objc func setConsoleLogging(_ call: CAPPluginCall) {
        let enabled = call.getBool("enabled", false)
        Task { @MainActor in
            do {
                try await api.setConsoleLogging(enabled: enabled)
                call.resolve()
            } catch {
                call.reject("Error on setting console logging", "SET_CONSOLE_LOGGING", error)
            }
        }
    }
    @objc func reply(_ call: CAPPluginCall) {
        api.reply(
            replyId: call.getString("replyId") ?? "",
            reply: call.getBool("reply", false)
        )
        call.resolve()
    }
    @objc func replyWithString(_ call: CAPPluginCall) {
        api.replyWithString(
            replyId: call.getString("replyId") ?? "",
            value: call.getString("value") ?? ""
        )
        call.resolve()
    }
    @objc func startEventSubscription(_ call: CAPPluginCall) {
        let event = call.getString("event") ?? ""
        if event == "sessionIdentityUpdate" {
            let handler: OverridenSessionIdentityUpdateHandler = .init { appId, providerId, sessionId in
                self.notifyListeners("onSessionIdentityUpdate", data: [
                    "appId": appId ?? "",
                    "providerId": providerId ?? "",
                    "sessionId": sessionId ?? ""
                ])
            }
            Task { @MainActor in
                do {
                    try await api.startSessionIdentityEventListener(listener: handler)
                    call.resolve()
                } catch {
                    NSLog("[ReclaimInAppCapacitorSdkPlugin] startEventSubscription error: \(error)")
                    call.resolve()
                }
            }
        } else {
            NSLog("[ReclaimInAppCapacitorSdkPlugin] Unknown event subscription requested: \(event)")
            call.resolve()
        }
    }
    @objc func removeEventSubscription(_ call: CAPPluginCall) {
        // do nothing for now, clearOverrides clears everything atm.
        call.resolve()
    }
    @objc func ping(_ call: CAPPluginCall) {
        let value = api.ping()
        call.resolve(["value": value])
    }
}
