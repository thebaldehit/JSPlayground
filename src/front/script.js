document.addEventListener("DOMContentLoaded", () => {
    const realConsole = console.log

    const consoleArea = document.getElementById("consoleArea")

    console.log = (msg) => {
        realConsole(msg)
        consoleArea.textContent += "Console: " + msg + "\n"
    }

    const autoCloseBracketsSetting = localStorage.getItem('autoCloseBrackets');
    const isAutoCloseBracketsEnabled = autoCloseBracketsSetting !== 'false';

    const lineNumbersSetting = localStorage.getItem('lineNumbers');
    const isLineNumbersEnabled = lineNumbersSetting !== 'false';

    const codeMirror = CodeMirror.fromTextArea(document.getElementById("codeArea"), {
        mode: "javascript",
        lineNumbers: isLineNumbersEnabled,
        autoIndent: true,
        autoCloseBrackets: isAutoCloseBracketsEnabled,
        matchBrackets: true,
        theme: "default"
    })

    const savedCode = localStorage.getItem('code')
    if(savedCode !== null){
        codeMirror.setValue(savedCode)
    }

    const themeSelect = document.getElementById("themeSelect");

    const applyTheme = (theme) => {
        codeMirror.setOption("theme", theme);
        themeSelect.value = theme;
        localStorage.setItem('theme', theme);
    };

    themeSelect.addEventListener("change", () => {
        applyTheme(themeSelect.value);
    });

    const savedTheme = localStorage.getItem('theme') || 'default';
    applyTheme(savedTheme);

    const autoCloseBrackets = document.getElementById("autoCloseBrackets");
    autoCloseBrackets.checked = isAutoCloseBracketsEnabled;


    autoCloseBrackets.addEventListener("change", () => {
        codeMirror.setOption("autoCloseBrackets", autoCloseBrackets.checked);
        localStorage.setItem('autoCloseBrackets', autoCloseBrackets.checked.toString());
    })

    const showLineNumbers = document.getElementById("showLineNumbers")
    showLineNumbers.checked = isLineNumbersEnabled

    showLineNumbers.addEventListener("change", () => {
        codeMirror.setOption("lineNumbers", showLineNumbers.checked)
        localStorage.setItem('lineNumbers', showLineNumbers.checked.toString())
    })

    const autoCompleteSetting = localStorage.getItem('autoComplete');
    const isAutoCompleteEnabled = autoCompleteSetting !== 'false';
    const autoComplete = document.getElementById("autoComplete");

    autoComplete.checked = isAutoCompleteEnabled;

    const toggleAutoComplete = () => {
        codeMirror[autoComplete.checked ? 'on' : 'off']("inputRead", autoCompleteHandler);
        localStorage.setItem('autoComplete', autoComplete.checked.toString());
    };

    const autoCompleteHandler = (instance) => CodeMirror.commands.autocomplete(instance, null, { completeSingle: false });
    autoComplete.addEventListener("change", toggleAutoComplete);
    toggleAutoComplete();

    const runBtn = document.getElementById("runButton")
    const clearCodeBtn = document.getElementById("clearCodeButton")
    const clearConsoleBtn = document.getElementById("clearConsoleButton")

    runBtn.addEventListener("click", () => {
        const code = codeMirror.getValue()
        try {
            const result = new Function(code)
            result()
        } catch (error) {
            consoleArea.textContent += "Console:\nError: " + error + "\n"
        }
    })

    clearCodeBtn.addEventListener("click", () => {
        codeMirror.setValue("")
    })

    clearConsoleBtn.addEventListener("click", () => {
        consoleArea.textContent= ""
    })

    const orientationSelect = document.getElementById('orientationSelect');
    const layoutContainer = document.querySelector('.layout-container');
    const buttonContainer = document.querySelector('.button-container')

    const applyOrientation = (orientation) => {
        ['vertical', 'horizontal', 'oneandhalf'].forEach((availableOrientation) => {
            const isCurrentOrientation = orientation === availableOrientation;

            layoutContainer.classList.toggle(availableOrientation, isCurrentOrientation);
            buttonContainer.classList.toggle(availableOrientation, isCurrentOrientation);
        });

        orientationSelect.value = orientation;
        localStorage.setItem('orientation', orientation);
    }

    orientationSelect.addEventListener('change', (e) => {
        applyOrientation(e.target.value);
    });

    const savedOrientation = localStorage.getItem('orientation') || 'vertical';
    applyOrientation(savedOrientation);

    codeMirror.on('change', () => {
        const code = codeMirror.getValue()
        localStorage.setItem('code', code)
    })

})
