import router from './router';
import UserHandler from '../handlers/users';

router.post('/register', UserHandler.register);

router.post('/login', UserHandler.login);
