'use strict';

(function() {
  /**
   * Analogue of `jQuery.ready()` for IE9 and beyond.
   */
  function onReady(callback) {
    document.readyState === 'interactive' || document.readyState === 'complete'
      ? callback()
      : document.addEventListener('DOMContentLoaded', callback);
  }

  function createTag(tagName) {
    var tag = document.createElement('span');
    tag.className = 'tag-default tag-pill';
    var icon = document.createElement('i');
    icon.className = 'ion-close-round';
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'tags[]';
    input.value = tagName;
    tag.appendChild(input);
    tag.appendChild(icon);
    tag.appendChild(document.createTextNode(tagName));
    return tag;
  }

  function registerRemoveTagHandler(tagElement) {
    var icon = tagElement.querySelector('i');
    if (icon) {
      icon.addEventListener('click', function() {
        var parent = tagElement.parentNode;
        if (parent) {
          parent.removeChild(tagElement);
        }
      });
    }
  }

  onReady(function() {
    var tagInput = document.getElementById('tag-input');
    var tagList = document.getElementById('tag-list');

    for (var i = 0; i < tagList.childNodes.length; i++) {
      var node = tagList.childNodes[i];
      if (node.nodeType === Node.ELEMENT_NODE) {
        registerRemoveTagHandler(node);
      }
    }

    tagInput.addEventListener('keypress', function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        var tagName = event.target.value.trim();
        if (tagName) {
          var tagElement = createTag(tagName);
          tagList.appendChild(tagElement);
          registerRemoveTagHandler(tagElement);
          event.target.value = '';
        }
      }
    });
  });
})();
