import { onReady } from '../page-lifecycle';
import { fetchWithCsrf } from '../fetch';

function updateButton(button, profile) {
  const icon = button.querySelector('i');
  const text = button.querySelector('[data-follow-button-text]');
  if (profile.following) {
    btton.dataset.following = '';
    icon.className = 'ion-close';
    text.innerText = 'Unfollow ' + button.dataset.profile;
  } else {
    delete button.dataset.following;
    icon.className = 'ion-plus-round';
    text.innerText = 'Follow ' + button.dataset.profile;
  }
}

function handleFollowButtonClick(event) {
  const button = event.currentTarget;
  event.preventDefault();
  button.blur();
  const username = button.dataset.profile;
  const endpoint = `/api/profiles/${username}/follow`;
  const following = button.dataset.following != null;
  const method = following ? 'DELETE' : 'POST';
  return fetchWithCsrf(endpoint, { method })
    .then(res => res.json())
    .then(body => {
      const selector = `[data-follow-button][data-profile="${username}"]`;
      document.querySelectorAll(selector).forEach(button => {
        updateButton(button, body.profile);
      });
    });
}

onReady(() => {
  const followButtons = document.querySelectorAll('[data-follow-button]');
  for (const button of followButtons) {
    button.addEventListener('click', handleFollowButtonClick);
  }
});
