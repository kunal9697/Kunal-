document.getElementById("startAutomation").addEventListener("click", function() {
    // Send a message to content.js or background.js to start the automation
    console.log("Button clicked!");
    chrome.runtime.sendMessage({ action: "startAutomation" });
});
