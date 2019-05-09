import express from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';
import { StatusError } from '../../errors';

const router = express.Router();

router.post('/:username/follow', ensureLoggedIn(), async (req, res) => {
  const repo = req.entityManager.getCustomRepository(UserRepository);
  const user = req.user as User;
  const userToFollow = await repo.findByUsername(req.params.username);

  if (userToFollow === undefined) {
    throw new StatusError('User not found', 404);
  }

  if (userToFollow.id === user.id) {
    throw new StatusError('Reflexive follow is forbidden', 403);
  }

  const following = await user.following;
  if (!following.some(user => user.id === userToFollow.id)) {
    following.push(userToFollow);
    await repo.validateAndSave(user);
  }

  res.json({
    profile: {
      ...userToFollow,
      following: true,
    },
  });
});

router.delete('/:username/follow', ensureLoggedIn(), async (req, res) => {
  const repo = req.entityManager.getCustomRepository(UserRepository);
  const user = req.user as User;
  const userToUnfollow = await repo.findByUsername(req.params.username);

  if (userToUnfollow === undefined) {
    throw new StatusError('User Not Found', 404);
  }

  const following = await user.following;
  const index = following.findIndex(user => user.id === userToUnfollow.id);
  if (index > -1) {
    following.splice(index, 1);
    await repo.validateAndSave(user);
  }

  res.json({
    profile: {
      ...userToUnfollow,
      following: false,
    },
  });
});

export default router;
