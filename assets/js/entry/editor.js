/**
 * Analogue of `jQuery.ready()` for IE9 and beyond.
 */
function onReady(callback) {
  document.readyState === 'interactive' || document.readyState === 'complete'
    ? callback()
    : document.addEventListener('DOMContentLoaded', callback);
}

function createTag(tagName) {
  const tag = document.createElement('span');
  tag.className = 'tag-default tag-pill';
  const icon = document.createElement('i');
  icon.className = 'ion-close-round';
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'tagList[]';
  input.value = tagName;
  tag.appendChild(input);
  tag.appendChild(icon);
  tag.appendChild(document.createTextNode(tagName));
  return tag;
}

function registerRemoveTagHandler(tagElement) {
  const icon = tagElement.querySelector('i');
  if (icon) {
    icon.addEventListener('click', function() {
      const parent = tagElement.parentNode;
      if (parent) {
        parent.removeChild(tagElement);
      }
    });
  }
}

onReady(function() {
  const tagInput = document.getElementById('tag-input');
  const tagList = document.getElementById('tag-list');

  for (let i = 0; i < tagList.childNodes.length; i++) {
    const node = tagList.childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      registerRemoveTagHandler(node);
    }
  }

  tagInput.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
      if (event.target.value) {
        event.preventDefault();
        const tagName = event.target.value.trim();
        if (tagName) {
          const tagElement = createTag(tagName);
          tagList.appendChild(tagElement);
          registerRemoveTagHandler(tagElement);
          event.target.value = '';
        }
      }
    }
  });
});
