document.addEventListener('click', function (event) {
  const element = event.target;

  // Function to get visible text or accessible attributes
  function getVisibleText(element) {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      // Try to find the associated <label> element using 'for' attribute
      const label = document.querySelector(`label[for='${element.id}']`);
      if (label) {
        return label.textContent.trim();
      }

      // Look for placeholder, title, or aria-label if no label found
      return (
        element.placeholder.trim() ||
        element.getAttribute('aria-label')?.trim() ||
        element.getAttribute('title')?.trim() ||
        ''
      );
    }

    // For other elements, return their text content
    return element.textContent.trim();
  }

  // Function to generate XPath dynamically
  function getXPath(element) {
    if (element.id) {
      return `//*[@id='${element.id}']`;
    }
    if (element.name) {
      return `//*[@name='${element.name}']`;
    }

    let path = '';
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let index = 1;
      let sibling = element.previousElementSibling;

      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === element.tagName) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }

      const tagName = element.tagName.toLowerCase();
      path = `/${tagName}[${index}]${path}`;
      element = element.parentNode;
    }
    return path ? `/html${path}` : '';
  }

  // Capture the visible text
  const fieldName = getVisibleText(element);

  // Capture the XPath
  const elementXPath = getXPath(element);

  // Log output
  console.log("Captured field name (UI text):", fieldName || 'No visible text');
  console.log("Captured field XPath:", elementXPath);

  // Send data to backend
  sendToBackend(fieldName, elementXPath);
});

// Function to send data to the backend
function sendToBackend(fieldName, elementXPath) {
  const apiEndpoint = 'http://localhost:8089/mfd/getXpath'; // Replace with your API endpoint

  const data = {
    elementName: fieldName,
    elementXPath: elementXPath,
  };

  fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log('Data sent to backend:', data))
    .catch((error) => console.error('Error sending data to backend:', error));
}

// Monitor outer DOM changes using MutationObserver
function monitorDOM() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
            console.log('New input/textarea added:', node);
            const fieldName = getVisibleText(node);
            const elementXPath = getXPath(node);
            console.log('Captured field name (UI text):', fieldName);
            console.log('Captured field XPath:', elementXPath);
            sendToBackend(fieldName, elementXPath);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Start monitoring DOM for dynamic changes
monitorDOM();
