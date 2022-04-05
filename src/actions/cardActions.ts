import axios from './api';

// get all cards from the api
export const getCards = (): any => {
    return axios
        .get(`/cards`)
        .then(res => {
            return res;
        }
        )
        .catch(err => {
            console.log('err', err);
        }
        );
};