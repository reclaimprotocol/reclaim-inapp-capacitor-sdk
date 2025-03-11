package org.reclaimprotocol.inapp_capacitor_sdk

import android.content.Context
import android.os.Handler
import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONObject
import org.reclaimprotocol.inapp_sdk.ReclaimOverrides
import org.reclaimprotocol.inapp_sdk.ReclaimSessionStatus
import org.reclaimprotocol.inapp_sdk.ReclaimVerification
import java.lang.Exception
import java.util.UUID

@CapacitorPlugin(name = "ReclaimInAppCapacitorSdk")
class ReclaimInAppCapacitorSdkPlugin : Plugin() {
    companion object {
        const val NAME = "ReclaimInAppCapacitorSdk"
    }

    private val implementation = ReclaimInAppCapacitorSdk()

    private val _applicationContext: Context
        get() = context.applicationContext

    private fun runOnUiQueueThread(callback: () -> Unit) {
        val handler = Handler(_applicationContext.mainLooper)
        handler.post { callback() }
    }

    class ReclaimVerificationResultHandlerImpl(val promise: PluginCall?) :
        ReclaimVerification.ResultHandler {
        override fun onException(exception: ReclaimVerification.ReclaimVerificationException) {
            Log.e(NAME, "reclaim exception", exception)
            val userInfoMap = JSObject()
            val errorType = when (exception) {
                is ReclaimVerification.ReclaimVerificationException.Cancelled -> "cancelled"
                is ReclaimVerification.ReclaimVerificationException.Dismissed -> "dismissed"
                is ReclaimVerification.ReclaimVerificationException.Failed -> "failed"
                is ReclaimVerification.ReclaimVerificationException.SessionExpired -> "sessionExpired"
            }
            userInfoMap.put("errorType", errorType)
            userInfoMap.put("sessionId", exception.sessionId)
            userInfoMap.put("didSubmitManualVerification", exception.didSubmitManualVerification)
            userInfoMap.put(
                "reason",
                if (exception is ReclaimVerification.ReclaimVerificationException.Failed) exception.reason else null
            )
            promise?.reject("Verification Error", "VERIFICATION_ERROR", exception, userInfoMap)
        }

        override fun onResponse(response: ReclaimVerification.Response) {
            Log.d(NAME, "reclaim response")
            val returnResponse = JSObject()
            returnResponse.put("sessionId", response.sessionId)
            returnResponse.put("didSubmitManualVerification", response.didSubmitManualVerification)
            val returnProofs = JSArray()
            for (proof in response.proofs) {
                val returnProof = JSObject.fromJSONObject(JSONObject(proof))
                returnProofs.put(returnProof)
            }
            returnResponse.put("proofs", returnProofs)
            promise?.resolve(returnResponse)
        }
    }

    @PluginMethod
    fun startVerification(call: PluginCall) {
        Log.d(NAME, "startVerification")
        val handler = ReclaimVerificationResultHandlerImpl(call)
        val request = call.data

        runOnUiQueueThread {
            val appId = getString(request, "appId")
            val secret = getString(request, "secret")
            val verificationRequest: ReclaimVerification.Request
            val session = request.getJSObject("session")
            val receivedParameters = request.getJSObject("parameters")
            val parameters = mutableMapOf<String, String>()
            if (receivedParameters != null) {
                for (key in receivedParameters.keys()) {
                    val value = receivedParameters[key]
                    if (value is String) {
                        parameters[key] = value
                    }
                }
            }
            val autoSubmit = getBoolean(request, "autoSubmit")
            val acceptAiProviders = getBoolean(request, "acceptAiProviders")
            val webhookUrl = getString(request, "webhookUrl")
            if (appId.isNullOrBlank() && secret.isNullOrBlank()) {
                verificationRequest = ReclaimVerification.Request.fromManifestMetaData(
                    context = _applicationContext,
                    providerId = getString(request, "providerId")!!,
                    contextString = getString(request, "contextString") ?: "",
                    session = if (session == null) null else ReclaimVerification.ReclaimSessionInformation(
                        timestamp = getString(session, "timestamp") ?: "",
                        sessionId = getString(session, "sessionId") ?: "",
                        signature = getString(session, "signature") ?: "",
                    ),
                    parameters = parameters,
                    autoSubmit = autoSubmit ?: false,
                    acceptAiProviders = acceptAiProviders ?: false,
                    webhookUrl = webhookUrl,
                )
            } else {
                verificationRequest = ReclaimVerification.Request(
                    appId = appId!!,
                    secret = secret!!,
                    providerId = getString(request, "providerId")!!,
                    contextString = getString(request, "contextString") ?: "",
                    session = if (session == null) null else ReclaimVerification.ReclaimSessionInformation(
                        timestamp = getString(session, "timestamp") ?: "",
                        sessionId = getString(session, "sessionId") ?: "",
                        signature = getString(session, "signature") ?: "",
                    ),
                    parameters = parameters,
                    autoSubmit = autoSubmit ?: false,
                    acceptAiProviders = acceptAiProviders ?: false,
                    webhookUrl = webhookUrl,
                )
            }
            ReclaimVerification.startVerification(
                context = _applicationContext, request = verificationRequest, handler = handler
            )
        }
    }

    @PluginMethod
    fun startVerificationFromUrl(call: PluginCall) {
        Log.d(NAME, "startVerificationFromUrl")
        val requestUrl = call.getString("value")
        if (requestUrl == null) {
            Log.d(NAME, "no request url. rejecting.")

            call.reject("requestUrl is null", IllegalArgumentException("Request url is null"))
            return
        }
        val handler = ReclaimVerificationResultHandlerImpl(call)
        runOnUiQueueThread {
            ReclaimVerification.startVerificationFromUrl(
                context = _applicationContext, requestUrl = requestUrl, handler = handler
            )
        }
    }

    @PluginMethod
    fun setOverrides(call: PluginCall) {
        val overrides = call.data
        return setOverrides(
            provider = getMap(overrides, "provider"),
            featureOptions = getMap(overrides, "featureOptions"),
            logConsumer = getMap(overrides, "logConsumer"),
            sessionManagement = getMap(overrides, "sessionManagement"),
            appInfo = getMap(overrides, "appInfo"),
            capabilityAccessToken = getString(overrides, "capabilityAccessToken"),
            call,
        )
    }

    @PluginMethod
    fun clearAllOverrides(call: PluginCall) {
        runOnUiQueueThread {
            ReclaimVerification.clearAllOverrides(
                context = _applicationContext,
            ) { result ->
                result.onSuccess {
                    call.resolve(null)
                }.onFailure { error ->
                    onPlatformException(call, error)
                }
            }
        }
    }

    @PluginMethod
    fun setVerificationOptions(call: PluginCall) {
        val inputOptions = getMap(call.data, "options")
        var options:  ReclaimVerification.VerificationOptions? = null
        if (inputOptions != null) {
            val canUseAttestorAuthRequestProvider = getBoolean(inputOptions, "canUseAttestorAuthenticationRequest") == true;
            options = ReclaimVerification.VerificationOptions(
                canDeleteCookiesBeforeVerificationStarts = getBoolean(inputOptions, "canDeleteCookiesBeforeVerificationStarts") ?: true,
                attestorAuthRequestProvider = if (canUseAttestorAuthRequestProvider) {
                    object : ReclaimVerification.VerificationOptions.AttestorAuthRequestProvider {
                        override fun fetchAttestorAuthenticationRequest(
                            reclaimHttpProvider: Map<Any?, Any?>,
                            callback: (Result<String>) -> Unit
                        ) {
                            val args = JSObject()
                            args.put("reclaimHttpProviderJsonString", JSONObject(reclaimHttpProvider).toString())
                            val replyId = UUID.randomUUID().toString()
                            args.put("replyId", replyId)
                            replyWithString[replyId] = callback
                            notifyListeners("onReclaimAttestorAuthRequest", args)
                        }
                    }
                } else {
                    null
                }
            )
        }
        runOnUiQueueThread {
            ReclaimVerification.setVerificationOptions(
                context = _applicationContext,
                options = options
            ) { result ->
                result.onSuccess {
                    call.resolve(null)
                }.onFailure { error ->
                    onPlatformException(call, error)
                }
            }
        }
    }

    private val replyHandlers: MutableMap<String, (Result<Boolean>) -> Unit> = mutableMapOf()
    @PluginMethod
    fun reply(call: PluginCall) {
        val replyId = call.getString("replyId")
        val reply = call.getBoolean("reply") == true
        if (replyId == null) {
            Log.w(NAME, "(reply) Missing arg replyId")
            return
        }
        runOnUiQueueThread {
            val callback = replyHandlers[replyId]
            if (callback != null) {
                callback(Result.success(reply))
            } else {
                Log.w(NAME, "(reply) Missing reply handler for id: $replyId")
            }
        }
    }

    private val replyWithString: MutableMap<String, (Result<String>) -> Unit> = mutableMapOf()
    @PluginMethod
    fun replyWithString(call: PluginCall) {
        val replyId = call.getString("replyId")
        val value = call.getString("value") ?: ""
        if (replyId == null) {
            Log.w(NAME, "(replyWithString) Missing arg replyId")
            return
        }
        runOnUiQueueThread {
            val callback = replyWithString[replyId]
            if (callback != null) {
                callback(Result.success(value))
            } else {
                Log.w(NAME, "(replyWithString) Missing reply handler for id: $replyId")
            }
        }
    }

    @PluginMethod
    fun ping(call: PluginCall) {
        val ret = JSObject()
        ret.put("value", implementation.ping())
        call.resolve(ret)
    }

    private fun setOverrides(
        provider: JSObject?,
        featureOptions: JSObject?,
        logConsumer: JSObject?,
        sessionManagement: JSObject?,
        appInfo: JSObject?,
        capabilityAccessToken: String?,
        promise: PluginCall?
    ) {
        runOnUiQueueThread {
            ReclaimVerification.setOverrides(
                context = _applicationContext,
                provider = if (provider == null) null else (
                        if (hasValue(provider, "jsonString"))
                            ReclaimOverrides.ProviderInformation.FromJsonString(
                                requireString(
                                    provider, "jsonString"
                                )
                            )
                        else if (hasValue(provider, "url"))
                            ReclaimOverrides.ProviderInformation.FromUrl(
                                requireString(
                                    provider, "url"
                                )
                            )
                        else if (getBoolean(provider, "canFetchProviderInformationFromHost") == true)
                            ReclaimOverrides.ProviderInformation.FromCallback(object : ReclaimOverrides.ProviderInformation.FromCallback.Handler {
                                override fun fetchProviderInformation(
                                    appId: String,
                                    providerId: String,
                                    sessionId: String,
                                    signature: String,
                                    timestamp: String,
                                    callback: (Result<String>) -> Unit
                                ) {
                                    val args = JSObject()
                                    args.put("appId", appId)
                                    args.put("providerId", providerId)
                                    args.put("sessionId", sessionId)
                                    args.put("signature", signature)
                                    args.put("timestamp", timestamp)
                                    val replyId = UUID.randomUUID().toString()
                                    args.put("replyId", replyId)
                                    replyWithString[replyId] = callback
                                    notifyListeners("onProviderInformationRequest", args)
                                }
                            })
                        else
                            (throw IllegalStateException("Invalid provider information. canFetchProviderInformationFromHost was not true and jsonString, url were also not provided."))
                        ),
                featureOptions = if (featureOptions == null) null else ReclaimOverrides.FeatureOptions(
                    cookiePersist = getBoolean(featureOptions, "cookiePersist"),
                    singleReclaimRequest = getBoolean(featureOptions, "singleReclaimRequest"),
                    idleTimeThresholdForManualVerificationTrigger = getLong(
                        featureOptions, "idleTimeThresholdForManualVerificationTrigger"
                    ),
                    sessionTimeoutForManualVerificationTrigger = getLong(
                        featureOptions, "sessionTimeoutForManualVerificationTrigger"
                    ),
                    attestorBrowserRpcUrl = getString(featureOptions, "attestorBrowserRpcUrl"),
                    isResponseRedactionRegexEscapingEnabled = getBoolean(
                        featureOptions, "isResponseRedactionRegexEscapingEnabled"
                    ),
                    isAIFlowEnabled = getBoolean(featureOptions, "isAIFlowEnabled")
                ),
                logConsumer = if (logConsumer == null) null else ReclaimOverrides.LogConsumer(
                    logHandler = if (getBoolean(logConsumer, "enableLogHandler") != true) null else object :
                        ReclaimOverrides.LogConsumer.LogHandler {
                        override fun onLogs(logJsonString: String) {
                            val args = JSObject()
                            args.put("value", logJsonString)
                            notifyListeners("onLogs", args)
                        }
                    },
                    canSdkCollectTelemetry = getBoolean(logConsumer, "canSdkCollectTelemetry") ?: true,
                    canSdkPrintLogs = getBoolean(logConsumer, "canSdkPrintLogs")
                ),
                sessionManagement = if (sessionManagement == null || getBoolean(
                        sessionManagement, "enableSdkSessionManagement"
                    ) != false
                ) null else ReclaimOverrides.SessionManagement(handler = object :
                    ReclaimOverrides.SessionManagement.SessionHandler {
                    override fun createSession(
                        appId: String,
                        providerId: String,
                        sessionId: String,
                        callback: (Result<Boolean>) -> Unit
                    ) {
                        val args = JSObject()
                        args.put("appId", appId)
                        args.put("providerId", providerId)
                        args.put("sessionId", sessionId)
                        val replyId = UUID.randomUUID().toString()
                        args.put("replyId", replyId)
                        replyHandlers[replyId] = callback
                        notifyListeners("onSessionCreateRequest", args)
                    }

                    override fun logSession(
                        appId: String, providerId: String, sessionId: String, logType: String
                    ) {
                        val args = JSObject()
                        args.put("appId", appId)
                        args.put("providerId", providerId)
                        args.put("sessionId", sessionId)
                        args.put("logType", logType)
                        notifyListeners("onSessionLogs", args)
                    }

                    override fun updateSession(
                        sessionId: String, status: ReclaimSessionStatus, callback: (Result<Boolean>) -> Unit
                    ) {
                        status.name
                        val args = JSObject()
                        args.put("sessionId", sessionId)
                        args.put("status", status.name)
                        val replyId = UUID.randomUUID().toString()
                        args.put("replyId", replyId)
                        replyHandlers[replyId] = callback
                        notifyListeners("onSessionUpdateRequest", args)
                    }
                }),
                appInfo = if (appInfo == null) null else ReclaimOverrides.ReclaimAppInfo(
                    appName = requireString(appInfo, "appName"),
                    appImageUrl = requireString(appInfo, "appImageUrl"),
                    isRecurring = getBoolean(appInfo, "isRecurring") ?: false,
                ),
                capabilityAccessToken = capabilityAccessToken
            ) { result ->
                result.onSuccess {
                    try {
                        Log.d(NAME, "(setOverrides) Success")
                        promise?.resolve(null)
                    } catch (e: Throwable) {
                        Log.e(NAME, "(setOverrides) Error resolving promise")
                    }

                }.onFailure { error ->
                    try {
                        Log.d(NAME, "(setOverrides) Failure")
                        onPlatformException(promise, error)
                    } catch (e: Throwable) {
                        Log.e(NAME, "(setOverrides) Error rejecting promise", e)
                    }
                }
            }
        }
    }

    private fun onPlatformException(promise: PluginCall?, exception: Throwable) {
        if (exception is ReclaimVerification.ReclaimPlatformException) {
            val userInfoMap = JSObject()
            userInfoMap.put("message", exception.internalErrorMessage)
            userInfoMap.put("errorCode", exception.errorCode)
            promise?.reject(exception.message, "PLATFORM_ERROR", exception, userInfoMap)
        } else {
            if (exception is Exception) {
                promise?.reject("Unexpected Error", "PLATFORM_ERROR", exception)
            } else {
                promise?.reject("Unexpected Error", "PLATFORM_ERROR", object: Exception(exception.message) {
                    
                })
            }
        }
    }

    @Suppress("SameParameterValue")
    private fun hasValue(map: JSObject, key: String): Boolean {
        return map.has(key) && !map.isNull(key)
    }

    private fun requireString(map: JSObject, key: String): String {
        val value = getString(map, key)
        if (value == null) {
            Log.w(NAME, "Missing value for key: $key")
            return ""
        }
        return value
    }

    private fun getMap(map: JSObject?, key: String): JSObject? {
        return if (map == null || !map.has(key) || map.isNull(key)) {
            null
        } else {
            map.getJSObject(key)
        }
    }

    private fun getLong(map: JSObject?, key: String): Long? {
        if (map == null) return null
        return if (!map.has(key) || map.isNull(key)) {
            null
        } else {
            map.getLong(key)
        }
    }

    private fun getString(map: JSObject?, key: String): String? {
        if (map == null) return null
        return if (!map.has(key) || map.isNull(key)) {
            null
        } else {
            map.getString(key)
        }
    }

    private fun getBoolean(map: JSObject, key: String): Boolean? {
        return if (!map.has(key) || map.isNull(key)) {
            null
        } else {
            map.getBoolean(key)
        }
    }
}
