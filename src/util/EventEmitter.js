/**
 * Created by zhengliuyang on 2018/6/13.
 */
import events from 'events';
const emitter = new events.EventEmitter();
emitter.setMaxListeners(0);
export {emitter};

export const INSER = 'INSER';
export const INSERT_LAYOUT = 'INSERT_LAYOUT';
export const INSERT_LET = 'INSERT_LET';

export const SNACKBAR = 'SNACKBAR';
export const THEME_CHANGE = 'THEME_CHANGE';
export const STRUCT_CHANGE = 'STRUCT_CHANGE';
export const COLLECTION_DATA = 'COLLECTION_DATA';
export const THEME_DATA = 'THEME_DATA';
export const NAV_DATA = 'NAV_DATA';
export const PAGELOADING = 'PAGELOADING';
export const SAVE_STEP = 'SAVE_STEP';
export const SET_THEME = 'SET_THEME';
export const QUIT_VIEW = 'QUIT_VIEW';
export const AUTOSAVE = 'AUTOSAVE';
export const DRAGGINGPIC = 'DRAGGINGPIC';
export const BROADCARST = 'BROADCARST';
export const GETNAV = 'GETNAV';
export const SETSITE = 'SETSITE';



