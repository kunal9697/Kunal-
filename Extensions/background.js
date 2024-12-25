chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "sendElementData") {
      const apiEndpoint = 'http://localhost:8089/mfd/getXpath';

      fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message.data)
      })
      .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
      })
      .then(data => console.log('Field data sent to backend:', data))
      .catch(error => console.error('Error sending field data to backend:', error));
  }
});
