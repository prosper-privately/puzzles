// hint3.js
(() => {
    // Alphabet per Hint 3: A-Z plus space plus period (28)
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
        // range check (0..27)
        nums.forEach(n => {
            if (n < 0 || n >= MOD) throw new Error(`Out of range (0–27): ${n}`);
        });
        return nums;
    }

    function normalizeLetters(str) {
        // Preserve spaces and periods; uppercase letters
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

    // ---------- wire up: Numbers -> Letters ----------
    const n2l_in = document.getElementById("n2l_in");
    const n2l_out = document.getElementById("n2l_out");
    const n2l_btn = document.getElementById("n2l_btn");
    const n2l_clear = document.getElementById("n2l_clear");
    const n2l_msg = document.getElementById("n2l_msg");

    n2l_btn.addEventListener("click", () => {
        try {
            const nums = parseNumbers(n2l_in.value);
            const letters = numsToLetters(nums);
            n2l_out.value = letters;
            setMsg(n2l_msg, `OK: Converted ${nums.length} number(s).`, "ok");
        } catch (e) {
            setMsg(n2l_msg, `ERROR: ${e.message || e}`, "err");
        }
    });

    n2l_clear.addEventListener("click", () => {
        n2l_in.value = "";
        n2l_out.value = "";
        setMsg(n2l_msg, "", "");
    });

    // ---------- wire up: Letters -> Numbers ----------
    const l2n_in = document.getElementById("l2n_in");
    const l2n_out = document.getElementById("l2n_out");
    const l2n_btn = document.getElementById("l2n_btn");
    const l2n_clear = document.getElementById("l2n_clear");
    const l2n_msg = document.getElementById("l2n_msg");

    l2n_btn.addEventListener("click", () => {
        try {
            const letters = normalizeLetters(l2n_in.value);
            if (!letters.length) throw new Error("Please enter at least 1 character.");
            validateLetters(letters);
            const nums = lettersToNums(letters);
            l2n_out.value = nums.join(" ");
            setMsg(l2n_msg, `OK: Converted ${letters.length} character(s).`, "ok");
        } catch (e) {
            setMsg(l2n_msg, `ERROR: ${e.message || e}`, "err");
        }
    });

    l2n_clear.addEventListener("click", () => {
        l2n_in.value = "";
        l2n_out.value = "";
        setMsg(l2n_msg, "", "");
    });

    // ---------- wire up: Encrypt ----------
    const enc_pad = document.getElementById("enc_pad");
    const enc_plain = document.getElementById("enc_plain");
    const enc_out = document.getElementById("enc_out");
    const enc_btn = document.getElementById("enc_btn");
    const enc_clear = document.getElementById("enc_clear");
    const enc_msg = document.getElementById("enc_msg");

    enc_btn.addEventListener("click", () => {
        try {
            const padNums = parseNumbers(enc_pad.value);
            const plain = normalizeLetters(enc_plain.value);
            if (!plain.length) throw new Error("Please enter at least 1 plaintext character.");
            validateLetters(plain);
            const cipher = encrypt(padNums, plain);
            enc_out.value = cipher;
            setMsg(enc_msg, `OK: Encrypted ${plain.length} character(s).`, "ok");
        } catch (e) {
            setMsg(enc_msg, `ERROR: ${e.message || e}`, "err");
        }
    });

    enc_clear.addEventListener("click", () => {
        enc_pad.value = "";
        enc_plain.value = "";
        enc_out.value = "";
        setMsg(enc_msg, "", "");
    });

    // ---------- wire up: Decrypt ----------
    const dec_pad = document.getElementById("dec_pad");
    const dec_cipher = document.getElementById("dec_cipher");
    const dec_out = document.getElementById("dec_out");
    const dec_btn = document.getElementById("dec_btn");
    const dec_clear = document.getElementById("dec_clear");
    const dec_msg = document.getElementById("dec_msg");

    dec_btn.addEventListener("click", () => {
        try {
            const padNums = parseNumbers(dec_pad.value);
            const cipher = normalizeLetters(dec_cipher.value);
            if (!cipher.length) throw new Error("Please enter at least 1 ciphertext character.");
            validateLetters(cipher);
            const plain = decrypt(padNums, cipher);
            dec_out.value = plain;
            setMsg(dec_msg, `OK: Decrypted ${cipher.length} character(s).`, "ok");
        } catch (e) {
            setMsg(dec_msg, `ERROR: ${e.message || e}`, "err");
        }
    });

    dec_clear.addEventListener("click", () => {
        dec_pad.value = "";
        dec_cipher.value = "";
        dec_out.value = "";
        setMsg(dec_msg, "", "");
    });

    // Initialize message areas to empty
    setMsg(n2l_msg, "", "");
    setMsg(l2n_msg, "", "");
    setMsg(enc_msg, "", "");
    setMsg(dec_msg, "", "");
})();
