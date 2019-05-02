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
    icon.addEventListener('click', function() {
      var parent = tag.parentNode;
      if (parent) {
        parent.removeChild(tag);
      }
    });
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'tags[]';
    input.value = tagName;
    tag.appendChild(input);
    tag.appendChild(icon);
    tag.appendChild(document.createTextNode(tagName));
    return tag;
  }

  onReady(function() {
    var tagInput = document.getElementById('tag-input');
    tagInput.addEventListener('keypress', function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        var tagName = event.target.value.trim();
        if (tagName) {
          var tagList = document.getElementById('tag-list');
          var tag = createTag(tagName);
          tagList.appendChild(tag);
          event.target.value = '';
        }
      }
    });
  });
})();
