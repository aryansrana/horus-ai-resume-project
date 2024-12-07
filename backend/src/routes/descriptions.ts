import router from './router';
import DescriptionHandler from '../handlers/descriptions';

router.post('/job-description', DescriptionHandler.job_description);

router.get('/job-descriptions', DescriptionHandler.get_descriptions);

router.put('/job-description', DescriptionHandler.update_name);

router.delete('/job-description', DescriptionHandler.delete_name);
export default router;