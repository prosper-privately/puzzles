// hint7.js
(() => {
    // ---------- Ciphertexts (hard-coded) ----------
    const CIPHERS_RAW = `
WUPYXLVVKAEG..E  NL TBVXYOPHXLWUFVAPLF.SVG.IQIOVFMPCZ.MIJ YPAWW
WNGOGIEDDAEMDKWNFVHPGOSNARVAYZP MWOPWJBWIJUITXOEMACSZFD
LLAQCAQIUWGWXCH BKFATBRUXYUAHIYAUSNHUDQSVRIKQRHJCGUDEYD
WNGOEEUNKKXHLU  WGZ VOT.HSQANBINVWJ.LDNV.EMEMVUUYURJZOMBFFO.QV.Z
WUPYXLVVKAESAQV  NL UZYTHKCFE.YJKMPYZDLSZOJVLRKQPSPEVGXJ
GUABDXAOQGKCETM IUVKBXVBYGPVNBILSQEEZDW. EFVMMUARPVZLQJOFRVLOI Z
EXKBXCCVSYSICMH  GREAZRCQYIQELPUFVAPKJYWKKVPZFOHJIHGU
PKGHPEVVHDKCQQTIFG  PLFAHBDOUO.IINWRXYU.JXGRXSOQPLVQTGSCWO
DLVUGCY.O UTJK.HLEYEEFGTIILGEPOFZMEITYIMXELZFT.ABMAHU
GUABDXA.QPEXUQGEAOKEP.XNJQRKTYIFOEPPMNGSVCIJKCUHRGXQZQWOFBXXPL.YUJV.VO
`.trim();

    // ---------- Alphabet / maps ----------
    const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", " ", "."];
    const MOD = ALPHABET.length; // 28
    const CHAR_TO_NUM = new Map(ALPHABET.map((ch, i) => [ch, i]));
    const NUM_TO_CHAR = new Map(ALPHABET.map((ch, i) => [i, ch]));

    // ---------- UI ----------
    const positionInput = document.getElementById("position");
    const guessInput = document.getElementById("guess");
    const doGuessBtn = document.getElementById("doGuess");
    const nextBtn = document.getElementById("nextBtn");
    const acceptBtn = document.getElementById("acceptBtn");
    const resetKeyBtn = document.getElementById("resetKey");

    const statusEl = document.getElementById("status");
    const previewEl = document.getElementById("preview");
    const keyViewEl = document.getElementById("keyView");

    const msgCountEl = document.getElementById("msgCount");
    const maxLenEl = document.getElementById("maxLen");
    const targetIdxEl = document.getElementById("targetIdx");
    const cipherPreviewEl = document.getElementById("cipherPreview");

    // ---------- State ----------
    const ciphers = parseCipherLines(CIPHERS_RAW);
    const maxLen = ciphers.reduce((m, s) => Math.max(m, s.length), 0);
    let key = Array(maxLen).fill(null);     // sparse key: number or null
    let currentTarget = 0;                 // which ciphertext "Next" is on
    let pendingFrag = null;                // Map(index -> keyNum) from current guess+target
    let pendingGuess = "";                 // normalized guess
    let pendingPos = 0;                    // parsed position

    // ---------- Init UI ----------
    msgCountEl.textContent = String(ciphers.length);
    maxLenEl.textContent = String(maxLen);
    targetIdxEl.textContent = String(currentTarget);
    renderCipherList();

    renderKey();
    renderPreview(null);
    setStatus("Ready. Enter a position and a guess, then click Guess.", "ok");

    // Auto-fill initial position to first unknown key position (0)
    positionInput.value = String(findNextUnknownPos(0));

    // ---------- Helpers ----------
    function setStatus(msg, kind = "") {
        statusEl.textContent = msg;
        statusEl.classList.remove("ok", "err");
        if (kind) statusEl.classList.add(kind);
    }

    function normalizeGuess(s) {
        return s.toUpperCase();
    }

    function validateAllowedChars(s) {
        for (const ch of s) {
            if (!CHAR_TO_NUM.has(ch)) return ch;
        }
        return null;
    }

    function parseCipherLines(raw) {
        const lines = raw
            .split(/\r?\n/)
            .map(l => l.replace(/\s+$/g, "")) // trim end whitespace only
            .filter(l => l.length > 0);

        for (let i = 0; i < lines.length; i++) {
            const bad = validateAllowedChars(lines[i]);
            if (bad) throw new Error(`Invalid character in ciphertext line ${i}: ${JSON.stringify(bad)}`);
        }
        return lines;
    }

    function mergedKeyWithFrag(frag) {
        const merged = key.slice();
        if (frag) {
            for (const [idx, k] of frag.entries()) merged[idx] = k;
        }
        return merged;
    }

    function decryptWithKey(ct, kArr) {
        let out = "";
        for (let i = 0; i < ct.length; i++) {
            const k = kArr[i];
            if (k == null) {
                out += "_";
            } else {
                const cNum = CHAR_TO_NUM.get(ct[i]);
                const pNum = (cNum - k + MOD) % MOD;
                out += NUM_TO_CHAR.get(pNum);
            }
        }
        return out;
    }

    function renderCipherList() {
        let html = "";
        for (let i = 0; i < ciphers.length; i++) {
            const arrow = (i === currentTarget) ? "&rarr;" : "&nbsp;";

            const active = (i === currentTarget) ? " active" : "";
            html += `<div class="cipherRow${active}" data-idx="${i}">` +
                `<span class="arrow">${arrow}</span>` +
                `${String(i).padStart(2, " ")}: ${escapeHtml(ciphers[i])}` +
                `</div>`;
        }
        cipherPreviewEl.innerHTML = html;
    }

    function renderPreview(frag) {
        const baseKeyArr = key;
        const candKeyArr = mergedKeyWithFrag(frag);

        let html = "";
        for (let i = 0; i < ciphers.length; i++) {
            const ct = ciphers[i];
            const base = decryptWithKey(ct, baseKeyArr);
            const cand = decryptWithKey(ct, candKeyArr);
            const active = (i === currentTarget) ? " active" : "";
            const arrow = (i === currentTarget) ? "→" : " ";
            html += `<div class="line previewRow${active}" data-idx="${i}"><span class="arrow">${arrow}</span><span class="idx">${String(i).padStart(2, " ")}: </span>`;

            for (let j = 0; j < cand.length; j++) {
                const changed = base[j] !== cand[j]; // ← THIS is the key comparison
                const cls = changed ? "ch hl" : "ch";
                html += `<span class="${cls}">${escapeHtml(cand[j])}</span>`;
            }
            html += `</div>`;
        }

        previewEl.innerHTML = html || "(no preview)";
    }


    function renderKey() {
        const parts = [];
        for (let i = 0; i < maxLen; i++) parts.push(key[i] == null ? "" : String(key[i]));
        keyViewEl.value = parts.join(" ");
    }

    function computeFragForTarget(targetIdx, pos, guess) {
        const ct = ciphers[targetIdx];
        if (pos < 0) throw new Error("Position must be >= 0.");
        if (pos + guess.length > ct.length) throw new Error("Guess would run past end of this ciphertext.");

        const frag = new Map(); // index -> keyNum
        for (let off = 0; off < guess.length; off++) {
            const i = pos + off;
            const pCh = guess[off];
            const cCh = ct[i];

            const pNum = CHAR_TO_NUM.get(pCh);
            const cNum = CHAR_TO_NUM.get(cCh);

            const kGuess = (cNum - pNum + MOD) % MOD; // k = c - p mod 28

            const known = key[i];
            if (known != null && known !== kGuess) {
                throw new Error(`Key conflict at position ${i}: known=${known}, guessed=${kGuess}`);
            }
            if (frag.has(i) && frag.get(i) !== kGuess) {
                throw new Error(`Internal conflict at position ${i}: guessed both ${frag.get(i)} and ${kGuess}`);
            }
            frag.set(i, kGuess);
        }
        return frag;
    }

    function commitFrag(frag) {
        for (const [idx, kNum] of frag.entries()) key[idx] = kNum;
    }

    function validateInputs() {
        const posRaw = positionInput.value.trim();
        if (!/^\d+$/.test(posRaw)) throw new Error("Position must contain only numbers (0, 1, 2, ...).");
        const pos = Number(posRaw);

        const guessRaw = guessInput.value;
        if (!guessRaw || guessRaw.length < 1) throw new Error("Guess must include at least 1 character.");
        const guess = normalizeGuess(guessRaw);

        const bad = validateAllowedChars(guess);
        if (bad) throw new Error(`Guess contains invalid character: ${JSON.stringify(bad)}. Allowed: A–Z, space, period.`);

        return { pos, guess };
    }

    function tryTarget(idx) {
        targetIdxEl.textContent = String(idx);
        renderCipherList();
        try {
            const frag = computeFragForTarget(idx, pendingPos, pendingGuess);
            pendingFrag = frag;
            renderPreview(pendingFrag);

            setStatus(
                `Trying ${JSON.stringify(pendingGuess)} at position ${pendingPos} on ciphertext #${idx}.`,
                "ok"
            );

            nextBtn.disabled = !(idx + 1 < ciphers.length);
            acceptBtn.disabled = false;
        } catch (e) {
            pendingFrag = null;
            renderPreview(null);
            setStatus(`Target #${idx} rejected: ${String(e.message || e)}`, "err");

            nextBtn.disabled = !(idx + 1 < ciphers.length);
            acceptBtn.disabled = true;
        }
    }

    function startGuess() {
        let pos, guess;
        try {
            ({ pos, guess } = validateInputs());
        } catch (e) {
            setStatus(String(e.message || e), "err");
            return;
        }

        pendingPos = pos;
        pendingGuess = guess;
        tryTarget(currentTarget);
    }

    function nextTarget() {
        if (!pendingGuess) {
            setStatus("Click Guess first.", "err");
            return;
        }
        if (currentTarget + 1 >= ciphers.length) {
            setStatus("No more ciphertexts.", "err");
            return;
        }
        currentTarget += 1;
        tryTarget(currentTarget);
    }

    function findNextUnknownPos(startAt) {
        for (let i = Math.max(0, startAt); i < maxLen; i++) {
            if (key[i] == null) return i;
        }
        return maxLen; // none left
    }

    function acceptGuess() {
        if (!pendingFrag) {
            setStatus("Nothing to accept (current target guess was rejected).", "err");
            return;
        }

        commitFrag(pendingFrag);
        pendingFrag = null;

        renderKey();
        renderPreview(null);

        setStatus(
            `Key updated (ciphertext #${currentTarget}, pos ${pendingPos}, guess ${JSON.stringify(pendingGuess)}).`,
            "ok"
        );

        // Disable Next/Accept until a new Guess
        nextBtn.disabled = true;
        acceptBtn.disabled = true;

        // ---- Requested tweak #2 ----
        // Move position to next unknown key position and clear guess field.
        const nextPos = findNextUnknownPos(pendingPos);
        if (nextPos >= maxLen) {
            positionInput.value = String(maxLen);
            setStatus("Key is complete. No unknown positions remain.", "ok");
        } else {
            positionInput.value = String(nextPos);
        }
        guessInput.value = "";

        // Clear pending guess so Next can't be used without a fresh Guess
        pendingGuess = "";
    }

    function resetKey() {
        key = Array(maxLen).fill(null);
        pendingFrag = null;
        pendingGuess = "";
        pendingPos = 0;
        currentTarget = 0;

        renderKey();
        renderPreview(null);
        targetIdxEl.textContent = String(currentTarget);
        nextBtn.disabled = true;
        acceptBtn.disabled = true;

        positionInput.value = String(findNextUnknownPos(0));
        guessInput.value = "";
        setStatus("Key reset.", "ok");
    }

    function escapeHtml(s) {
        return s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }


    // ---------- Events ----------
    // Enforce numeric-only typing (still validate on submit)
    positionInput.addEventListener("input", () => {
        positionInput.value = positionInput.value.replace(/[^\d]/g, "");
    });

    doGuessBtn.addEventListener("click", startGuess);
    nextBtn.addEventListener("click", nextTarget);
    acceptBtn.addEventListener("click", acceptGuess);
    resetKeyBtn.addEventListener("click", resetKey);
    cipherPreviewEl.addEventListener("click", (ev) => {
        console.log("click: ", ev)
        const el = (ev.target && ev.target.nodeType === 1) ? ev.target : ev.target.parentElement;
        const row = el ? el.closest(".cipherRow") : null;

        if (!row) return;

        console.log("click row: ", row)

        const idx = Number(row.dataset.idx);
        if (!Number.isFinite(idx)) return;

        console.log("click idx: ", idx)

        currentTarget = idx;
        targetIdxEl.textContent = String(currentTarget);
        renderCipherList();

        // If a guess is currently loaded, immediately re-try it on this ciphertext
        if (pendingGuess) {
            tryTarget(currentTarget);
        } else {
            setStatus(`Switched target to ciphertext #${currentTarget}.`, "ok");
        }
    });

    previewEl.addEventListener("click", (ev) => {
        const el = (ev.target && ev.target.nodeType === 1) ? ev.target : ev.target.parentElement;
        const row = el ? el.closest(".previewRow") : null;
        if (!row) return;

        const idx = Number(row.dataset.idx);
        if (!Number.isFinite(idx)) return;

        currentTarget = idx;
        targetIdxEl.textContent = String(currentTarget);

        // Re-render preview to move the arrow/highlighted active row
        renderPreview(pendingFrag);

        // If a guess is currently loaded, immediately re-try on this ciphertext
        if (pendingGuess) {
            tryTarget(currentTarget);
        } else {
            setStatus(`Switched target to message #${currentTarget}.`, "ok");
        }
    });


})();
