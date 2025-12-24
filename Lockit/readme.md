# LockIt v2


##  What LockIt is (and is not)
LockIt is designed for client-side text encryption using strong passwords or passkeys alongside the main Timeseed v2 system (timeseed.io). It uses the passkeys for long term or daily keys, derived from the timeseed in order to encrypt/decrypt info.

Lockit is NOT a messaging app, messaging network, a key escrow system, password manager or anonymity network.
Timeseed itself is NOT a messaging app, messaging network, a key escrow system, password manager or anonymity network.


**LockIt v2** is a lightweight, client-side encryption companion tool for **Timeseed v2**.  
It is designed primarily for **Android browsers**, but also works on desktop platforms.

LockIt allows you to securely **encrypt and decrypt text** using a strong password or passkey.  
All cryptographic operations happen **entirely inside your browser** — no data is ever sent to any server.

---
## Checksum for the Lockit v2 page (december 2025)

MD5 : cf0d76322f74b4886ef735e065123dc3

SHA256 : 6452394b0f3ada0ce8840f45796fd6250accceeb89e9a3d51c8fa8b77a3781f2

## Overview

- Companion app to **Timeseed v2**
- Single-file HTML application
- Client-side, memory-hard cryptography
- Fully offline after initial load

LockIt is intended for **practical, everyday encryption** while preserving the same security principles as Timeseed.

---

## Cryptography

LockIt v2 uses modern, conservative cryptographic primitives:

- **Argon2id** — memory-hard key derivation  
  - Highly resistant to GPU and ASIC attacks
- **AES-GCM** — authenticated encryption
- Strong, deterministic key derivation compatible with Timeseed v2
- Custom **TS4 ciphertext format**

All cryptographic operations are performed locally in the browser.

---

## Features

- Memory-hard **Argon2id** key derivation
- **AES-GCM** authenticated encryption
- Encrypt and decrypt text instantly
- Clipboard tools: **copy, paste, clear**
- Built-in passkey **address book** (stored in `localStorage`)
- Fully offline after initial load
- Clean, mobile-first UI with dark theme
- Explicit **iOS compatibility warning**

---

## Usage

1. Enter your **password or passkey** in the top field.
2. Paste or type your **plaintext** (to encrypt)  
   or **TS4 ciphertext** (to decrypt) in the main text area.
3. Click:
   - **Encrypt →** to encrypt plaintext
   - **← Decrypt** to decrypt TS4 ciphertext
4. Copy the result or save the passkey to your address book for reuse.

The generated ciphertext is **fully compatible** with Timeseed v2 tools.

---

## Platform Support

### Recommended
- Android (Chrome, Firefox)
- Windows
- macOS
- Linux  
  (Chrome, Firefox, Edge, Chromium-based browsers)

### iOS / Safari
Due to **Apple-imposed memory and execution limits** on browser-based cryptography:

- Encryption and decryption buttons are disabled
- This is **not a bug**
- Security is intentionally **not weakened** to accommodate iOS

---

## File Integrity

**Lockit_RC1_H15.html**

Legal & Cryptographic Disclaimer

This is a standalone, open-source cryptographic tool that runs entirely in a modern web browser as a single HTML page.
All cryptographic operations (including Argon2 and AES-GCM) are performed locally on the user’s device.

No keys, passwords, seeds, or plaintext data are transmitted, stored, logged, or accessible to the author or any third party,
including servers, service providers, blockchains, telecommunications providers, or analytics platforms.
Users may transmit encrypted output at their own discretion.
Users are solely responsible for compliance with applicable laws and regulations in their jurisdiction.

This software is provided free of charge and without warranty of any kind, express or implied.
The author provides no service, holds no user keys, and has no technical ability to access, recover, or decrypt any data produced by this tool.
There is no server-side component, key escrow, administrative access, backdoor, or recovery mechanism.
Decryption is possible only with the user’s own TimeSeed, optional pepper, and selected parameters.

This software is published without restriction and does not require export authorisation under EU Regulation (EU) 2021/821 (dual-use items).
The source code is intended to be auditable and verifiable by independent third parties.

Use at your own risk.