import router from './router';
import AnalysisHandler from '../handlers/pairs';

router.post('/analyze', AnalysisHandler.analyze);