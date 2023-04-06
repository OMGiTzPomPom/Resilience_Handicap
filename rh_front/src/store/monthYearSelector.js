import {createStore} from "vuex";
import dayjs from "dayjs";
import localedata from 'dayjs/plugin/localeData';
import "dayjs/locale/fr";

dayjs.extend(localedata);
dayjs.locale('fr');

const month = dayjs.months();

export default createStore({
    state: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    },
    getters: {
        getSelectedMonth(state) {
            return state.month;
        },
        getWrittenMonth(state) {
            return month[state.month];
        },
        getSelectedYear(state) {
            return state.year;
        },
    },
    mutations: {
        changeMonth(state, newMonth) {
            state.month = newMonth;
        },
        changeYear(state, newYear) {
            state.year = newYear;
        },
    }
})