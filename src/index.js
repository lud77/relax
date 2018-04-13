const { set: setProp, delete: deleteProp } = require('dot-prop-immutable');
const murmur = require('murmur-hash-js');

const hash = (key) => murmur(JSON.stringify(key), 0);

module.exports = () => {
    let state = {};

    const views = [];

    const initState = (newState) => {
        state = Object.assign({}, newState);
    };

    const updateView = (view) => {
        const newView = view.transform(state);
        const newHash = hash(newView);
        if (view.hash !== newHash) {
            view.hash = newHash;
            view.listener(newView);
        }
    };

    const updateViews = () => views.map(updateView);

    const createView = (transform, listener) => {
        views.push({
            transform,
            listener,
            hash: -1
        });
    };

    const set = (path, value) => {
        state = setProp(state, path, value);
        updateViews();
    };

    const del = (path) => {
        state = deleteProp(state, path);
        updateViews();
    };

    return {
        initState,
        set,
        del,
        createView
    };
};
