import { ReclaimVerification } from '@reclaimprotocol/inapp-capacitor-sdk';

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
