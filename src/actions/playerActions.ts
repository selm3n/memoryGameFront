import axios from './api';
import { IBestScore } from '../App';

//get bestScore from the api
export const getBestScore = (): any => {
    return axios
        .get(`/players/player`)
        .then(res => {
            return res;
        }
        )
        .catch(err => {
            console.log('err', err);
        }
        );
};

//set current game score
export const setScore = (score: IBestScore): any => {
    return axios
        .post(`/players`, score)
        .then(res => {
            return res;
        }
        )
        .catch(err => {
            console.log('err', err);
        }
        );
};