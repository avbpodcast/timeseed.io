# Sovereign Encryption

A single-file, browser-based, post-quantum encryption tool. Use it as a private second layer on top of any messenger — WhatsApp, Signal, Telegram, email, even paper.

No accounts. No servers. No tracking. Your private key never leaves the device.

[Support development → timeseed.io/donate](https://timeseed.io/donate)

---

## What it is

`Sovereign_Encryption_050.html` is a self-contained web page. Open it in a modern browser and you get:

- A **post-quantum keypair generator** (ML-KEM-768, FIPS 203).
- A **text encryptor** that produces a hex blob you can paste into any chat.
- A **file encryptor** that produces a `.locked` armored text file you can attach anywhere.
- A **local address book** for your recipients' public keys, stored in your browser's `localStorage` only.
- An **Identity Passport** view for visually comparing fingerprints before trusting a public key.

Everything is inert HTML, CSS, and JavaScript. There is no network call, no analytics, no telemetry, no external font, no CDN. The Argon2 WebAssembly blob and the ML-KEM-768 library are inlined in the file.

## Why

End-to-end encryption in mainstream messengers is good. It is also opaque, easy to lose track of, and increasingly threatened by "client-side scanning" and similar proposals that erode E2E from the inside.

Sovereign Encryption sits **outside** any messenger. You encrypt in your browser, paste the ciphertext into whatever messenger you happen to be using, and the recipient pastes it back into their browser to decrypt. The messenger sees only ciphertext. If the messenger is compromised, replaced, or backdoored, the content stays private — the only party that can read it is the holder of the matching private key.

The cryptography is **post-quantum** by construction. A future cryptographically relevant quantum computer that breaks RSA and elliptic-curve key exchange does not break the construction used here.

## Quick start

1. **Open the file.** Double-click `Sovereign_Encryption_050.html` or open it from any folder. You can also host it on any static web server — it has no backend.
2. **Step 1 — Create your identity.** Click *Generate new identity*. A keypair appears. Download the `.se.key` (private) file and keep it somewhere safe — there is no recovery. Share your public key with anyone who wants to send you messages.
3. **Step 2 — Send.** Paste your recipient's public key (or upload their `.se.pub` file). Type a message or pick a file. Click *Encrypt*. Copy the blob or take the `.locked` file and send it through any channel.
4. **Step 3 — Read.** Paste a blob you received (or upload a `.locked` file). Click *Decrypt*.

The Welcome modal walks you through the same flow on first launch and can be re-opened from local storage if needed.

## How it works (cryptography)

| Step               | Primitive                                                     |
| ------------------ | ------------------------------------------------------------- |
| Key exchange       | **ML-KEM-768** (FIPS 203)                                     |
| Symmetric cipher   | **AES-256-GCM** with a random 12-byte IV per message          |
| Key derivation     | **HKDF-SHA-256** over the ML-KEM shared secret                |
| Private-key wrap   | **Argon2id** (t=5, m=128 MiB, p=1) + AES-256-GCM (optional)   |
| Fingerprint        | First 8 bytes of `SHA-256(public_key)`                        |

A new ephemeral KEM ciphertext + IV are generated for every message, so the same plaintext encrypts to a different blob every time.

**Authenticity** is *not* built in. ML-KEM, like ECDH and RSA, provides confidentiality of the shared secret to whoever holds the matching secret key, but it does *not* by itself tell you which public key belongs to whom. Compare fingerprints by sight (the Identity Passport view) or over a channel you already trust before treating a public key as authentic.

## Wire formats

### Text format (v6)

```
"TS4" (3 B)  +  0x06 (version)  +  0x01 (kemId = ML-KEM-768)
  +  IV (12 B)
  +  ctKemLen (u16 BE)  +  ctKem (1088 B)
  +  AES-256-GCM ciphertext
```

The whole thing is then hex-encoded for paste-into-chat use. AES-GCM additional-data (AAD) is the 1106-byte header before the ciphertext, so any tampering with the header is detected.

### File format (TS4F v6)

PEM-style armored text, base64 body, header lines for:

`Version`, `Container`, `Scheme`, `Recipient: sha256/8: <FP>`, `Sender` and `Sender-PK` (optional, included when "Let the recipient reply to me" is checked), `Created`, `File-name`, `Mime`, `File-size`, `Comment`.

### Key armor

`-----BEGIN SOVEREIGN PUBLIC KEY-----` and `-----BEGIN SOVEREIGN PRIVATE KEY-----` blocks with `Version: 3.1`, `Scheme: ML-KEM-768`, and `Fingerprint: sha256/8: <fp>`. Private-key blocks can be passphrase-wrapped with Argon2id + AES-256-GCM, in which case the BEGIN line reads `... PRIVATE KEY (ENCRYPTED)`.

**Backward compatibility:** the parser also reads the older `-----BEGIN TIMESEED PUBLIC KEY-----` / `-----BEGIN TIMESEED SECRET KEY-----` blocks produced by earlier prototype builds, so existing `.timeseed.pub` / `.timeseed.key` files still load.

## Privacy

- No network requests. Verify in DevTools → Network: there should be zero entries when you load and use the page.
- No analytics, no fonts from CDNs, no remote anything.
- The address book is stored under the key `ts31-address-book-v1` in your browser's `localStorage`. Clear browser storage to wipe it; it does not sync.
- The self-test cache flag is stored under `ts31-self-test-passed-v1`, again purely in `localStorage`.

## Browser support

Tested on recent Firefox, Chromium, and Safari. The page uses `crypto.subtle`, `crypto.getRandomValues`, WebAssembly, and `localStorage`. The startup self-test verifies that all three are present and working before letting you encrypt anything — if any check fails, the squares at the top of the page turn oxblood and the failure is shown verbatim.

## Build status / verification

Click **Test section** at the top of the page and then **Run checks** to run a live self-test of every embedded primitive: RNG, SHA-3, AES-GCM, HKDF, ML-KEM-768, Argon2id, and the 10,000-word Amulet passphrase wordlist used by the dice button in Step 1.

The lightweight 3-square startup self-test runs automatically on first page load in a session and is cached afterward.

## Building / contributing

There is nothing to build — the file is the artifact. Edits go directly into `Sovereign_Encryption_NNN.html`. The convention used during development is one numbered file per change; the highest number is the active build.

When sending a pull request, please describe the behavioural change in plain language and explain why a user would want it. Don't change the wire format or storage keys without bumping the version byte; existing messages and address books must continue to decrypt and load.

## License

MIT, with a non-binding request that any redistribution or derivative give visible credit to *Sovereign Encryption — manuelvde*. See [LICENSE](LICENSE) for the exact terms.

## Support development

If this tool helps you, please consider supporting development:

**[timeseed.io/donate](https://timeseed.io/donate)**
