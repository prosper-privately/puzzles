// hint3.js
(() => {
    // Alphabet: A-Z plus space plus period (28)
    const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", " ", "."];
    const MOD = ALPHABET.length; // 28
    const CHAR_TO_NUM = new Map(ALPHABET.map((ch, i) => [ch, i]));
    const NUM_TO_CHAR = new Map(ALPHABET.map((ch, i) => [i, ch]));

    // ---------- helpers ----------
    function parseNumbers(str) {
        const s = (str || "").trim();
        if (!s) return [];
        const parts = s.split(/\s+/);
        const nums = parts.map(p => {
            if (!/^-?\d+$/.test(p)) throw new Error(`Invalid number: ${p}`);
            const n = Number(p);
            if (!Number.isFinite(n)) throw new Error(`Invalid number: ${p}`);
            return n;
        });
        nums.forEach(n => {
            if (n < 0 || n >= MOD) throw new Error(`Out of range (0–27): ${n}`);
        });
        return nums;
    }

    function normalizeLetters(str) {
        return (str || "").toUpperCase();
    }

    function validateLetters(str) {
        for (const ch of str) {
            if (!CHAR_TO_NUM.has(ch)) {
                throw new Error(`Invalid character: ${JSON.stringify(ch)} (allowed: A–Z, space, period)`);
            }
        }
    }

    function setMsg(el, text, kind) {
        el.textContent = text;
        el.classList.remove("ok", "err");
        if (kind) el.classList.add(kind);
    }

    function numsToLetters(nums) {
        return nums.map(n => NUM_TO_CHAR.get(n)).join("");
    }

    function lettersToNums(letters) {
        return [...letters].map(ch => CHAR_TO_NUM.get(ch));
    }

    function encrypt(padNums, plainLetters) {
        const pNums = lettersToNums(plainLetters);
        if (padNums.length < pNums.length) throw new Error(`Pad too short: pad=${padNums.length}, text=${pNums.length}`);
        const cNums = pNums.map((p, i) => (p + padNums[i]) % MOD);
        return numsToLetters(cNums);
    }

    function decrypt(padNums, cipherLetters) {
        const cNums = lettersToNums(cipherLetters);
        if (padNums.length < cNums.length) throw new Error(`Pad too short: pad=${padNums.length}, text=${cNums.length}`);
        const pNums = cNums.map((c, i) => (c - padNums[i] + MOD) % MOD);
        return numsToLetters(pNums);
    }

    async function copyToClipboard(text) {
        if (!text) return false;
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback (older browsers / file:// restrictions)
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            let ok = false;
            try { ok = document.execCommand("copy"); } catch { ok = false; }
            document.body.removeChild(ta);
            return ok;
        }
    }

    // ---------- Elements ----------
    const n2l_in = document.getElementById("n2l_in");
    const n2l_out = document.getElementById("n2l_out");
    const n2l_copy = document.getElementById("n2l_copy");
    const n2l_clear = document.getElementById("n2l_clear");
    const n2l_msg = document.getElementById("n2l_msg");

    const l2n_in = document.getElementById("l2n_in");
    const l2n_out = document.getElementById("l2n_out");
    const l2n_copy = document.getElementById("l2n_copy");
    const l2n_clear = document.getElementById("l2n_clear");
    const l2n_msg = document.getElementById("l2n_msg");

    const enc_pad = document.getElementById("enc_pad");
    const enc_plain = document.getElementById("enc_plain");
    const enc_out = document.getElementById("enc_out");
    const enc_copy = document.getElementById("enc_copy");
    const enc_clear = document.getElementById("enc_clear");
    const enc_msg = document.getElementById("enc_msg");

    const dec_pad = document.getElementById("dec_pad");
    const dec_cipher = document.getElementById("dec_cipher");
    const dec_out = document.getElementById("dec_out");
    const dec_copy = document.getElementById("dec_copy");
    const dec_clear = document.getElementById("dec_clear");
    const dec_msg = document.getElementById("dec_msg");

    // ---------- Live update functions ----------
    function updateN2L() {
        const raw = n2l_in.value;
        if (!raw.trim()) {
            n2l_out.value = "";
            setMsg(n2l_msg, "", "");
            return;
        }
        try {
            const nums = parseNumbers(raw);
            n2l_out.value = numsToLetters(nums);
            setMsg(n2l_msg, `OK: Converted ${nums.length} number(s).`, "ok");
        } catch (e) {
            n2l_out.value = "";
            setMsg(n2l_msg, `ERROR: ${e.message || e}`, "err");
        }
    }

    function updateL2N() {
        const raw = l2n_in.value;
        if (!raw.length) {
            l2n_out.value = "";
            setMsg(l2n_msg, "", "");
            return;
        }
        try {
            const letters = normalizeLetters(raw);
            validateLetters(letters);
            l2n_out.value = lettersToNums(letters).join(" ");
            setMsg(l2n_msg, `OK: Converted ${letters.length} character(s).`, "ok");
        } catch (e) {
            l2n_out.value = "";
            setMsg(l2n_msg, `ERROR: ${e.message || e}`, "err");
        }
    }

    function updateEnc() {
        const padRaw = enc_pad.value;
        const plainRaw = enc_plain.value;
        if (!padRaw.trim() && !plainRaw.trim()) {
            enc_out.value = "";
            setMsg(enc_msg, "", "");
            return;
        }
        try {
            const padNums = parseNumbers(padRaw);
            const plain = normalizeLetters(plainRaw);
            if (!plain.length) throw new Error("Please enter at least 1 plaintext character.");
            validateLetters(plain);
            enc_out.value = encrypt(padNums, plain);
            setMsg(enc_msg, `OK: Encrypted ${plain.length} character(s).`, "ok");
        } catch (e) {
            enc_out.value = "";
            setMsg(enc_msg, `ERROR: ${e.message || e}`, "err");
        }
    }

    function updateDec() {
        const padRaw = dec_pad.value;
        const cipherRaw = dec_cipher.value;
        if (!padRaw.trim() && !cipherRaw.trim()) {
            dec_out.value = "";
            setMsg(dec_msg, "", "");
            return;
        }
        try {
            const padNums = parseNumbers(padRaw);
            const cipher = normalizeLetters(cipherRaw);
            if (!cipher.length) throw new Error("Please enter at least 1 ciphertext character.");
            validateLetters(cipher);
            dec_out.value = decrypt(padNums, cipher);
            setMsg(dec_msg, `OK: Decrypted ${cipher.length} character(s).`, "ok");
        } catch (e) {
            dec_out.value = "";
            setMsg(dec_msg, `ERROR: ${e.message || e}`, "err");
        }
    }

    // ---------- Wire live updates ----------
    n2l_in.addEventListener("input", updateN2L);
    l2n_in.addEventListener("input", updateL2N);
    enc_pad.addEventListener("input", updateEnc);
    enc_plain.addEventListener("input", updateEnc);
    dec_pad.addEventListener("input", updateDec);
    dec_cipher.addEventListener("input", updateDec);

    // ---------- Copy buttons ----------
    n2l_copy.addEventListener("click", async () => {
        const ok = await copyToClipboard(n2l_out.value);
        setMsg(n2l_msg, ok ? "OK: Copied output to clipboard." : "ERROR: Could not copy output.", ok ? "ok" : "err");
    });

    l2n_copy.addEventListener("click", async () => {
        const ok = await copyToClipboard(l2n_out.value);
        setMsg(l2n_msg, ok ? "OK: Copied output to clipboard." : "ERROR: Could not copy output.", ok ? "ok" : "err");
    });

    enc_copy.addEventListener("click", async () => {
        const ok = await copyToClipboard(enc_out.value);
        setMsg(enc_msg, ok ? "OK: Copied output to clipboard." : "ERROR: Could not copy output.", ok ? "ok" : "err");
    });

    dec_copy.addEventListener("click", async () => {
        const ok = await copyToClipboard(dec_out.value);
        setMsg(dec_msg, ok ? "OK: Copied output to clipboard." : "ERROR: Could not copy output.", ok ? "ok" : "err");
    });

    // ---------- Clear buttons ----------
    n2l_clear.addEventListener("click", () => {
        n2l_in.value = "";
        n2l_out.value = "";
        setMsg(n2l_msg, "", "");
    });

    l2n_clear.addEventListener("click", () => {
        l2n_in.value = "";
        l2n_out.value = "";
        setMsg(l2n_msg, "", "");
    });

    enc_clear.addEventListener("click", () => {
        enc_pad.value = "";
        enc_plain.value = "";
        enc_out.value = "";
        setMsg(enc_msg, "", "");
    });

    dec_clear.addEventListener("click", () => {
        dec_pad.value = "";
        dec_cipher.value = "";
        dec_out.value = "";
        setMsg(dec_msg, "", "");
    });

    // Initial state
    setMsg(n2l_msg, "", "");
    setMsg(l2n_msg, "", "");
    setMsg(enc_msg, "", "");
    setMsg(dec_msg, "", "");
})();
