# LockIt v3

LockIt v3 is a lightweight, client-side encryption companion tool for TimeSeed v3.  
It is designed primarily for mobile browsers (especially Android), but works equally well on desktop platforms.

LockIt allows you to securely encrypt and decrypt text using a strong password or TimeSeed v3-derived passkey.  
All cryptographic operations happen entirely inside your browser — no data is ever sent to any server.

## Checksum for the LockIt v3 page (January 2026)
These checksums apply to the single HTML file distributed with this release.  
Users are encouraged to verify integrity after download.

* MD5  
  *(to be added)*

* SHA-256  
  *(to be added)*

## Overview

* Companion tool to TimeSeed v3
* Single-file HTML application
* Hybrid post-quantum client-side key derivation (Argon2id + ML-KEM)
* Fully offline after initial load
* Backward-compatible decryption of TimeSeed v2 / LockIt v2 ciphertexts

LockIt is intended for practical, everyday encryption while preserving the highest security standards of the TimeSeed system.

## What LockIt Is (and Is Not)

LockIt **is**:

* A client-side tool for encrypting and decrypting text
* Designed for use with strong passwords or TimeSeed v3-derived passkeys
* Fully offline and auditable
* Post-quantum ready (hybrid Argon2id + official NIST ML-KEM)

LockIt **is not**:

* A messaging app
* A password manager
* A key escrow or recovery service
* A server-backed system of any kind
* An anonymity or mixing tool

Key management, backups, and operational security remain the user’s responsibility.

## Key Derivation: Hybrid Post-Quantum (Argon2id + ML-KEM)

LockIt v3 uses a **hybrid** key derivation combining:

* **Argon2id** (memory-hard, 128 MiB, 5 iterations) — proven resistance to classical brute-force, GPU, and ASIC attacks
* **ML-KEM-768** (NIST-standard post-quantum KEM, formerly Kyber) — protection against future quantum computers

The process:
1. Argon2id derives a strong classical key from your password/passkey + random salt
2. Deterministic ML-KEM encapsulation adds a post-quantum shared secret
3. Both components are securely mixed via HKDF to produce the final 256-bit AES key

This hybrid design provides full future-proof security while remaining fast in browsers.

**Backward compatibility**: When decrypting older TS4 v4 ciphertexts (from v2), LockIt v3 silently falls back to pure Argon2id mode — no extra steps needed.

## Encryption & Ciphertext Format (TS4 v5)

**AES-256-GCM** is used for authenticated encryption (confidentiality + integrity).  
Any tampering is detected on decryption.

All new encrypted output uses the **TS4 v5** format:

* Starts with the magic bytes `"TS4"` followed by version `0x05`
* Includes a new header identifying the hybrid ML-KEM derivation
* Fully self-describing and versioned

Older v2 ciphertexts (starting with TS4 + version `0x04`) are automatically recognised and decrypted correctly.

## Features

* Hybrid post-quantum key derivation (Argon2id + ML-KEM)
* AES-256-GCM authenticated encryption
* Instant encrypt/decrypt of text
* Clipboard tools: copy, paste, clear
* Built-in passkey address book (localStorage, max 21 entries)
* Clean, mobile-first dark UI
* Self-test on load for crypto integrity
* Explicit iOS offline limitation warning

## Usage

1. Enter your password or TimeSeed v3-derived passkey in the top field.
2. Paste or type your plaintext (to encrypt) or TS4 ciphertext (to decrypt).
3. Click **Encrypt →** or **← Decrypt**.
4. Copy the result or save the passkey to the address book for reuse.

Ciphertexts produced by LockIt v3 are compatible with TimeSeed v3 tools but **not** with older v2 tools.

## Platform Support

**Recommended**

* Android (Chrome, Firefox, etc.)
* Windows / macOS / Linux desktop browsers

**iOS / Safari**

Due to Apple-imposed memory and execution limits on browser-based cryptography when running a standalone local HTML file:

* Encryption/decryption buttons are disabled offline
* This is **not a bug** — security is intentionally not weakened
* Online use (via https://timeseed.io/Lockit/) works normally on iOS

For reliable offline use, prefer Android or desktop browsers.

## Legal & Cryptographic Disclaimer

This is a standalone, open-source cryptographic tool that runs entirely in a modern web browser as a single HTML page.  
All cryptographic operations (Argon2id, ML-KEM, AES-256-GCM) are performed **locally on the user’s device**.  

**No keys, passwords, seeds, or plaintext data** are transmitted, stored, logged, or accessible to the author or any third party — including servers, service providers, blockchains, telecommunications providers, or analytics platforms.  
Users may transmit encrypted output at their own discretion.  

Users are solely responsible for compliance with applicable laws and regulations in their jurisdiction.  
This software is provided free of charge and without warranty of any kind, express or implied.  
The author provides no service, holds no user keys, and has no technical ability to access, recover, or decrypt any data produced by this tool.  
There is no server-side component, key escrow, administrative access, backdoor, or recovery mechanism.  

This software is published without restriction and does not require export authorisation under EU Regulation (EU) 2021/821 (dual-use items).  
The source code is intended to be auditable and verifiable by independent third parties.  

**Use at your own risk.**

"Proof of Work is Life"