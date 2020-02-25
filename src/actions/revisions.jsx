import {START_REVISION_START,  START_REVISION_FINISH} from '../actionconstant';
import { stepsById } from '../util/APIUtils';

const getRevisions = (stepId) =>{
    stepsById(stepId).then(res =>{
        setSelectedStep(res)
        console.log(res)
    })
}

export {getRevisions}