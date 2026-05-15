import { ReclaimVerification } from '@reclaimprotocol/inapp-capacitor-sdk';

const reclaimVerification = new ReclaimVerification();

let lastResult = null;

const PLACEHOLDERS = {
    providerId: 'Enter Provider ID',
    jsonConfig: 'Enter JSON Configuration',
    url: 'Enter Verification URL',
};

const LABELS = {
    providerId: 'Provider ID',
    jsonConfig: 'JSON Config',
    url: 'Verification URL',
};

function getMode() {
    return document.getElementById('verificationMode').value;
}

function getInputText() {
    const mode = getMode();
    return mode === 'jsonConfig'
        ? document.getElementById('inputTextArea').value
        : document.getElementById('inputText').value;
}

function setInputText(value) {
    document.getElementById('inputText').value = value;
    document.getElementById('inputTextArea').value = value;
}

function applyModeUi() {
    const mode = getMode();
    const inputLabel = document.getElementById('inputLabel');
    const singleInput = document.getElementById('inputText');
    const textArea = document.getElementById('inputTextArea');

    inputLabel.textContent = LABELS[mode];

    if (mode === 'jsonConfig') {
        singleInput.style.display = 'none';
        textArea.style.display = 'block';
    } else {
        singleInput.style.display = 'block';
        textArea.style.display = 'none';
        singleInput.placeholder = PLACEHOLDERS[mode];
        singleInput.type = mode === 'url' ? 'url' : 'text';
        singleInput.inputMode = mode === 'url' ? 'url' : 'text';
    }
}

function showSnackbar(text) {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = text;
    snackbar.classList.add('show');
    clearTimeout(snackbar._timeout);
    snackbar._timeout = setTimeout(() => snackbar.classList.remove('show'), 2500);
}

function setResult(value) {
    lastResult = value;
    const element = document.getElementById('result');
    element.textContent = value == null ? '' : JSON.stringify(value, null, 2);
}

window.copyResult = async () => {
    if (!lastResult) {
        showSnackbar('No proof to copy');
        return;
    }
    try {
        const text = JSON.stringify(lastResult);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        showSnackbar('Proof copied to clipboard');
    } catch (error) {
        showSnackbar(error instanceof Error ? error.message : 'Failed to copy proof');
    }
};

window.startVerification = async () => {
    const mode = getMode();
    const inputText = getInputText();
    if (!inputText) {
        showSnackbar('Input is required');
        return;
    }

    try {
        // Fetch provider configuration from Reclaim API based on the providerId in the input field.
        // For jsonConfig/url modes, providerId is still used as the provider lookup key.
        const lookupId = mode === 'providerId' ? inputText : (import.meta.env.VITE_DEFAULT_RECLAIM_PROVIDER_ID || inputText);
        const response = await fetch(`https://api.reclaimprotocol.org/api/providers/${lookupId}`);
        const providerConfigRaw = (await response.json()).providers;
        const providerConfig = JSON.stringify(providerConfigRaw);
        console.info({ providerConfig });

        await reclaimVerification.setConsoleLogging(true);

        // Overrides let you change interactions with Reclaim Backend, so that you can use your own
        // logic with your own infrastructure. You can make calls to your own backend to provide
        // information like appInfo, provider info, session info, etc required during the
        // verification process by inappsdk.
        await reclaimVerification.setOverrides({
            logConsumer: {
                canSdkCollectTelemetry: true,
                canSdkPrintLogs: true,
                onLogs: (logJsonString, _) => {
                    console.log('[Reclaim SDK]', logJsonString);
                },
            },
            provider: {
                jsonString: providerConfig,
            },
            appInfo: {
                appName: 'Overriden App',
                appImageUrl: 'https://placehold.co/400x400/png',
            },
            sessionManagement: {
                onLog: (event) => {
                    console.log('[Reclaim Session]', event);
                },
                onSessionCreateRequest: async (event) => {
                    console.log('[Reclaim Session Create]', event);
                    return {
                        sessionId: '00',
                        resolvedProviderVersion: '0.0.0',
                    };
                },
                onSessionUpdateRequest: async (event) => {
                    console.log('[Reclaim Session Update]', event);
                    return true;
                },
            },
            featureOptions: {
                attestorBrowserRpcUrl: 'https://attestor.reclaimprotocol.org:444/browser-rpc',
                // singleReclaimRequest: false,
                // idleTimeThresholdForManualVerificationTrigger: null,
                // sessionTimeoutForManualVerificationTrigger: 180,
                // isAIFlowEnabled: false,
                // claimCreationTimeoutDurationInMins: null,
                // sessionNoActivityTimeoutDurationInMins: null,
                // aiProviderNoActivityTimeoutDurationInSecs: null,
                // pageLoadedCompletedDebounceTimeoutMs: null,
                // potentialLoginTimeoutS: null,
                // screenshotCaptureIntervalSeconds: null,
                // teeUrls: null,
                // privacyPolicyUrl: 'https://reclaimprotocol.org/privacy-policy',
                // termsOfServiceUrl: 'https://reclaimprotocol.org/terms-of-service',
                // potentialFailureReasonsUrl: 'https://reclaimprotocol.org/potential-failure-reasons',
            },
            capabilityAccessToken: import.meta.env.VITE_RECLAIM_CAPABILITY_ACCESS_TOKEN,
        });

        let verificationResult;
        switch (mode) {
            case 'providerId': {
                // If you're overriding sessions and providers, you can use any appId, secret, providerId
                const params = {
                    appId: '00',
                    secret: '00',
                    providerId: '00',
                };
                console.info({ params });
                verificationResult = await reclaimVerification.startVerification(params);
                break;
            }
            case 'jsonConfig':
                verificationResult = await reclaimVerification.startVerificationFromJson(JSON.parse(inputText));
                break;
            case 'url':
                verificationResult = await reclaimVerification.startVerificationFromUrl(inputText);
                break;
        }
        setResult(verificationResult);
    } catch (error) {
        console.info({ verificationError: error });
        if (ReclaimVerification.ReclaimVerificationException.isReclaimVerificationException(error)) {
            switch (error.type) {
                case ReclaimVerification.ExceptionType.Cancelled:
                    showSnackbar('Verification cancelled');
                    break;
                case ReclaimVerification.ExceptionType.Dismissed:
                    showSnackbar('Verification dismissed');
                    break;
                case ReclaimVerification.ExceptionType.SessionExpired:
                    showSnackbar('Verification session expired');
                    break;
                case ReclaimVerification.ExceptionType.Failed:
                default:
                    showSnackbar('Verification failed');
            }
        } else {
            showSnackbar(error instanceof Error ? error.message : 'An unknown verification error occurred');
        }
    }
};

window.ping = async () => {
    try {
        console.log('Pinging');
        const result = await reclaimVerification.ping();
        if (result) {
            showSnackbar('Received ping');
        }
    } catch (error) {
        console.error(error);
        showSnackbar(error instanceof Error ? error.message : 'Ping failed');
    }
};

window.onload = () => {
    setInputText(import.meta.env.VITE_DEFAULT_RECLAIM_PROVIDER_ID || '');

    document.getElementById('verificationMode').addEventListener('change', () => {
        setInputText('');
        applyModeUi();
    });
    applyModeUi();

    reclaimVerification.addEventListener('sessionIdentityUpdate', (event) => {
        console.info({ type: 'ReclaimEvent', name: 'sessionIdentityUpdate', value: event });
    });
};
