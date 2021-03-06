import { onReady } from '../page-lifecycle';
import { fetchWithCsrf } from '../fetch';

function updateButton(button, article) {
  const text = button.querySelector('[data-favorite-button-text]');
  if (article.favorited) {
    button.dataset.favoriteButtonFavorited = '';
    button.classList.remove('btn-outline-primary');
    button.classList.add('btn-primary');
    if (text) {
      text.innerText = 'Unfavorite Article';
    }
  } else {
    delete button.dataset.favoriteButtonFavorited;
    button.classList.remove('btn-primary');
    button.classList.add('btn-outline-primary');
    if (text) {
      text.innerText = 'Favorite Article';
    }
  }
  const counter = button.querySelector('[data-favorite-button-count]');
  if (counter) {
    counter.innerText = article.favoritesCount;
  }
}

function handleFavoriteButtonClick(event) {
  const button = event.currentTarget;
  event.preventDefault();
  button.blur();
  const slug = button.dataset.favoriteButton;
  const endpoint = `/api/articles/${slug}/favorite`;
  const favorited = button.dataset.favoriteButtonFavorited != null;
  const method = favorited ? 'DELETE' : 'POST';
  return fetchWithCsrf(endpoint, { method })
    .then(res => res.json())
    .then(body => {
      document.querySelectorAll(`[data-favorite-button="${slug}"]`).forEach(button => {
        updateButton(button, body.article);
      });
    });
}

onReady(() => {
  const favoriteButtons = document.querySelectorAll('[data-favorite-button]');
  for (const button of favoriteButtons) {
    button.addEventListener('click', handleFavoriteButtonClick);
  }
});
