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
import org.reclaimprotocol.inapp_sdk.ReclaimVerification
import java.lang.Exception

@CapacitorPlugin(name = "ReclaimInAppCapacitorSdk")
class ReclaimInAppCapacitorSdkPlugin : Plugin() {
    companion object {
        const val NAME = "ReclaimInAppCapacitorSdk"
    }

    private val implementation = ReclaimInAppCapacitorSdk()

    private val _applicationContext: Context
        get() = context.applicationContext

    private fun runOnUiThreadQueue(callback: () -> Unit) {
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

        runOnUiThreadQueue {
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
        call.resolve()
    }

    @PluginMethod
    fun setOverrides(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun clearAllOverrides(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun reply(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun replyWithProviderInformation(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun ping(call: PluginCall) {
        val ret = JSObject()
        ret.put("value", implementation.ping())
        call.resolve(ret)
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
