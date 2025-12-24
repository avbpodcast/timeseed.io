# LockIt v2

**LockIt v2** is a lightweight, client-side encryption companion tool for **Timeseed v2**.  
It is designed primarily for **Android browsers**, but also works on desktop platforms.

LockIt allows you to securely **encrypt and decrypt text** using a strong password or passkey.  
All cryptographic operations happen **entirely inside your browser** — no data is ever sent to any server.

---

## Checksum for the LockIt v2 page (December 2025)

These checksums apply to the **single HTML file** distributed with this release.  
Users are encouraged to verify integrity **after download**.

- **MD5**  
  `9dfe4cf1239d62e83f86d5a7ddb8f13e`

- **SHA-256**  
  `25ded731122b6ffd89f5bd202dab6396dfc8e7c9c6a4d629a8a7fc22406ceed4`

---

## Overview

- Companion app to **Timeseed v2**
- Single-file HTML application
- Client-side, memory-hard key derivation
- Fully offline after initial load

LockIt is intended for **practical, everyday encryption** while preserving the same security principles as Timeseed.

---

## What LockIt Is (and Is Not)

**LockIt is:**
- A client-side tool for encrypting and decrypting text
- Designed for use with strong passwords or Timeseed-derived passkeys
- Fully offline and auditable

**LockIt is not:**
- A messaging app
- A password manager
- A key escrow or recovery service
- A server-backed system of any kind
- An anonymity or mixing tool

Key management, backups, and operational security remain the **user’s responsibility**.

---

## Key Derivation: Argon2id

LockIt v2 uses **Argon2id** as its Key Derivation Function (KDF).

### Why Argon2id

- Argon2id is the current **best-practice** password-based KDF
- It is **memory-hard**, not just CPU-hard
- It resists:
  - GPU attacks
  - ASIC attacks
  - Large-scale parallel cracking

This matters because attackers can easily scale compute, but **cannot cheaply scale memory**.

### How Argon2id Is Used in LockIt

- User input (password or passkey) is **never used directly**
- It is first passed through Argon2id to derive a cryptographic key
- The derivation is:
  - Deterministic (same input → same key)
  - Compatible with Timeseed v2 derivation logic
  - Tuned for realistic browser environments

Parameters are chosen conservatively and intentionally **not exposed for tweaking**, to avoid unsafe configurations and to preserve cross-tool compatibility.

All derivation happens **locally in the browser**.

---

## Encryption & Ciphertext Format (TS4)

### AES-GCM Encryption

After key derivation, LockIt uses:

- **AES-GCM**
  - Authenticated encryption
  - Confidentiality + integrity in one primitive
  - Widely reviewed and hardware-accelerated

Any tampering with the ciphertext is detected during decryption.

---

### TS4 Ciphertext Format

All encrypted output produced by LockIt uses the **TS4 ciphertext format**, which is:

- Deterministic
- Self-describing
- Versioned

Every TS4 ciphertext begins with the prefix:
"54533"

### Why the `54533` Prefix Exists

This prefix is **intentional and important**.

It serves as:
- A **magic marker** (to identify valid LockIt / Timeseed ciphertext)
- A **version indicator** (TS4)
- A forward-compatibility mechanism

Seeing this prefix in plaintext output is **normal and expected**.

It allows:
- Safe parsing
- Clear format detection
- Future format upgrades without ambiguity
- Coexistence of multiple encryption versions over time

This design avoids silent failures and enables long-term compatibility across Timeseed tools.

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
2. Paste or type your:
   - **plaintext** (to encrypt), or
   - **TS4 ciphertext** (to decrypt)
3. Click:
   - **Encrypt →** to encrypt plaintext
   - **← Decrypt** to decrypt ciphertext
4. Copy the result or save the passkey to the address book for reuse.

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

Due to **Apple-imposed memory and execution limits** on browser-based cryptography **when running a standalone local HTML file** on iPhone or iPad:

- Encryption and decryption buttons are disabled
- This behavior applies to **offline / local-file execution**
- It is **not a bug**
- Security is intentionally **not weakened** to accommodate iOS

When accessed via the **online version**, these limitations do not apply and the tool operates normally on iOS devices.

This difference is caused by **WebKit’s stricter limits on local-file execution contexts**.

---

## File Integrity & Disclaimer

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

**Use at your own risk.**

"Proof of Work, is life"
