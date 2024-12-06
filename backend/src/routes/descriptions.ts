import router from './router';
import DescriptionHandler from '../handlers/descriptions';


router.post('/job-description', DescriptionHandler.job_description);

export default router;