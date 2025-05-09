document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      if (targetTab === 'previewTab') {
        updatePreviewTypeSelect();
        renderPreviewForm();
      } else if (targetTab === 'relsTab') {
        populateRelsFilter();
        renderRels();
      } else if (targetTab === 'typesTab') {
        renderTypes();
      } else if (targetTab === 'schemaTab') {
        renderSchema();
      }
    });
  });
});