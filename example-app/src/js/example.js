import { ReclaimVerification } from '@reclaimprotocol/inapp-capacitor-sdk';

const reclaimVerification = new ReclaimVerification();

let lastResult = null;

const TEE_MAP = {
    auto: null,
    enabled: true,
    disabled: false,
};

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
    const appIdField = document.getElementById('appIdField');
    const secretField = document.getElementById('secretField');

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

    const showAppFields = mode === 'providerId';
    appIdField.style.display = showAppFields ? 'flex' : 'none';
    secretField.style.display = showAppFields ? 'flex' : 'none';
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
        const teeValue = TEE_MAP[document.getElementById('teeMode').value];
        await reclaimVerification.setVerificationOptions({
            useTeeOperator: teeValue,
        });

        let verificationResult;
        switch (mode) {
            case 'providerId': {
                const params = {
                    appId: document.getElementById('appIdInput').value,
                    secret: document.getElementById('secretInput').value,
                    providerId: inputText,
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
    const setElementValue = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value || '';
        }
    };
    setElementValue('appIdInput', import.meta.env.VITE_RECLAIM_APP_ID);
    setElementValue('secretInput', import.meta.env.VITE_RECLAIM_APP_SECRET);
    setInputText(import.meta.env.VITE_DEFAULT_RECLAIM_PROVIDER_ID || '');

    document.getElementById('verificationMode').addEventListener('change', () => {
        setInputText('');
        applyModeUi();
    });
    applyModeUi();

    reclaimVerification.addEventListener('sessionIdentityUpdate', (event) => {
        console.info({ type: 'ReclaimEvent', name: 'sessionIdentityUpdate', value: event });
    });

    reclaimVerification.setOverrides({
        logConsumer: {
            onLogs: (log, _) => {
                const entry = reclaimVerification.parseLog(log);
                if (entry.eventType) {
                    console.info('[EVENT] ', entry);
                } else {
                    console.info(entry);
                }
            },
        },
        capabilityAccessToken: import.meta.env.VITE_RECLAIM_CAPABILITY_ACCESS_TOKEN,
    });
};
