 // Tab Navigation
        function showTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            document.getElementById(`${tabId}-content`).classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            document.getElementById(`${tabId}-tab`).setAttribute('aria-selected', 'true');
        }

        // LockIt JavaScript
        let lockitLogEntries = [];
        let lockitHasShownKeyWarning = false;
        let lockitMode = 'text';
        let lockitFileMode = 'standard'; // Tracks file mode (standard or large)

        function lockitAddLog(message) {
            const timestamp = new Date().toISOString();
            lockitLogEntries.push(`[${timestamp}] ${message}`);
            lockitUpdateLogDisplay();
        }

        function lockitUpdateLogDisplay() {
            const logElement = document.getElementById('lockit-log');
            if (logElement) logElement.innerText = lockitLogEntries.join('\n');
        }

        function lockitToggleLog() {
            const logElement = document.getElementById('lockit-log');
            logElement.style.display = logElement.style.display === 'none' ? 'block' : 'none';
            lockitAddLog(`Log display ${logElement.style.display === 'none' ? 'hidden' : 'shown'}`);
        }

        function lockitTruncate(str) {
            return str && typeof str === 'string' ? (str.length > 3 ? str.slice(0, 3) + '...' : str) : 'null';
        }

        async function lockitComputeHash(str) {
            const buffer = new TextEncoder().encode(str);
            const hash = await crypto.subtle.digest('SHA-256', buffer);
            return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        }

        function downloadPage() {
            const htmlContent = document.documentElement.outerHTML;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lockit-timeseed-v1_13.html';
            a.click();
            URL.revokeObjectURL(url);
            lockitAddLog('Page downloaded');
        }

        function lockitGenerateKey() {
            const words = ['apple', 'bread', 'cloud', 'dream', 'eagle', 'flame', 'grape', 'house', 'boom', 'kaas', 'licht', 'regen', 'ster', 'vogel', 'wind', 'zon', 'quixy', 'zavox', 'loren', 'sythe', 'krill', 'vynix', 'thryme', 'glynt', 'satoshi', 'bitcoin', 'vole', 'war', 'axis', 'river', 'mountain', 'forest', 'stone', 'sand', 'ocean', 'wave', 'shell', 'tree', 'leaf', 'branch', 'root', 'flower', 'seed', 'fruit', 'berry', 'pine', 'oak', 'maple', 'birch', 'willow', 'cedar', 'moss', 'fern', 'grass', 'field', 'meadow', 'hill', 'valley', 'plain', 'desert', 'dune', 'canyon', 'cave', 'cliff', 'peak', 'summit', 'glacier', 'frost', 'snow', 'ice', 'hail', 'storm', 'rain', 'cloudburst', 'mist', 'fog', 'dew', 'sun', 'moon', 'star', 'planet', 'comet', 'meteor', 'galaxy', 'cosmos', 'space', 'rocket', 'orbit', 'satellite', 'probe', 'signal', 'code', 'byte', 'bit', 'hash', 'block', 'chain', 'node', 'wallet', 'miner', 'ledger', 'fork', 'token', 'coin', 'vault', 'key', 'lock', 'safe', 'trust', 'proof', 'stake', 'pool', 'trade', 'market', 'price', 'chart', 'bull', 'bear', 'pump', 'whale', 'shrimp', 'crab', 'fox', 'wolf', 'lynx', 'mole', 'hawk', 'dove', 'crow', 'magpie', 'sparrow', 'robin', 'lark', 'finch', 'wren', 'owl', 'bat'];
            const maxLength = 48;
            const getRandomWord = () => words[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * words.length)];
            const selectedWords = Array.from({ length: 6 }, getRandomWord);
            const wordPart = selectedWords.join('-');
            const wordLength = wordPart.length;
            const remainingLength = maxLength - wordLength - 1;
            const getRandomNumber = () => Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * 9999) + 1;
            let numbers = Array.from({ length: 4 }, getRandomNumber);
            let numberPart = numbers.join('');
            if (wordLength + 1 + numberPart.length > maxLength) {
                const maxDigitsPerNumber = Math.floor(remainingLength / 4);
                if (maxDigitsPerNumber >= 1) {
                    numbers = Array.from({ length: 4 }, () => Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * Math.pow(10, maxDigitsPerNumber)) + 1);
                    numberPart = numbers.join('');
                } else {
                    numberPart = numbers.slice(0, remainingLength).join('');
                }
            }
            let key = `${wordPart}-${numberPart}`;
            if (key.length > maxLength) {
                numberPart = numberPart.slice(0, maxLength - wordLength - 1);
                key = `${wordPart}-${numberPart}`;
            }
            const keyInput = document.getElementById('lockit-key');
            if (keyInput) {
                keyInput.value = key;
                lockitAddLog(`Generated key: ${lockitTruncate(key)}`);
            }
        }

        function lockitStrToArrayBuffer(str) {
            return new TextEncoder().encode(str);
        }

        function lockitArrayBufferToHex(buffer) {
            return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        }

        function lockitHexToArrayBuffer(hex) {
            if (hex.length % 2 !== 0) throw new Error('Invalid hex string');
            return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer;
        }

        async function lockitDeriveKey(password, salt) {
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                lockitStrToArrayBuffer(password),
                'PBKDF2',
                false,
                ['deriveBits', 'deriveKey']
            );
            return await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 1000000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                true,
                ['encrypt', 'decrypt']
            );
        }

        async function lockitDeriveKeyCTR(password, salt) {
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                lockitStrToArrayBuffer(password),
                'PBKDF2',
                false,
                ['deriveKey']
            );
            return crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-CTR', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
        }

        function toRadix64(buffer) {
            lockitAddLog('Starting Radix64 conversion for ' + buffer.byteLength + ' bytes');
            const CHUNK_SIZE = 76800;
            const base64Chunks = [];
            const uint8 = new Uint8Array(buffer);

            for (let i = 0; i < uint8.length; i += CHUNK_SIZE) {
                const chunk = uint8.subarray(i, Math.min(i + CHUNK_SIZE, uint8.length));
                const binary = String.fromCharCode(...chunk);
                try {
                    const base64 = btoa(binary).replace(/[^A-Za-z0-9+/=]/g, '');
                    base64Chunks.push(base64);
                    lockitAddLog(`Encoded chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(uint8.length / CHUNK_SIZE)}`);
                } catch (e) {
                    lockitAddLog(`btoa error in chunk ${i / CHUNK_SIZE + 1}: ${e.message}`);
                    throw new Error(`Failed to encode chunk: ${e.message}`);
                }
            }

            const combinedBase64 = base64Chunks.join('');
            if (!/^[A-Za-z0-9+/=]+$/.test(combinedBase64)) {
                lockitAddLog('Invalid Base64 characters in combined output');
                throw new Error('Invalid Base64 output generated');
            }
            const linedBase64 = combinedBase64.match(/.{1,64}/g).join('\n');
            lockitAddLog('Completed Radix64 conversion, output length: ' + linedBase64.length);
            return linedBase64;
        }

        function fromRadix64(str) {
            lockitAddLog('Starting Radix64 decoding, input length: ' + str.length);
            let base64 = str
                .replace(/\r\n/g, '\n')
                .replace(/-----BEGIN TIMESEED CYPHER-----[\s\S]*?Version: TimeSeed v\d+\.\d+\s*\n/, '')
                .replace(/\n=[\w+/=]{4}\n-----END TIMESEED CYPHER-----\s*$/, '')
                .replace(/[\n\r\s]+/g, '');
            lockitAddLog('Cleaned Base64 string, length: ' + base64.length);

            lockitAddLog(`Base64 start: ${base64.slice(0, 50)}`);
            lockitAddLog(`Base64 end: ${base64.slice(-50)}`);

            const invalidChars = base64.match(/[^A-Za-z0-9+/=]/g);
            if (invalidChars) {
                lockitAddLog(`Invalid Base64 characters detected: ${invalidChars.join('').slice(0, 50)}`);
                throw new Error(`Invalid Base64 string: Contains ${invalidChars.length} non-Base64 characters`);
            }
            if (!/^[A-Za-z0-9+/=]+$/.test(base64)) {
                lockitAddLog('Invalid Base64 characters detected after validation');
                throw new Error('Invalid Base64 string: Contains non-Base64 characters');
            }
            if (base64.length % 4 !== 0) {
                lockitAddLog('Invalid Base64 length: ' + base64.length);
                throw new Error('Invalid Base64 string: Length must be divisible by 4');
            }

            const CHUNK_SIZE = 76800;
            const totalBytes = Math.ceil((base64.length / 4) * 3);
            const byteArray = new Uint8Array(totalBytes);
            let byteOffset = 0;
            let chunkCount = Math.ceil(base64.length / CHUNK_SIZE);

            for (let i = 0; i < base64.length; i += CHUNK_SIZE) {
                const chunk = base64.slice(i, Math.min(i + CHUNK_SIZE, base64.length));
                if (chunk.length % 4 !== 0) {
                    lockitAddLog(`Invalid chunk length at chunk ${i / CHUNK_SIZE + 1}: ${chunk.length}`);
                    throw new Error(`Invalid Base64 chunk length: ${chunk.length}`);
                }
                try {
                    const binary = atob(chunk);
                    const chunkBytes = new Uint8Array(binary.length);
                    for (let j = 0; j < binary.length; j++) {
                        chunkBytes[j] = binary.charCodeAt(j);
                    }
                    byteArray.set(chunkBytes, byteOffset);
                    byteOffset += chunkBytes.length;
                    lockitAddLog(`Decoded Base64 chunk ${i / CHUNK_SIZE + 1} of ${chunkCount}, bytes: ${chunkBytes.length}`);
                } catch (e) {
                    lockitAddLog(`atob error in chunk ${i / CHUNK_SIZE + 1}: ${e.message}`);
                    throw new Error(`Failed to decode Base64 chunk: ${e.message}`);
                }
            }

            const finalArray = byteArray.slice(0, byteOffset);
            lockitAddLog('Converted to Uint8Array, length: ' + finalArray.length);
            return finalArray.buffer;
        }

        function lockitSetLockIcon(isEncrypted) {
            const lockIcon = document.getElementById('lockit-lockIcon');
            if (lockIcon) {
                lockIcon.innerHTML = isEncrypted ? '🔒' : '🔓';
                lockitAddLog(`Set lock icon to ${isEncrypted ? 'encrypted' : 'decrypted'}`);
            } else {
                lockitAddLog('Warning: #lockit-lockIcon element not found');
            }
        }

        function lockitIsLikelyEncrypted(text) {
            if (!text || typeof text !== 'string') {
                return false;
            }
            if (text.length < 88 || text.length % 2 !== 0) {
                return false;
            }
            const isHex = /^[0-9a-fA-F]+$/.test(text);
            lockitAddLog(`Checked text for encryption: ${lockitTruncate(text)}, isHex=${isHex}, length=${text.length}`);
            return isHex;
        }

        function calculateCRC24(data) {
            const crc24Poly = 0x864CFB;
            let crc = 0xB704CE;
            for (const byte of new Uint8Array(data)) {
                crc ^= byte << 16;
                for (let i = 0; i < 8; i++) {
                    crc <<= 1;
                    if (crc & 0x1000000) crc ^= crc24Poly;
                }
            }
            crc &= 0xFFFFFF;
            const bytes = new Uint8Array(3);
            bytes[0] = (crc >> 16) & 0xFF;
            bytes[1] = (crc >> 8) & 0xFF;
            bytes[2] = crc & 0xFF;
            return toRadix64(bytes).replace(/\n/g, '').padEnd(4, '=');
        }

        function createPacket(tag, data) {
            const dataLength = data.length;
            const packet = new Uint8Array(5 + dataLength);
            packet[0] = tag;
            packet[1] = (dataLength >> 24) & 0xFF;
            packet[2] = (dataLength >> 16) & 0xFF;
            packet[3] = (dataLength >> 8) & 0xFF;
            packet[4] = dataLength & 0xFF;
            packet.set(data, 5);
            lockitAddLog(`Created packet: tag=${tag}, length=${dataLength}`);
            return packet;
        }

        async function lockitCheckFileMode(file) {
            const MAGIC_NUMBER = new TextEncoder().encode('TSLG');
            const HEADER_CHECK_SIZE = 4;
            try {
                const header = await lockitReadChunk(file, 0, HEADER_CHECK_SIZE);
                if (header.length >= HEADER_CHECK_SIZE && 
                    header[0] === MAGIC_NUMBER[0] && 
                    header[1] === MAGIC_NUMBER[1] && 
                    header[2] === MAGIC_NUMBER[2] && 
                    header[3] === MAGIC_NUMBER[3]) {
                    lockitAddLog(`Detected large mode via header: TSLG`);
                    return 'large';
                }
                const text = await file.slice(0, Math.min(file.size, 100)).text();
                if (/^-----BEGIN TIMESEED CYPHER-----/.test(text)) {
                    lockitAddLog(`Detected standard mode via header: BEGIN TIMESEED CYPHER`);
                    return 'standard';
                }
                const mode = file.size > 10 * 1024 * 1024 ? 'large' : 'standard';
                lockitAddLog(`No recognizable header, falling back to size-based detection: ${mode} (size: ${file.size} bytes)`);
                return mode;
            } catch (e) {
                lockitAddLog(`Error checking file header: ${e.message}`);
                const mode = file.size > 10 * 1024 * 1024 ? 'large' : 'standard';
                lockitAddLog(`Falling back to size-based detection due to error: ${mode}`);
                return mode;
            }
        }

        function lockitSwitchMode(mode) {
            lockitAddLog(`lockitSwitchMode called with mode: ${mode}`);
            if (mode !== 'text' && mode !== 'file') {
                lockitAddLog(`Error: Invalid mode ${mode}`);
                return;
            }
            lockitMode = mode;
            const textInput = document.getElementById('lockit-text-input');
            const fileInput = document.getElementById('lockit-file-input');
            const fileInputElement = document.getElementById('lockit-fileInput');
            const fileButton = document.getElementById('lockit-fileButton');
            const inputTextElement = document.getElementById('lockit-inputText');
            const toggleInput = document.getElementById('lockit-input-toggle');

            if (!textInput || !fileInput || !fileInputElement || !fileButton || !inputTextElement) {
                lockitAddLog('Error: One or more UI elements missing in lockitSwitchMode');
                return;
            }

            textInput.classList.toggle('active', mode === 'text');
            fileInput.classList.toggle('active', mode === 'file');
            fileInputElement.disabled = mode !== 'file';
            fileInputElement.classList.toggle('disabled', mode !== 'file');
            fileButton.disabled = mode !== 'file';
            fileButton.classList.toggle('disabled', mode !== 'file');
            inputTextElement.disabled = mode !== 'file';
            inputTextElement.classList.toggle('disabled', mode !== 'text');
            inputTextElement.value = '';
            fileInputElement.value = '';
            document.getElementById('lockit-output').value = '';
            document.getElementById('lockit-fileStatus').textContent = 'No file selected';
            document.getElementById('lockit-fileProgress').classList.add('hidden');
            lockitFileMode = 'standard';
            toggleInput.setAttribute('aria-label', `Switch to ${mode === 'text' ? 'file' : 'text'} mode`);
            lockitUpdateUI();
            lockitAddLog(`Switched to ${mode} mode successfully`);
        }

        async function lockitUpdateUI() {
            const inputTextElement = document.getElementById('lockit-inputText');
            const fileInputElement = document.getElementById('lockit-fileInput');
            const statusDiv = document.getElementById(lockitMode === 'text' ? 'lockit-inputStatus' : 'lockit-fileStatus');
            const encryptButton = document.querySelector('.encode-btn[onclick="lockitEncrypt()"]');
            const decryptButton = document.querySelector('.decode-btn[onclick="lockitDecrypt()"]');
            if (!statusDiv || !encryptButton || !decryptButton) {
                lockitAddLog('Error: UI elements missing');
                return;
            }
            if (lockitMode === 'text') {
                const inputText = inputTextElement.value.trim();
                const isEncrypted = lockitIsLikelyEncrypted(inputText);
                encryptButton.disabled = isEncrypted;
                decryptButton.disabled = !isEncrypted;
                statusDiv.textContent = isEncrypted ? 'Detected: Encoded text' : 'Detected: Plain text';
                statusDiv.style.color = isEncrypted ? '#10B981' : '#0D9488';
            } else {
                const file = fileInputElement.files[0];
                if (file) {
                    const isEncrypted = file.name.endsWith('.tsx');
                    lockitFileMode = await lockitCheckFileMode(file);
                    encryptButton.disabled = isEncrypted;
                    decryptButton.disabled = !isEncrypted;
                    statusDiv.textContent = isEncrypted 
                        ? `Detected: Encoded file (${file.name}, ${lockitFileMode === 'large' ? 'Large' : 'Standard'})`
                        : `Detected: Plain file (${file.name}, ${lockitFileMode === 'large' ? 'Large' : 'Standard'})`;
                    statusDiv.style.color = isEncrypted ? '#10B981' : '#0D9488';
                    lockitAddLog(`File mode set to ${lockitFileMode} for ${file.name}`);
                } else {
                    encryptButton.disabled = true;
                    decryptButton.disabled = true;
                    statusDiv.textContent = 'No file selected';
                    statusDiv.style.color = '#D1D5DB';
                    lockitFileMode = 'standard';
                }
            }
        }

        function lockitReadFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsArrayBuffer(file);
            });
        }

        async function lockitEncryptFile(file, password) {
            const progressBar = document.getElementById('lockit-progressBar');
            const progressContainer = document.getElementById('lockit-fileProgress');
            progressContainer.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';

            try {
                if (lockitFileMode === 'standard' && file.size > 10 * 1024 * 1024) {
                    throw new Error('File exceeds 10 MB limit for Standard mode.');
                }
                lockitAddLog(`Starting encryption for file: ${file.name}, size: ${file.size} bytes, mode: ${lockitFileMode}`);

                if (lockitFileMode === 'large') {
                    return await lockitEncryptFileCTR(file, password);
                }

                const fileData = await lockitReadFile(file);
                lockitAddLog('File read completed');
                progressBar.style.width = '20%';
                progressBar.textContent = '20%';

                const sessionKey = crypto.getRandomValues(new Uint8Array(32));
                const salt = crypto.getRandomValues(new Uint8Array(16));
                const iv = crypto.getRandomValues(new Uint8Array(12));
                lockitAddLog('Generated session key, salt, and IV');
                progressBar.style.width = '40%';
                progressBar.textContent = '40%';

                const sessionKeyCryptoKey = await crypto.subtle.importKey(
                    'raw',
                    sessionKey,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt']
                );
                const key = await lockitDeriveKey(password, salt);
                lockitAddLog('Imported session key and derived encryption key');

                const sessionKeyIV = crypto.getRandomValues(new Uint8Array(12));
                const encryptedSessionKey = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv: sessionKeyIV, tagLength: 128 },
                    key,
                    sessionKey
                );
                lockitAddLog('Encrypted session key');
                progressBar.style.width = '60%';
                progressBar.textContent = '60%';

                const encryptedFile = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv: iv, tagLength: 128 },
                    sessionKeyCryptoKey,
                    fileData
                );
                lockitAddLog('Encrypted file data');
                const encryptedArray = new Uint8Array(encryptedFile);
                const ciphertext = encryptedArray.slice(0, -16);
                const authTag = encryptedArray.slice(-16);
                lockitAddLog('Separated ciphertext and auth tag');
                progressBar.style.width = '80%';
                progressBar.textContent = '80%';

                const filename = file.name.split('.').slice(0, -1).join('.').replace(/[^A-Za-z0-9_-]/g, '') || 'file';
                const extension = file.name.split('.').pop() || '';
                const filenameBuffer = new TextEncoder().encode(filename);
                const extensionBuffer = new TextEncoder().encode(extension);
                const filenameLength = new Uint8Array([filenameBuffer.length]);
                const extensionLength = new Uint8Array([extensionBuffer.length]);
                lockitAddLog('Prepared filename and extension buffers');

                const sessionKeyPacketData = new Uint8Array(16 + 12 + encryptedSessionKey.byteLength);
                sessionKeyPacketData.set(salt, 0);
                sessionKeyPacketData.set(sessionKeyIV, 16);
                sessionKeyPacketData.set(new Uint8Array(encryptedSessionKey), 28);
                const sessionKeyPacket = createPacket(1, sessionKeyPacketData);

                const encryptedDataPacketData = new Uint8Array(
                    1 + filenameBuffer.length + 1 + extensionBuffer.length + 12 + ciphertext.length + 16
                );
                let offset = 0;
                encryptedDataPacketData.set(filenameLength, offset); offset += 1;
                encryptedDataPacketData.set(filenameBuffer, offset); offset += filenameBuffer.length;
                encryptedDataPacketData.set(extensionLength, offset); offset += 1;
                encryptedDataPacketData.set(extensionBuffer, offset); offset += extensionBuffer.length;
                encryptedDataPacketData.set(iv, offset); offset += 12;
                encryptedDataPacketData.set(ciphertext, offset); offset += ciphertext.length;
                encryptedDataPacketData.set(authTag, offset);
                const encryptedDataPacket = createPacket(2, encryptedDataPacketData);
                lockitAddLog('Created session key and encrypted data packets');

                const combinedData = new Uint8Array(sessionKeyPacket.length + encryptedDataPacket.length);
                combinedData.set(sessionKeyPacket, 0);
                combinedData.set(encryptedDataPacket, sessionKeyPacket.length);
                lockitAddLog('Combined packets');
                const radix64String = toRadix64(combinedData);
                const crc24 = calculateCRC24(combinedData);
                lockitAddLog('Generated Radix64 string and CRC24');

                const asciiOutput = `-----BEGIN TIMESEED CYPHER-----\nVersion: TimeSeed v1.13\n\n${radix64String}\n=${crc24}\n-----END TIMESEED CYPHER-----\n`;

                const blob = new Blob([asciiOutput], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename}.tsx`;
                a.click();
                URL.revokeObjectURL(url);

                progressBar.style.width = '100%';
                progressBar.textContent = '100%';
                lockitAddLog(`Encrypted file: ${filename}.tsx`);
                return true;
            } catch (e) {
                lockitAddLog(`Encode error: ${e.message}, stack: ${e.stack}`);
                throw e;
            } finally {
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                }, 1000);
            }
        }

        async function lockitDecryptFile(file, password) {
            const progressBar = document.getElementById('lockit-progressBar');
            const progressContainer = document.getElementById('lockit-fileProgress');
            progressContainer.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';

            try {
                lockitFileMode = await lockitCheckFileMode(file);
                lockitAddLog(`Starting decryption for file: ${file.name}, size: ${file.size} bytes, mode: ${lockitFileMode}`);

                if (lockitFileMode === 'large') {
                    return await lockitDecryptFileCTR(file, password);
                }

                if (file.size > 15 * 1024 * 1024) {
                    throw new Error('File exceeds 15MB limit for Standard mode.');
                }

                const text = await file.text();
                const trimmedText = text.trim();
                progressBar.style.width = '20%';
                progressBar.textContent = '20%';

                const headerRegex = /^-----BEGIN TIMESEED CYPHER-----\s*/m;
                const footerRegex = /-----END TIMESEED CYPHER-----\s*$/m;
                if (!headerRegex.test(trimmedText) || !footerRegex.test(trimmedText)) {
                    throw new Error('Invalid TIMESEED file format');
                }
                const lines = trimmedText.split('\n');
                const dataLines = [];
                let crc = null;
                for (const line of lines) {
                    if (line.startsWith('-----') || line.startsWith('Version:') || line.trim() === '') {
                        continue;
                    }
                    if (line.startsWith('=')) {
                        crc = line.slice(1);
                        continue;
                    }
                    dataLines.push(line);
                }
                const radix64Data = dataLines.join('');
                if (!crc || !/^[A-Za-z0-9+/=]{4}$/.test(crc)) {
                    throw new Error('Missing or invalid CRC checksum');
                }
                const expectedCRC = crc;

                const combinedDataBuffer = fromRadix64(radix64Data);
                const combinedData = new Uint8Array(combinedDataBuffer);
                progressBar.style.width = '40%';
                progressBar.textContent = '40%';

                const calculatedCRC = calculateCRC24(combinedDataBuffer);
                if (calculatedCRC !== expectedCRC) {
                    throw new Error('CRC verification failed');
                }

                let offset = 0;
                const packets = [];
                while (offset < combinedData.length) {
                    if (offset + 5 > combinedData.length) {
                        throw new Error('Invalid packet: Incomplete header');
                    }
                    const tag = combinedData[offset++];
                    let length = (combinedData[offset++] << 24) | (combinedData[offset++] << 16) |
                                 (combinedData[offset++] << 8) | combinedData[offset++];
                    if (length < 0 || offset + length > combinedData.length) {
                        throw new Error('Invalid packet: Length exceeds data');
                    }
                    const data = combinedData.slice(offset, offset + length);
                    packets.push({ tag, data });
                    offset += length;
                }

                let sessionKey, salt, filename, extension, ciphertext, iv, authTag, sessionKeyIV;
                for (const packet of packets) {
                    if (packet.tag === 1) {
                        if (packet.data.length < 28) {
                            throw new Error('Invalid session key packet: Too short');
                        }
                        salt = packet.data.slice(0, 16);
                        sessionKeyIV = packet.data.slice(16, 28);
                        const encryptedSessionKey = packet.data.slice(28);
                        const key = await lockitDeriveKey(password, salt);
                        progressBar.style.width = '60%';
                        progressBar.textContent = '60%';
                        try {
                            sessionKey = await crypto.subtle.decrypt(
                                { name: 'AES-GCM', iv: sessionKeyIV, tagLength: 128 },
                                key,
                                encryptedSessionKey
                            );
                            sessionKey = new Uint8Array(sessionKey);
                        } catch (e) {
                            throw new Error('Failed to decrypt session key: Invalid key or corrupted data');
                        }
                    } else if (packet.tag === 2) {
                        let dataOffset = 0;
                        if (dataOffset >= packet.data.length) {
                            throw new Error('Invalid packet: No data');
                        }
                        const filenameLength = packet.data[dataOffset++];
                        if (dataOffset + filenameLength > packet.data.length || filenameLength > 255) {
                            throw new Error('Invalid packet: Filename length exceeds data');
                        }
                        filename = new TextDecoder().decode(packet.data.slice(dataOffset, dataOffset + filenameLength));
                        dataOffset += filenameLength;
                        const extensionLength = packet.data[dataOffset++];
                        if (dataOffset + extensionLength > packet.data.length || extensionLength > 255) {
                            throw new Error('Invalid packet: Extension length exceeds data');
                        }
                        extension = new TextDecoder().decode(packet.data.slice(dataOffset, dataOffset + extensionLength));
                        dataOffset += extensionLength;
                        if (dataOffset + 12 > packet.data.length) {
                            throw new Error('Invalid packet: Missing IV');
                        }
                        iv = packet.data.slice(dataOffset, dataOffset + 12);
                        dataOffset += 12;
                        if (dataOffset + 16 > packet.data.length) {
                            throw new Error('Invalid packet: Missing authentication tag');
                        }
                        authTag = packet.data.slice(packet.data.length - 16);
                        ciphertext = packet.data.slice(dataOffset, packet.data.length - 16);
                    }
                }
                if (!sessionKey || !ciphertext || !iv || !authTag) {
                    throw new Error('Missing required packet data');
                }
                progressBar.style.width = '80%';
                progressBar.textContent = '80%';

                const sessionKeyCryptoKey = await crypto.subtle.importKey(
                    'raw',
                    sessionKey,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['decrypt']
                );

                const encryptedData = new Uint8Array([...ciphertext, ...authTag]);
                const decryptedData = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv: iv, tagLength: 128 },
                    sessionKeyCryptoKey,
                    encryptedData
                );
                progressBar.style.width = '100%';
                progressBar.textContent = '100%';

                const blob = new Blob([decryptedData], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const outputFilename = extension ? `${filename}.${extension}` : filename;
                a.href = url;
                a.download = outputFilename;
                a.click();
                URL.revokeObjectURL(url);

                lockitAddLog(`Decrypted file: ${outputFilename}`);
                return true;
            } catch (e) {
                lockitAddLog(`Decode error: ${e.message}`);
                throw e;
            } finally {
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                }, 1000);
            }
        }

        async function lockitEncryptFileCTR(file, password) {
            const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
            const MAGIC_NUMBER = new TextEncoder().encode('TSLG');
            const SALT_SIZE = 16;
            const IV_SIZE = 16;
            const EXTENSION_LENGTH_SIZE = 1;
            const MAX_EXTENSION_LENGTH = 255;
            const progressBar = document.getElementById('lockit-progressBar');
            const progressContainer = document.getElementById('lockit-fileProgress');
            progressContainer.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';

            try {
                lockitAddLog(`Starting large file encryption (AES-CTR) for file: ${file.name}, size: ${file.size} bytes`);
                const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
                const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));
                const extension = file.name.split('.').pop() || '';
                const extensionBuffer = new TextEncoder().encode(extension.slice(0, MAX_EXTENSION_LENGTH));
                const extensionLength = new Uint8Array([extensionBuffer.length]);
                const key = await lockitDeriveKeyCTR(password, salt);
                const header = new Uint8Array(MAGIC_NUMBER.length + SALT_SIZE + IV_SIZE + EXTENSION_LENGTH_SIZE + extensionBuffer.length);
                let offset = 0;
                header.set(MAGIC_NUMBER, offset); offset += MAGIC_NUMBER.length;
                header.set(salt, offset); offset += SALT_SIZE;
                header.set(iv, offset); offset += IV_SIZE;
                header.set(extensionLength, offset); offset += EXTENSION_LENGTH_SIZE;
                header.set(extensionBuffer, offset);
                lockitAddLog(`Created header with magic number TSLG, salt, IV, and extension: ${extension}`);
                const encryptedChunks = [];
                offset = 0;
                const totalSize = file.size;
                const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
                let lastUpdate = 0;
                const UPDATE_INTERVAL = 100; // Update every 100ms

                for (let chunkIndex = 0; offset < totalSize; chunkIndex++) {
                    const chunk = await lockitReadChunk(file, offset, CHUNK_SIZE);
                    const encryptedChunk = await lockitEncryptChunkCTR(chunk, key, iv, offset);
                    encryptedChunks.push(encryptedChunk);
                    offset += chunk.length;
                    const now = performance.now();
                    if (now - lastUpdate >= UPDATE_INTERVAL) {
                        const percentage = (offset / totalSize) * 100;
                        progressBar.style.width = `${Math.min(percentage, 100)}%`;
                        progressBar.textContent = `${Math.round(percentage)}% (${chunkIndex + 1}/${totalChunks})`;
                        await new Promise(resolve => requestAnimationFrame(resolve));
                        lastUpdate = now;
                    }
                }

                // Ensure final progress update
                progressBar.style.width = '100%';
                progressBar.textContent = `100% (${totalChunks}/${totalChunks})`;
                lockitAddLog('Finalized progress bar for encryption');

                const filename = file.name.split('.').slice(0, -1).join('.').replace(/[^A-Za-z0-9_-]/g, '') || 'file';
                const encryptedBlob = new Blob([header, ...encryptedChunks]);
                downloadFile(encryptedBlob, `${filename}.tsx`);
                lockitAddLog(`Large file encryption completed: ${filename}.tsx`);
                return true;
            } 
            catch (e) {
                lockitAddLog(`Large file encryption error: ${e.message}`);
                throw e;
            } finally {
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                }, 1000);
            }
        }

        async function lockitDecryptFileCTR(file, password) {
            const CHUNK_SIZE = 1024 * 1024;
            const MAGIC_NUMBER = new TextEncoder().encode('TSLG');
            const MAGIC_NUMBER_SIZE = 4;
            const SALT_SIZE = 16;
               const IV_SIZE = 16;
            const EXTENSION_LENGTH_SIZE = 1;
            const MAX_EXTENSION_LENGTH = 255;
            const progressBar = document.getElementById('lockit-progressBar');
            const progressContainer = document.getElementById('lockit-fileProgress');
            progressContainer.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';

            try {
                lockitAddLog(`Starting large file encryption (AES-CTR) for file: ${file.name}, size: ${file.size} bytes`);
                const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
                const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));
                const extension = file.name.split('.').pop() || '';
                const extensionBuffer = new TextEncoder().encode(extension.slice(0, MAX_EXTENSION_LENGTH));
                const extensionLength = new Uint8Array([extensionBuffer.length]);
                const key = await lockitDeriveKeyCTR(password, salt);
                const header = new Uint8Array(MAGIC_NUMBER.length + SALT_SIZE + IV_SIZE + EXTENSION_LENGTH_SIZE + extensionBuffer.length);
                let offset = 0;
                header.set(MAGIC_NUMBER, offset); offset += MAGIC_NUMBER.length;
                header.set(salt, offset); offset += SALT_SIZE;
                header.set(iv, offset); offset += IV_SIZE;
                header.set(extensionLength, offset); offset += EXTENSION_LENGTH_SIZE;
                header.set(extensionBuffer, offset);
                lockitAddLog(`Created header with magic number TSLG, salt, IV, and extension: ${extension}`);
                const encryptedChunks = [];
                offset = 0;
                const totalSize = file.size;
                const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
                let lastUpdate = 0;
                const UPDATE_INTERVAL = 100; // Update every 100ms

                for (let chunkIndex = 0; offset < totalSize; chunkIndex++) {
                    const chunk = await lockitReadChunk(file, offset, CHUNK_SIZE);
                    const encryptedChunk = await lockitEncryptChunkCTR(chunk, key, iv, offset);
                    encryptedChunks.push(encryptedChunk);
                    offset += chunk.length;
                    const now = performance.now();
                    if (now - lastUpdate >= UPDATE_INTERVAL) {
                        const percentage = (offset / totalSize) * 100;
                        progressBar.style.width = `${Math.min(percentage, 100)}%`;
                        progressBar.textContent = `${Math.round(percentage)}% (${chunkIndex + 1}/${totalChunks})`;
                        await new Promise(resolve => requestAnimationFrame(resolve));
                        lastUpdate = now;
                    }
                }

                // Ensure final progress update
                progressBar.style.width = '100%';
                progressBar.textContent = `100% (${totalChunks}/${totalChunks})`;
                lockitAddLog('Finalized progress bar for encryption');

                const filename = file.name.split('.').slice(0, -1).join('.').replace(/[^A-Za-z0-9_-]/g, '') || 'file';
                const encryptedBlob = new Blob([header, ...encryptedChunks]);
                downloadFile(encryptedBlob, `${filename}.tsx`);
                lockitAddLog(`Large file encryption completed: ${filename}.tsx`);
                return true;
            } catch (e) {
                lockitAddLog(`Large file encryption error: ${e.message}`);
                throw e;
            } finally {
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                }, 1000);
            }
        }

        async function lockitDecryptFileCTR(file, password) {
            const CHUNK_SIZE = 1024 * 1024;
            const MAGIC_NUMBER = new TextEncoder().encode('TSLG');
            const MAGIC_NUMBER_SIZE = 4;
            const SALT_SIZE = 16;
            const IV_SIZE = 16;
            const EXTENSION_LENGTH_SIZE = 1;
            const MAX_EXTENSION_LENGTH = 255;
            const progressBar = document.getElementById('lockit-progressBar');
            const progressContainer = document.getElementById('lockit-fileProgress');
            progressContainer.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';

            try {
                lockitAddLog(`Starting large file decryption (AES-CTR) for file: ${file.name}, size: ${file.size} bytes`);
                const headerSize = MAGIC_NUMBER_SIZE + SALT_SIZE + IV_SIZE + EXTENSION_LENGTH_SIZE;
                if (file.size < headerSize) {
                    throw new Error('File too small to contain valid header');
                }
                const header = await lockitReadChunk(file, 0, headerSize);
                let salt, iv, extensionLength, extensionHeader, extension, headerOffset;
                if (header[0] === MAGIC_NUMBER[0] && header[1] === MAGIC_NUMBER[1] &&
                    header[2] === MAGIC_NUMBER[2] && header[3] === MAGIC_NUMBER[3]) {
                    lockitAddLog('Detected TSLG magic number, processing as large mode');
                    salt = header.slice(MAGIC_NUMBER_SIZE, MAGIC_NUMBER_SIZE + SALT_SIZE);
                    iv = header.slice(MAGIC_NUMBER_SIZE + SALT_SIZE, MAGIC_NUMBER_SIZE + SALT_SIZE + IV_SIZE);
                    extensionLength = header[MAGIC_NUMBER_SIZE + SALT_SIZE + IV_SIZE];
                    if (extensionLength > MAX_EXTENSION_LENGTH) {
                        throw new Error('Invalid extension length in header');
                    }
                    extensionHeader = await lockitReadChunk(file, headerSize, extensionLength);
                    extension = new TextDecoder().decode(extensionHeader);
                    headerOffset = headerSize + extensionLength;
                } else {
                    lockitAddLog('No TSLG magic number found, attempting legacy large mode detection');
                    const legacyHeaderSize = SALT_SIZE + IV_SIZE + EXTENSION_LENGTH_SIZE;
                    if (file.size < legacyHeaderSize) {
                        throw new Error('File too small for legacy large mode header');
                    }
                    const legacyHeader = await lockitReadChunk(file, 0, legacyHeaderSize);
                    salt = legacyHeader.slice(0, SALT_SIZE);
                    iv = legacyHeader.slice(SALT_SIZE, SALT_SIZE + IV_SIZE);
                    extensionLength = legacyHeader[SALT_SIZE + IV_SIZE];
                    if (extensionLength > MAX_EXTENSION_LENGTH) {
                        throw new Error('Invalid extension length in legacy header');
                    }
                    extensionHeader = await lockitReadChunk(file, legacyHeaderSize, extensionLength);
                    extension = new TextDecoder().decode(extensionHeader);
                    headerOffset = legacyHeaderSize + extensionLength;
                }
                const key = await lockitDeriveKeyCTR(password, salt);
                const decryptedChunks = [];
                let offset = headerOffset;
                const totalSize = file.size - offset;
                const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
                let lastUpdate = 0;
                const UPDATE_INTERVAL = 100; // Update every 100ms

                for (let chunkIndex = 0; offset < file.size; chunkIndex++) {
                    const chunk = await lockitReadChunk(file, offset, CHUNK_SIZE);
                    const dataOffset = offset - headerOffset;
                    const decryptedChunk = await lockitDecryptChunkCTR(chunk, key, iv, dataOffset);
                    decryptedChunks.push(decryptedChunk);
                    offset += chunk.length;
                    const now = performance.now();
                    if (now - lastUpdate >= UPDATE_INTERVAL) {
                        const percentage = ((offset - headerOffset) / totalSize) * 100;
                        progressBar.style.width = `${Math.min(percentage, 100)}%`;
                        progressBar.textContent = `${Math.round(percentage)}% (${chunkIndex + 1}/${totalChunks})`;
                        await new Promise(resolve => requestAnimationFrame(resolve));
                        lastUpdate = now;
                    }
                }

                // Ensure final progress update
                progressBar.style.width = '100%';
                progressBar.textContent = `100% (${totalChunks}/${totalChunks})`;
                lockitAddLog('Finalized progress bar for decryption');

                const filename = file.name.replace('.tsx', '').replace(/[^A-Za-z0-9_-]/g, '') || 'file';
                const decryptedBlob = new Blob(decryptedChunks, { type: 'application/octet-stream' });
                const outputFilename = extension ? `${filename}.${extension}` : filename;
                downloadFile(decryptedBlob, outputFilename);
                lockitAddLog(`Large file decryption completed: ${outputFilename}`);
                return true;
            } catch (e) {
                lockitAddLog(`Large file decryption error: ${e.message}`);
                throw e;
            } finally {
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                }, 1000);
            }
        }

        function lockitReadChunk(file, offset, length) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                const blob = file.slice(offset, offset + length);
                reader.onload = () => resolve(new Uint8Array(reader.result));
                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            });
        }

        async function lockitEncryptChunkCTR(chunk, key, iv, dataOffset) {
            const blockIndex = Math.floor(dataOffset / 16);
            const counter = lockitGetCounterForBlock(iv, blockIndex);
            const encrypted = await crypto.subtle.encrypt(
                {
                    name: 'AES-CTR',
                    counter: counter,
                    length: 64
                },
                key,
                chunk
            );
            return new Uint8Array(encrypted);
        }

        async function lockitDecryptChunkCTR(chunk, key, iv, dataOffset) {
            const blockIndex = Math.floor(dataOffset / 16);
            const counter = lockitGetCounterForBlock(iv, blockIndex);
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-CTR',
                    counter: counter,
                    length: 64
                },
                key,
                chunk
            );
            return new Uint8Array(decrypted);
        }

        function lockitGetCounterForBlock(iv, blockIndex) {
            const ivBigInt = BigInt('0x' + Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''));
            const counterBigInt = ivBigInt + BigInt(blockIndex);
            const counterBytes = [];
            for (let i = 0; i < 16; i++) {
                counterBytes.push(Number((counterBigInt >> BigInt(8 * (15 - i))) & 255n));
            }
            return new Uint8Array(counterBytes);
        }

        function downloadFile(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        async function lockitEncryptText(plaintext, password) {
            try {
                const salt = crypto.getRandomValues(new Uint8Array(16));
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const key = await lockitDeriveKey(password, salt);
                const encrypted = await crypto.subtle.encrypt(
                    { name: 'AES-GCM', iv: iv, tagLength: 128 },
                    key,
                    lockitStrToArrayBuffer(plaintext)
                );
                const encryptedArray = new Uint8Array(encrypted);
                const ciphertext = encryptedArray.slice(0, -16);
                const authTag = encryptedArray.slice(-16);
                const result = lockitArrayBufferToHex(salt) + lockitArrayBufferToHex(iv) +
                               lockitArrayBufferToHex(ciphertext) + lockitArrayBufferToHex(authTag);
                const passwordHash = await lockitComputeHash(password);
                const outputHash = await lockitComputeHash(result);
                lockitAddLog(`Encoded: ${lockitTruncate(result)}, key: ${lockitTruncate(passwordHash)}, output: ${lockitTruncate(outputHash)}, authTag: ${lockitTruncate(lockitArrayBufferToHex(authTag))}`);
                lockitAddLog('Authentication tag generated successfully');
                return result;
            } catch (e) {
                lockitAddLog(`Encode error: ${e.message}`);
                throw e;
            }
        }

        async function lockitDecryptText(ciphertextHex, password) {
            try {
                if (ciphertextHex.length < 88) {
                    throw new Error('Invalid text: Too short');
                }
                const salt = lockitHexToArrayBuffer(ciphertextHex.slice(0, 32));
                const iv = lockitHexToArrayBuffer(ciphertextHex.slice(32, 56));
                const authTag = lockitHexToArrayBuffer(ciphertextHex.slice(-32));
                const ciphertext = lockitHexToArrayBuffer(ciphertextHex.slice(56, -32));
                const ciphertextWithTag = new Uint8Array([...new Uint8Array(ciphertext), ...new Uint8Array(authTag)]);
                const key = await lockitDeriveKey(password, salt);
                const decrypted = await crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv: iv, tagLength: 128 },
                    key,
                    ciphertextWithTag.buffer
                );
                const plaintext = new TextDecoder().decode(decrypted);
                const passwordHash = await lockitComputeHash(password);
                const outputHash = await lockitComputeHash(plaintext);
                lockitAddLog(`Decoded: ${lockitTruncate(plaintext)}, key: ${lockitTruncate(passwordHash)}, output: ${lockitTruncate(outputHash)}, authTag: ${lockitTruncate(lockitArrayBufferToHex(authTag))}`);
                lockitAddLog('Authentication tag verified successfully');
                return plaintext;
            } catch (e) {
                lockitAddLog(`Decode error: ${e.message} (possible invalid authTag or tampered data)`);
                lockitAddLog('Authentication tag verification failed');
                throw e;
            }
        }

        async function lockitEncrypt() {
            const keyInput = document.getElementById('lockit-key');
            const outputElement = document.getElementById('lockit-output');
            if (!keyInput.value) {
                alert('Please enter a key');
                lockitAddLog('Encryption attempted without key');
                return;
            }
            if (keyInput.value.length < 8 && !lockitHasShownKeyWarning) {
                alert('Weak key: Use 8+ chars for max security! 😎');
                lockitHasShownKeyWarning = true;
            }
            try {
                if (lockitMode === 'text') {
                    const inputText = document.getElementById('lockit-inputText').value;
                    if (!inputText) {
                        alert('Please enter text to encode');
                        lockitAddLog('Encryption attempted without text');
                        return;
                    }
                    const result = await lockitEncryptText(inputText, keyInput.value);
                    document.getElementById('lockit-inputText').value = result;
                    outputElement.value = result;
                    try {
                        lockitSetLockIcon(true);
                        lockitUpdateUI();
                    } catch (e) {
                        lockitAddLog(`UI update error: ${e.message}`);
                    }
                } else {
                    const fileInput = document.getElementById('lockit-fileInput');
                    const file = fileInput.files[0];
                    if (!file) {
                        alert('Please select a file to encode');
                        lockitAddLog('Encryption attempted without file');
                        return;
                    }
                    await lockitEncryptFile(file, keyInput.value);
                    outputElement.value = '';
                }
            } catch (e) {
                alert(`Encryption failed: ${e.message}`);
                lockitAddLog(`Encode error: ${e.message}`);
            }
        }

        async function lockitDecrypt() {
            const keyInput = document.getElementById('lockit-key');
            const outputElement = document.getElementById('lockit-output');
            if (!keyInput.value) {
                alert('Please enter a key');
                lockitAddLog('Decryption attempted without key');
                return;
            }
            if (keyInput.value.length < 8 && !lockitHasShownKeyWarning) {
                alert('Weak key: Use 8+ chars for max security!');
                lockitHasShownKeyWarning = true;
            }
            try {
                if (lockitMode === 'text') {
                    const inputText = document.getElementById('lockit-inputText').value;
                    if (!inputText) {
                        alert('Please enter encoded text to decode');
                        lockitAddLog('Decryption attempted without text');
                        return;
                    }
                    const result = await lockitDecryptText(inputText, keyInput.value);
                    outputElement.value = result;
                    lockitSetLockIcon(false);
                    lockitUpdateUI();
                } else {
                    const fileInput = document.getElementById('lockit-fileInput');
                    if (!fileInput.files[0]) {
                        alert('Please select a file to decode');
                        lockitAddLog('Decryption attempted without file');
                        return;
                    }
                    await lockitDecryptFile(fileInput.files[0], keyInput.value);
                    outputElement.value = '';
                }
            } catch (e) {
                alert(`Error: ${e.message}`);
                lockitAddLog(`Decode error: ${e.message}`);
            }
        }

        function lockitCopyOutput() {
            const outputElement = document.getElementById('lockit-output');
            if (outputElement.value) {
                navigator.clipboard.writeText(outputElement.value).then(() => {
                    alert('Output copied! 📋');
                    lockitAddLog('Copied to clipboard');
                }).catch(e => {
                    lockitAddLog(`Copy error: ${e.message}`);
                });
            } else {
                lockitAddLog('Copy attempted with empty output');
            }
        }

        function lockitClearFields() {
            document.getElementById('lockit-key').value = '';
            document.getElementById('lockit-inputText').value = '';
            document.getElementById('lockit-fileInput').value = '';
            document.getElementById('lockit-output').value = '';
            document.getElementById('lockit-fileStatus').textContent = 'No file selected';
            document.getElementById('lockit-fileProgress').classList.add('hidden');
            lockitFileMode = 'standard';
            lockitSetLockIcon(false);
            lockitUpdateUI();
            lockitAddLog('Cleared fields');
        }

        function lockitInit() {
            lockitAddLog('LockIt tab loaded');
            const inputTextElement = document.getElementById('lockit-inputText');
            const fileInputElement = document.getElementById('lockit-fileInput');
            const fileButton = document.getElementById('lockit-fileButton');
            const keyInput = document.getElementById('lockit-key');
            const toggleInput = document.getElementById('lockit-input-toggle');

            if (keyInput) {
                console.log('[DEBUG] Initialized #lockit-key with type=text');
            } else {
                console.error('[ERROR] #lockit-key not found during init');
            }

            if (toggleInput) {
                toggleInput.checked = lockitMode === 'file';
                toggleInput.addEventListener('change', () => {
                    const newMode = toggleInput.checked ? 'file' : 'text';
                    lockitAddLog(`Toggle clicked, switching to mode: ${newMode}`);
                    lockitSwitchMode(newMode);
                });
            } else {
                console.error('[ERROR] #lockit-input-toggle not found during init');
                lockitAddLog('Error: Toggle input not found');
            }

            if (inputTextElement) {
                inputTextElement.addEventListener('input', lockitUpdateUI);
                inputTextElement.addEventListener('paste', function(e) {
                    setTimeout(() => {
                        this.value = this.value.trim();
                        lockitUpdateUI();
                    }, 0);
                });
            }

            if (fileInputElement) {
                fileInputElement.addEventListener('change', () => {
                    const fileStatus = document.getElementById('lockit-fileStatus');
                    if (fileInputElement.files && fileInputElement.files[0]) {
                        fileStatus.textContent = `Selected: ${fileInputElement.files[0].name}`;
                        lockitAddLog(`File selected: ${fileInputElement.files[0].name}`);
                    } else {
                        fileStatus.textContent = 'No file selected';
                        lockitAddLog('File selection cleared');
                    }
                    lockitUpdateUI();
                });
            }

            if (fileButton && fileInputElement) {
                fileButton.addEventListener('click', (e) => {
                    if (!fileInputElement.disabled) {
                        fileInputElement.click();
                        lockitAddLog('File browse button clicked');
                    }
                    e.preventDefault();
                });
            }

            lockitUpdateUI();
        }

        // Time-Seed JavaScript
        let timeseedLogEntries = [];
        let timeseedIsSeedSubmitted = false;
        let timeseedCalibratedIterations = 135000;
        let timeseedUpdateCountdownIntervalId = null;
        let timeseedLastLoggedKeys = { days: '', terms: '' };

        function timeseedAddLog(message) {
            const timestamp = new Date().toISOString();
            timeseedLogEntries.push(`[${timestamp}] ${message}`);
            timeseedUpdateLogDisplay();
        }

        function timeseedToggleLog() {
            const logElement = document.getElementById('timeseed-log');
            logElement.style.display = logElement.style.display === 'none' ? 'block' : 'none';
            timeseedAddLog(`Log display ${logElement.style.display === 'none' ? '' : 'shown'}`);
        }

        function timeseedUpdateLogDisplay() {
            const logElement = document.getElementById('timeseed-log');
            if (logElement) logElement.innerText = timeseedLogEntries.join('\n');
        }

        function timeseedTruncate(str) {
            return str && typeof str === 'string' ? (str.length > 10 ? str.slice(0, 10) + '...' : str) : 'null';
        }

        async function timeseedSha256(message) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(36).padStart(2, '0')).join('');
        }

        async function timeseedCalibrateIterations() {
            const testIterations = 1000;
            const targetTime = 2000;
            const maxIterations = 10000000;
            const startTime = performance.now();
            let hash = '0';
            for (let i = 0; i < testIterations;) {
                hash = await timeseedSha256(hash + i);
                i++;
            }
            const elapsed = performance.now() - startTime;
            let iterationsPerMs = testIterations / elapsed;
            if (!isFinite(iterationsPerMs) || iterationsPerMs <= 0) {
                iterationsPerMs = 1000;
            }
            let calibratedIterations = Math.floor(iterationsPerMs * targetTime);
            if (calibratedIterations > maxIterations) {
                calibratedIterations = maxIterations;
            }
            timeseedCalibratedIterations = calibratedIterations;
            timeseedAddLog(`Calibrated ${timeseedCalibratedIterations} iterations for ~${targetTime}ms`);
            return timeseedCalibratedIterations;
        }

        function timeseedTogglePepperVisibility() {
            const pepperInput = document.getElementById('timeseed-pepperInput');
            const toggleButton = document.getElementById('timeseed-togglePepperButton');
            if (pepperInput && toggleButton) {
                if (pepperInput.type === 'password') {
                    pepperInput.type = 'text';
                    toggleButton.setAttribute('data-tooltip', 'Hide');
                    toggleButton.innerHTML = '🙈';
                    toggleButton.setAttribute('aria-label', 'Hide pepper');
                } else {
                    pepperInput.type = 'password';
                    toggleButton.setAttribute('data-tooltip', 'Show');
                    toggleButton.innerHTML = '👁️';
                    toggleButton.setAttribute('aria-label', 'Show pepper');
                }
                timeseedAddLog('Toggled pepper visibility');
            }
        }

        function timeseedClearSession(fullReset = true) {
            const entropyOutput = document.getElementById('timeseed-entropyOutput');
            const outputDiv = document.getElementById('timeseed-output');
            const inputCodeField = document.getElementById('timeseed-inputCode');
            const pepperInput = document.getElementById('timeseed-pepperInput');
            const errorDiv = document.getElementById('timeseed-error');
            const datePicker = document.getElementById('timeseed-datePicker');
            const submitSeedButton = document.getElementById('timeseed-submitSeedButton');
            if (fullReset) {
                if (entropyOutput) entropyOutput.innerHTML = '';
                if (outputDiv) {
                    outputDiv.innerHTML = `
                        <div id="timeseed-keyCards"></div>
                        <div id="timeseed-infoTable"></div>
                    `;
                    outputDiv.dataset.key = '';
                    outputDiv.dataset.longTermKey = '';
                }
            }
            if (inputCodeField) {
                inputCodeField.value = '';
                inputCodeField.classList.remove('valid', 'invalid');
                document.getElementById('timeseed-inputStatus').textContent = '';
            }
            if (pepperInput) {
                pepperInput.value = '';
                pepperInput.type = 'password';
                document.getElementById('timeseed-togglePepperButton').innerHTML = '👁️';
                document.getElementById('timeseed-togglePepperButton').setAttribute('data-tooltip', 'Show');
                document.getElementById('timeseed-togglePepperButton').setAttribute('aria-label', 'Show pepper');
            }
            if (errorDiv) errorDiv.innerText = '';
            if (datePicker && datePicker._flatpickr) datePicker._flatpickr.clear();
            if (submitSeedButton) submitSeedButton.disabled = true;
            timeseedIsSeedSubmitted = false;
            if (timeseedUpdateCountdownIntervalId) {
                clearInterval(timeseedUpdateCountdownIntervalId);
                timeseedUpdateCountdownIntervalId = null;
            }
            timeseedLastLoggedKeys = { days: '', terms: '' };
        }

        function timeseedClearInputs() {
            timeseedClearSession(false);
            timeseedAddLog('Cleared inputs');
        }

        async function timeseedGenerateInputCode() {
            const entropyOutput = document.getElementById('timeseed-entropyOutput');
            const progressOutput = document.getElementById('timeseed-progressOutput');
            const inputCodeField = document.getElementById('timeseed-inputCode');
            const pepperInput = document.getElementById('timeseed-pepperInput');
            const errorDiv = document.getElementById('timeseed-error');
            const submitSeedButton = document.getElementById('timeseed-submitSeedButton');
            if (!entropyOutput || !progressOutput || !inputCodeField || !pepperInput || !errorDiv || !submitSeedButton) {
                errorDiv.innerText = 'UI error: Missing elements. Please refresh.';
                timeseedAddLog('Error: Missing DOM elements');
                return;
            }
            timeseedClearSession(true);
            progressOutput.innerHTML = `
                <div>Generating secure seed...</div>
                <div class="progress-container">
                    <div class="progress-bar" id="timeseed-seedProgressBar">0%</div>
                </div>
            `;
            const seedProgressBar = document.getElementById('timeseed-seedProgressBar');
            timeseedAddLog('Starting seed generation');
            try {
                let progress = 0;
                const updateProgress = () => {
                    progress += 10;
                    if (progress <= 100) {
                        seedProgressBar.style.width = `${progress}%`;
                        seedProgressBar.innerText = `${progress}%`;
                    }
                };
                const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let seed = '';
                for (let i = 0; i < 50; i++) {
                    const randomIndex = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * alphabet.length);
                    seed += alphabet[randomIndex];
                    if (i % 5 === 4) {
                        updateProgress();
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
                inputCodeField.value = seed;
                inputCodeField.classList.add('valid');
                document.getElementById('timeseed-inputStatus').textContent = '✅';
                submitSeedButton.disabled = false;
                entropyOutput.innerHTML = `
                    <p class="text-sm">Generated Seed: <span class="font-mono">${seed}</span></p>
                    <p class="text-sm text-[#D1D5DB]">Copy and store this seed securely!</p>
                `;
                seedProgressBar.style.width = '100%';
                seedProgressBar.innerText = '100%';
                await new Promise(resolve => setTimeout(resolve, 500));
                progressOutput.innerHTML = '';
                timeseedAddLog(`Seed generated: ${timeseedTruncate(seed)}`);
            } catch (err) {
                errorDiv.innerText = 'Failed to generate seed. Please try again.';
                timeseedAddLog(`Seed generation error: ${err.message}`);
                progressOutput.innerHTML = '';
            }
        }

        async function timeseedDeriveAESKey(seed, date, pepper = '') {
            try {
                if (!window.crypto || !window.crypto.subtle) {
                    throw new Error('Web Crypto API not supported');
                }
                const seedBuffer = new TextEncoder().encode(seed);
                const key = await crypto.subtle.importKey(
                    'raw',
                    seedBuffer,
                    { name: 'HKDF' },
                    false,
                    ['deriveBits']
                );
                const saltInput = `${seed}:${date}`;
                const saltBuffer = new TextEncoder().encode(saltInput);
                const saltHash = await crypto.subtle.digest('SHA-256', saltBuffer);
                const salt = new Uint8Array(saltHash).slice(0, 16);
                const infoString = pepper ? `${date}:${pepper}` : date;
                const derivedBits = await crypto.subtle.deriveBits(
                    {
                        name: 'HKDF',
                        hash: 'SHA-256',
                        salt: salt,
                        info: new TextEncoder().encode(infoString)
                    },
                    key,
                    256
                );
                const keyArray = new Uint8Array(derivedBits);
                const keyHex = Array.from(keyArray).map(b => b.toString(16).padStart(2, '0')).join('');
                const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
                timeseedAddLog(`Derived key for seed=${timeseedTruncate(seed)}, date=${date}, pepper=${timeseedTruncate(pepper)}, salt=${timeseedTruncate(saltHex)}: ${timeseedTruncate(keyHex)}`);
                return keyHex;
            } catch (err) {
                timeseedAddLog(`Key derivation error: ${err.message}`);
                throw err;
            }
        }

        function timeseedGetTodayUTC() {
            const now = new Date();
            return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
        }

        function timeseedGetLongTermDate() {
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            const jul1 = new Date(Date.UTC(currentYear, 6, 1));
            if (now < jul1) {
                return `${currentYear}-01-01`;
            }
            return `${currentYear}-07-01`;
        }

        function timeseedGetLongTermDateForDate(selectedDate) {
            const date = new Date(selectedDate);
            const currentYear = date.getUTCFullYear();
            const jul1 = new Date(Date.UTC(currentYear, 6, 1));
            if (date < jul1) {
                return `${currentYear}-01-01`;
            }
            return `${currentYear}-07-01`;
        }

        function timeseedUpdateCountdown() {
            const now = new Date();
            const midnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
            const timeLeftMs = midnightUTC - now;
            const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
            const countdownElement = document.querySelector('.countdown-timer');
            if (countdownElement) {
                countdownElement.innerText = `New key in ${hours}h ${minutes}m ${seconds}s`;
            }
            if (timeLeftMs <= 0 && timeseedIsSeedSubmitted) {
                timeseedSubmitSeed();
            }
        }

        async function timeseedCopyKey(event, key, label) {
            try {
                await navigator.clipboard.writeText(key);
                timeseedAddLog(`${label} copied`);
                event.target.innerText = '✅ Copied!';
                setTimeout(() => {
                    event.target.innerText = '📋 Copy';
                }, 2000);
            } catch (err) {
                timeseedAddLog(`Copy error: ${err.message}`);
            }
        }

        function timeseedUseInLockIt(key, label) {
            const lockitKeyInput = document.getElementById('lockit-key');
            if (lockitKeyInput) {
                lockitKeyInput.value = key;
                showTab('lockit');
                timeseedAddLog(`Used ${label} in LockIt: ${timeseedTruncate(key)}`);
            } else {
                timeseedAddLog(`Error: LockIt input not found for ${label}`);
            }
        }

        function timeseedValidateInputCode(code) {
            const isValid = /^[a-zA-Z0-9]{50}$/.test(code);
            const inputCodeField = document.getElementById('timeseed-inputCode');
            const inputStatus = document.getElementById('timeseed-inputStatus');
            const submitSeedButton = document.getElementById('timeseed-submitSeedButton');
            if (inputCodeField && inputStatus && submitSeedButton) {
                inputCodeField.classList.remove('valid', 'invalid');
                if (code.length === 0) {
                    inputStatus.textContent = '';
                    submitSeedButton.disabled = true;
                } else if (isValid) {
                    inputCodeField.classList.add('valid');
                    inputStatus.textContent = '✅';
                    submitSeedButton.disabled = false;
                } else {
                    inputCodeField.classList.add('invalid');
                    inputStatus.textContent = '❌';
                    submitSeedButton.disabled = true;
                }
            }
            return isValid;
        }

        async function timeseedSubmitSeed(selectedDate = null) {
            const inputCodeField = document.getElementById('timeseed-inputCode');
            const pepperInput = document.getElementById('timeseed-pepperInput');
            const errorDiv = document.getElementById('timeseed-error');
            const outputDiv = document.getElementById('timeseed-output');
            const keyCards = document.getElementById('timeseed-keyCards');
            const infoTable = document.getElementById('timeseed-infoTable');
            if (!inputCodeField || !pepperInput || !errorDiv || !outputDiv || !keyCards || !infoTable) {
                errorDiv.innerText = 'UI error: Missing elements. Please refresh.';
                timeseedAddLog('Error: Missing DOM elements');
                return;
            }
            const seed = inputCodeField.value.trim();
            const pepper = pepperInput.value.trim();
            if (!timeseedValidateInputCode(seed)) {
                errorDiv.innerText = 'Invalid seed: Must be 50 alphanumeric characters.';
                timeseedAddLog(`Invalid seed: ${timeseedTruncate(seed)}`);
                return;
            }
            errorDiv.innerText = '';
            timeseedIsSeedSubmitted = true;
            try {
                const date = selectedDate || timeseedGetTodayUTC();
                const dailyKey = await timeseedDeriveAESKey(seed, date, pepper);
                const longTermDate = selectedDate ? timeseedGetLongTermDateForDate(selectedDate) : timeseedGetLongTermDate();
                const longTermKey = await timeseedDeriveAESKey(seed, longTermDate, pepper);
                if (dailyKey !== timeseedLastLoggedKeys.days || longTermKey !== timeseedLastLoggedKeys.terms) {
                    timeseedAddLog(`Generated keys: Daily=${timeseedTruncate(dailyKey)}, Long-term=${timeseedTruncate(longTermKey)} for date=${date}`);
                    timeseedLastLoggedKeys = { days: dailyKey, terms: longTermKey };
                }
                outputDiv.dataset.key = dailyKey;
                outputDiv.dataset.longTermKey = longTermKey;
                const dailyKeyCard = `
                    <div class="key-card">
                        <span class="pass-indicator">Daily Key (${date}):</span>
                        <textarea class="key-text" readonly>${dailyKey}</textarea>
                        <button class="copy-btn" onclick="timeseedCopyKey(event, '${dailyKey}', 'Daily Key')">📋 Copy</button>
                        <button class="copy-btn" onclick="timeseedUseInLockIt('${dailyKey}', 'Daily Key')">🔒 Use in LockIt</button>
                    </div>
                `;
                const longTermKeyCard = `
                    <div class="long-term-card">
                        <span class="pass-indicator">Long-term Key (${longTermDate}):</span>
                        <textarea class="key-text" readonly>${longTermKey}</textarea>
                        <button class="copy-btn" onclick="timeseedCopyKey(event, '${longTermKey}', 'Long-term Key')">📋 Copy</button>
                        <button class="copy-btn" onclick="timeseedUseInLockIt('${longTermKey}', 'Long-term Key')">🔒 Use in LockIt</button>
                    </div>
                `;
                keyCards.innerHTML = dailyKeyCard + longTermKeyCard;
                const seedHash = await timeseedSha256(seed);
                const pepperHash = pepper ? await timeseedSha256(pepper) : 'None';
                const isToday = date === timeseedGetTodayUTC();
                infoTable.innerHTML = `
                    <table class="info-table">
                        <tr><td>Seed Hash:</td><td class="font-mono">${seedHash}</td></tr>
                        <tr><td>Pepper Hash:</td><td class="font-mono">${pepperHash}</td></tr>
                        <tr><td>Key Date:</td><td>${date}</td></tr>
                        <tr><td>Countdown:</td><td><span class="countdown-timer">${isToday ? '' : 'N/A for selected date'}</span></td></tr>
                    </table>
                `;
                if (isToday) {
                    if (timeseedUpdateCountdownIntervalId) {
                        clearInterval(timeseedUpdateCountdownIntervalId);
                    }
                    timeseedUpdateCountdown();
                    timeseedUpdateCountdownIntervalId = setInterval(timeseedUpdateCountdown, 1000);
                } else {
                    if (timeseedUpdateCountdownIntervalId) {
                        clearInterval(timeseedUpdateCountdownIntervalId);
                        timeseedUpdateCountdownIntervalId = null;
                    }
                    const countdownElement = document.querySelector('.countdown-timer');
                    if (countdownElement) countdownElement.innerText = 'N/A for selected date';
                }
                timeseedAddLog(`Seed submitted: ${timeseedTruncate(seed)} for date=${date}`);
            } catch (err) {
                errorDiv.innerText = `Error: ${err.message}`;
                timeseedAddLog(`Key error: ${err.message}`);
            }
        }

        function timeseedShowDatePicker() {
            const datePicker = document.getElementById('timeseed-datePicker');
            if (!datePicker._flatpickr) {
                flatpickr(datePicker, {
                    maxDate: new Date().setFullYear(new Date().getFullYear() + 2),
                    dateFormat: 'Y-m-d',
                    onChange: async (selectedDates, dateStr) => {
                        if (selectedDates.length > 0) {
                            const selectedDate = dateStr;
                            timeseedAddLog(`Selected date: ${selectedDate}`);
                            await timeseedSubmitSeed(selectedDate);
                            datePicker._flatpickr.close();
                        }
                    },
                });
            }
            datePicker._flatpickr.open();
        }

        async function timeseedDownloadSeed() {
            const inputCodeField = document.getElementById('timeseed-inputCode');
            const pepperInput = document.getElementById('timeseed-pepperInput');
            const outputDiv = document.getElementById('timeseed-output');
            const errorDiv = document.getElementById('timeseed-error');
            if (!inputCodeField || !pepperInput || !outputDiv || !errorDiv) {
                errorDiv.innerText = 'UI error: Missing elements. Please refresh.';
                timeseedAddLog('Error: Missing DOM elements');
                return;
            }
            const seed = inputCodeField.value.trim();
            const pepper = pepperInput.value.trim();
            const dailyKey = outputDiv.dataset.key || 'Not generated';
            const longTermKey = outputDiv.dataset.longTermKey || 'Not generated';
            if (!seed) {
                errorDiv.innerText = 'No seed to download.';
                timeseedAddLog('Download attempted without seed');
                return;
            }
            try {
                const content = `Time-Seed Backup (v1.13) - ${new Date().toISOString()}
----------------------------------------
Seed: ${seed}
Pepper: ${pepper || 'None'}
Daily Key (${timeseedGetTodayUTC()}): ${dailyKey}
Long-term Key (${timeseedGetLongTermDate()}): ${longTermKey}
----------------------------------------
Generated by LockIt & Time-Seed
Store securely and do not share!
`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `timeseed-backup-${timeseedGetTodayUTC()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                timeseedAddLog('Downloaded seed and keys');
            } catch (err) {
                errorDiv.innerText = `Error: ${err.message}`;
                timeseedAddLog(`Download error: ${err.message}`);
            }
        }

        function timeseedInit() {
            timeseedAddLog('Time-Seed tab loaded');
            const inputCodeField = document.getElementById('timeseed-inputCode');
            const submitSeedButton = document.getElementById('timeseed-submitSeedButton');
            if (inputCodeField && submitSeedButton) {
                inputCodeField.addEventListener('input', () => {
                    const code = inputCodeField.value.trim();
                    timeseedValidateInputCode(code);
                });
                inputCodeField.addEventListener('paste', () => {
                    setTimeout(() => {
                        const code = inputCodeField.value.trim();
                        timeseedValidateInputCode(code);
                    }, 0);
                });
            }
            timeseedCalibrateIterations();
        }

        // Initialize Tabs and Event Listeners
        document.getElementById('lockit-tab').addEventListener('click', () => showTab('lockit'));
        document.getElementById('timeseed-tab').addEventListener('click', () => showTab('timeseed'));
        document.addEventListener('DOMContentLoaded', () => {
            lockitInit();
            timeseedInit();
            showTab('lockit');
        });