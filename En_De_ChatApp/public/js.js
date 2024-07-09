document.addEventListener("DOMContentLoaded", function () {
    // Function to generate a random prefix
    function generateRandomPrefix() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 16;
        let prefix = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            prefix += characters.charAt(randomIndex)
        }
        return prefix;
    }

    // Function to generate a hashed key
    function generateHashedKey(secretKey) {
        return CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Hex);
    }

    // Encryption
    document.getElementById("encryptButton").addEventListener("click", function () {
        var inputText = document.getElementById("inputTextEncrypt").value;
        var secretKey = "secret key"; // Replace with your actual secret key
        var hashedKey = generateHashedKey(secretKey);
        var randomPrefix = generateRandomPrefix();
        var encryptedMessage = CryptoJS.AES.encrypt(inputText, hashedKey).toString();
        var finalMessage = randomPrefix + ':' + encryptedMessage;
        document.getElementById("resultTextEncrypt").value = finalMessage;
    });

    // Decryption
    document.getElementById("decryptButton").addEventListener("click", function () {
        var inputText = document.getElementById("inputTextDecrypt").value;
        var parts = inputText.split(':');
        var encryptedMessage = parts.slice(1).join(':');
        var secretKey = "secret key"; // Replace with your actual secret key
        var hashedKey = generateHashedKey(secretKey);
        var decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, hashedKey).toString(CryptoJS.enc.Utf8);
        document.getElementById("resultTextDecrypt").value = decryptedMessage;
    });

    // Copy encrypted message
    document.getElementById("copyButtonEncrypt").addEventListener("click", function () {
        var encryptedMessage = document.getElementById("resultTextEncrypt");
        encryptedMessage.select();
        document.execCommand("copy");
        alert("Encrypted message copied to clipboard!");
    });

    // Copy decrypted message
    document.getElementById("copyButtonDecrypt").addEventListener("click", function () {
        var decryptedMessage = document.getElementById("resultTextDecrypt");
        decryptedMessage.select();
        document.execCommand("copy");
        alert("Decrypted message copied to clipboard!");
    });

    // Function to paste text from clipboard into the corresponding textarea
    function pasteText(textareaId) {
        navigator.clipboard.readText().then(text => {
            document.getElementById(textareaId).value = text;
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
            // Show message or tooltip explaining the need for clipboard access
            alert('Please allow clipboard access to paste text.');
        });
    }

    // Function to paste text from clipboard into the corresponding textarea
    function pasteText(textareaId) {
        navigator.clipboard.readText().then(text => {
            document.getElementById(textareaId).value = text;
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
            // Show message or tooltip explaining the need for clipboard access
            alert('Please allow clipboard access to paste text.');
        });
    }

    // Event listeners for Paste buttons
    document.getElementById('pasteButtonEncrypt').addEventListener('click', function () {
        pasteText('inputTextEncrypt');
    });

    document.getElementById('pasteButtonDecrypt').addEventListener('click', function () {
        pasteText('inputTextDecrypt');
    });
});