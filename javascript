Qualtrics.SurveyEngine.addOnReady(function () {
    const qid = this.questionId;
    const input = this.getQuestionContainer().querySelector("textarea, input[type='text'], input");

    if (!input) {
        console.log("NO INPUT FOUND for", qid);
        return;
    }

    let focusTime = null;
    let firstKeyTime = null;
    let lastKeyTime = null;
    let keyCount = 0;
    let backspaces = 0;
    let pasteCount = 0;

    input.addEventListener("focus", function () {
        if (focusTime === null) focusTime = Date.now();
    });

    input.addEventListener("keydown", function (e) {
        const now = Date.now();
        if (firstKeyTime === null) firstKeyTime = now;
        lastKeyTime = now;
        keyCount++;
        if (e.key === "Backspace") backspaces++;
    });

    input.addEventListener("paste", function () {
        pasteCount++;
    });

    Qualtrics.SurveyEngine.addOnPageSubmit(function () {
        const timeToFirstKey =
            focusTime !== null && firstKeyTime !== null ? firstKeyTime - focusTime : "";
        const typingTime =
            firstKeyTime !== null && lastKeyTime !== null ? lastKeyTime - firstKeyTime : "";
        const charCount = input.value ? input.value.length : 0;

        Qualtrics.SurveyEngine.setJSEmbeddedData(qid + "_timeToFirstKey", String(timeToFirstKey));
        Qualtrics.SurveyEngine.setJSEmbeddedData(qid + "_typingTime", String(typingTime));
        Qualtrics.SurveyEngine.setJSEmbeddedData(qid + "_keyCount", String(keyCount));
        Qualtrics.SurveyEngine.setJSEmbeddedData(qid + "_backspaces", String(backspaces));
        Qualtrics.SurveyEngine.setJSEmbeddedData(qid + "_pasteCount", String(pasteCount));
        Qualtrics.SurveyEngine.setJSEmbeddedData(qid + "_charCount", String(charCount));

        console.log("SAVED for", qid, {
            timeToFirstKey,
            typingTime,
            keyCount,
            backspaces,
            pasteCount,
            charCount
        });
    });
});
