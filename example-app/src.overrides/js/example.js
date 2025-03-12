import { ReclaimVerification } from '@reclaimprotocol/inapp-capacitor-sdk';

window.setOverrides = async () => {
    try {
        const sdk = new ReclaimVerification();

        // Advanced Usage: Use ReclaimVerification.setOverrides for overriding sdk
        await sdk.setOverrides({
            provider: {
                callback: async () => {
                    // With a response from an HTTP call
                    // const response = await fetch(`https://api.reclaimprotocol.org/api/providers/${providerId}`);
                    // const responseJson =  await response.json();
                    // return JSON.stringify(responseJson.providers);
                    // Or with a constant json string
                    return JSON.stringify({
                        "id": "669eca16d7e0758c94dfc03f",
                        // originally from "6d3f6753-7ee6-49ee-a545-62f1b1822ae5",
                        "httpProviderId": providerId,
                        "name": "GitHub UserName",
                        "description": "Prove your GitHub User Name",
                        "logoUrl": "https://devtool-images.s3.ap-south-1.amazonaws.com/http-provider-brand-logos/github.com-11eb32e1-9f3f-4c00-9404-3ed088aa096b.png",
                        "url": "https://github.com/settings/profile",
                        "urlType": "TEMPLATE",
                        "method": "GET",
                        "providerType": "PUBLIC",
                        "body": null,
                        "loginUrl": "https://github.com/settings/profile",
                        "isActive": true,
                        "responseSelections": [
                            {
                                "jsonPath": "",
                                "xPath": "",
                                "responseMatch": "\u003Cspan class=\"color-fg-muted\"\u003E({{username}})\u003C/span\u003E",
                                "matchType": "greedy",
                                "invert": false,
                                "description": "",
                                "hash": ""
                            }
                        ],
                        "creatorUid": "WzFfhAtvUBfgJ372Bvw788nX04y1",
                        "applicationId": [],
                        "sessionId": [],
                        "customInjection": "",
                        "bodySniff": {
                            "enabled": false,
                            "template": ""
                        },
                        "userAgent": {
                            "ios": "",
                            "android": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.69 Mobile Safari/537.36"
                        },
                        "isApproved": true,
                        "geoLocation": "",
                        "proofCardText": "Owns data: {{username}}",
                        "proofCardTitle": "github.com",
                        "matchType": "greedy",
                        "sampleIntegration": false,
                        "isVerified": true,
                        "injectionType": "MSWJS",
                        "disableRequestReplay": false,
                        "providerHash": "0x7549f801c37c46eb1ca2f5b95214527868a59505a9ed558572508b497a6a69a7",
                        "additionalClientOptions": null,
                        "verificationType": "WITNESS",
                        "expectedPageUrl": "https://github.com",
                        "pageTitle": null,
                        "stepsToFollow": null,
                        "usedInCount": 381,
                        "overseerUid": null,
                        "overseerNote": null,
                        "requestData": [
                            {
                                "url": "https://github.com/settings/profile",
                                "expectedPageUrl": null,
                                "urlType": "TEMPLATE",
                                "method": "GET",
                                "responseMatches": [
                                    {
                                        "value": "\u003Cspan class=\"color-fg-muted\"\u003E({{username}})\u003C/span\u003E",
                                        "type": "contains",
                                        "invert": false,
                                        "description": null
                                    }
                                ],
                                "responseRedactions": [
                                    {
                                        "xPath": "",
                                        "jsonPath": "",
                                        "regex": "\u003Cspan class=\"color-fg-muted\"\u003E\\((.*)\\)\u003C/span\u003E",
                                        "hash": ""
                                    }
                                ],
                                "bodySniff": {
                                    "enabled": false,
                                    "template": ""
                                },
                                "requestHash": "0x7549f801c37c46eb1ca2f5b95214527868a59505a9ed558572508b497a6a69a7"
                            }
                        ],
                        "useIncognitoWebview": false
                    });
                },
            },
            logConsumer: {
                canSdkCollectTelemetry: false,
                canSdkPrintLogs: false,
                onLogs: (logJsonString, _) => {
                    console.log({ "reclaim.logs": logJsonString });
                },
            },
            appInfo: {
                appName: "Overriden Example",
                appImageUrl: "https://placehold.co/400x400/png"
            },
            featureOptions: {
                cookiePersist: null,
                singleReclaimRequest: false,
                idleTimeThresholdForManualVerificationTrigger: 2,
                sessionTimeoutForManualVerificationTrigger: 180,
                attestorBrowserRpcUrl: 'https://attestor.reclaimprotocol.org/browser-rpc',
                isResponseRedactionRegexEscapingEnabled: false,
                isAIFlowEnabled: false,
            },
            sessionManagement: {
                onLog: (event) => {
                    console.log({ "reclaim.session.log": event });
                },
                onSessionCreateRequest: async (event) => {
                    console.log({ "reclaim.session.createRequest": event });
                    return true;
                },
                onSessionUpdateRequest: async (event) => {
                    console.log({ "reclaim.session.updateRequest": event });
                    return true;
                },
            },
            capabilityAccessToken: import.meta.env.VITE_RECLAIM_CAPABILITY_ACCESS_TOKEN,
        });
        console.info('Overrides set');
    } catch (error) {
        console.error({
            reason: 'reason' in error ? error.reason : 'no details',
            error,
        });
    }
}

window.clearAllOverrides = async () => {
    try {
        const sdk = new ReclaimVerification();

        await sdk.clearAllOverrides();
        console.info('All overrides cleared');
    } catch (error) {
        console.error(error);
    }
}

window.startVerification = async () => {
    const resultElement = document.getElementById("result");
    try {
        console.log('Verification starting');
        const sdk = new ReclaimVerification();

        const proof = await sdk.startVerification({
            appId: document.getElementById("appIdInput").value,
            secret: document.getElementById("secretInput").value,
            providerId: document.getElementById("providerIdInput").value
        });
        console.log('Verification completed. Proof:', proof);
        resultElement.innerHTML = JSON.stringify(proof);
    } catch (error) {
        console.warn('Error starting verification', error);
        resultElement.innerHTML = JSON.stringify(error);
    }
}

window.ping = async () => {
    const resultElement = document.getElementById("result");
    try {
        console.log('Pinging');
        const sdk = new ReclaimVerification();

        const result = await sdk.ping();
        console.log('Ping completed. Result:', result);
        resultElement.innerHTML = JSON.stringify(result);
    } catch (error) {
        console.warn('Error pinging', error);
        resultElement.innerHTML = JSON.stringify(error);
    }
}

window.onload = () => {
    const setElementValue = (id, value) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id ${id} not found`);
        } else {
            element.value = value;
        }
    }
    setElementValue("appIdInput", import.meta.env.VITE_RECLAIM_APP_ID);
    setElementValue("secretInput", import.meta.env.VITE_RECLAIM_APP_SECRET);
    setElementValue("providerIdInput", import.meta.env.VITE_DEFAULT_RECLAIM_PROVIDER_ID);
}
