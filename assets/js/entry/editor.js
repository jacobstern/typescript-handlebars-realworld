import '@babel/polyfill';
import 'whatwg-fetch';

import { onReady } from '../page-lifecycle';

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
    icon.addEventListener('click', () => {
      const parent = tagElement.parentNode;
      if (parent) {
        parent.removeChild(tagElement);
      }
    });
  }
}

onReady(() => {
  const tagInput = document.getElementById('tag-input');
  const tagList = document.getElementById('tag-list');

  for (let i = 0; i < tagList.childNodes.length; i++) {
    const node = tagList.childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      registerRemoveTagHandler(node);
    }
  }

  tagInput.addEventListener('keypress', event => {
    if (event.keyCode === 13 && event.target.value) {
      event.preventDefault();
      const tagName = event.target.value.trim();
      if (tagName) {
        const tagElement = createTag(tagName);
        tagList.appendChild(tagElement);
        registerRemoveTagHandler(tagElement);
        event.target.value = '';
      }
    }
  });
});
