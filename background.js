chrome.runtime.onInstalled.addListener(() => {
    // Initialize the badge text
    chrome.action.setBadgeText({ text: "0" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
  });
  
  // Update badge text when tasks change
  function updateBadge() {
    chrome.storage.local.get("tasks", (data) => {
      const tasks = data.tasks || [];
      const remainingTasks = tasks.filter(task => !task.completed).length;
      chrome.action.setBadgeText({ text: remainingTasks.toString() });
    });
  }
  
  // Listen for changes in storage to update the badge
  chrome.storage.onChanged.addListener(updateBadge);
  
  // Initial badge update
  updateBadge();
  