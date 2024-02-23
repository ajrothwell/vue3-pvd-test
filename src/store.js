// import Vue from 'vue';
// import Vuex from 'vuex';
import mergeDeep from './util/merge-deep';
// import philaVueDatafetch from '@phila/vue-datafetch'
// const pvdStore = philaVueDatafetch.pvdStore
import pvdStore from './pvd/store';

// when you load vuex from a script tag this seems to happen automatically
// Vue.use(Vuex);

function myCreateStore(config) {
  console.log('myCreateStore is running, config:', config);
  const sources = pvdStore.createSources(config);
  const parcels = pvdStore.createParcels(config);

  const initialState = {
    candidates: [],
    addressEntered: null,
    parcels,
    sources,
  };

  const mb = {
    state: initialState,
    mutations: {
      setCandidates(state, payload) {
        state.candidates = payload;
      },
      setAddressEntered(state, payload) {
        state.addressEntered = payload;
      },
    }
  }

  let mergeStore = mergeDeep(pvdStore.store, mb);
  console.log('mergeStore:', mergeStore);

  // TODO standardize how payloads are passed around/handled
  // return new Vuex.Store({
  //   state: mergeStore.state,
  //   getters: mergeStore.getters,
  //   mutations: mergeStore.mutations
  // });
  return mergeStore;
}

export default myCreateStore;
