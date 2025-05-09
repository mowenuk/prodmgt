// js/tabs.js
/**
 * Renders tabs and handles switching between them.
 */
export function initTabs(tabs) {
  const tabsContainer = document.getElementById('tabsContainer');
  const contents = document.getElementById('tabContents');

  tabs.forEach(key => {
    // Tab button
    const tabBtn = document.createElement('div');
    tabBtn.className = 'tab';
    tabBtn.dataset.tab = key + 'Tab';
    tabBtn.textContent  = key.charAt(0).toUpperCase() + key.slice(1);
    tabsContainer.appendChild(tabBtn);

    // Content container
    const tabContent = document.createElement('div');
    tabContent.id = key + 'Tab';
    tabContent.className = 'tab-content';
    contents.appendChild(tabContent);

    // Click handler
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
      tabBtn.classList.add('active');
      tabContent.classList.add('active');
      // Notify modules
      document.dispatchEvent(new CustomEvent(`show:${key}`));
    });
  });

  // Activate first tab
  tabsContainer.firstChild.click();
}