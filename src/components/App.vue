<template>
  <div id="app-root">
    <header class="site-header app group">
      <div class="row expanded">
        <div class="columns">
          <!-- <a href="//beta.phila.gov" class="logo">
            <img src="https://standards.phila.gov/img/logo/city-of-philadelphia-yellow-white.png" alt="City of Philadelphia">
          </a> -->
          <div class="app-divide"></div>
          <div class="page-title-container">
            <a href="#/">
              <h1 class="page-title">PVD Example App</h1>
            </a>
          </div>
        </div>
      </div>
    </header>

    <div id="components-root">

      <font-awesome-icon icon="info-circle" class="fa-2x" />

      <div :class="'pvc-search-control-container ' + this.containerClass"
           :style="this.containerStyle"
      >
        <form @submit.prevent="handleSearchFormSubmit"
              autocomplete="off"
              id="search-form"
              class="pvc-search-control-form"
        >
          <input :class="'pvc-search-control-input ' + this.inputClass"
                 id="pvc-search-control-input"
                 :style="this.inputStyle"
                 :placeholder="this.$props.placeholder || 'Search for an address'"
                 :value="this.addressEntered"
                 tabindex="0"
          />
        </form>
        <button :class="'pvc-search-control-button ' + this.buttonClass"
                tabindex="-1"
                @click="this.handleSearchFormSubmit"
        >
          <i class="fa fa-search fa-lg"></i>
        </button>
        <slot name="address-candidates-slot" />
      </div>

      <div class="data-div"
           v-if="this.geocodeStatus === 'success'"
      >
        <div class="data-label-div"><b>Geocode Data</b></div>
        <div class="data-returned-div">
          Address: {{ this.geocodeProperties.street_address }}
        </div>
        <div class="data-label-div"><b>OPA Data</b></div>
        <div class="data-returned-div">
          <div>OPA number: {{ this.$store.state.sources.opa.data.parcel_number }}</div>
          <div>Owner: {{ this.$store.state.sources.opa.data.owner_1 }}</div>
        </div>
        <div class="data-label-div"><b>DOR Data</b></div>
        <div class="data-returned-div">
          <div>DOR number: {{ this.geocodeProperties.dor_parcel_id }}</div>
        </div>
        <div class="data-label-div"><b>DOR Documents</b></div>
        <div v-for="doc in this.dorDocuments"
             class="dor-doc"
        >
          <div>Grantees: {{ doc.attributes.GRANTEES }}</div>
          <div>DocType: {{ doc.attributes.DOCUMENT_TYPE }}</div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>


  export default {

    props: [
      'widthFromConfig',
      'placeholder',
    ],
    data() {
      const data = {
        containerStyle: {
          'width': '305px',
        },
        inputStyle: {
          'width': '250px',
        }
      }
      return data;
    },
    computed: {
      geocodeStatus() {
        return this.$store.state.geocode.status;
      },
      geocodeProperties() {
        return this.$store.state.geocode.data.properties;
      },
      dorDocuments() {
        const keys = Object.keys(this.$store.state.sources.dorDocuments.targets || {});
        const key = keys[0]
        if (this.$store.state.sources.dorDocuments.targets[key]) {
          return this.$store.state.sources.dorDocuments.targets[key].data;
        }
      },
      addressEntered() {
        return this.$store.state.addressEntered;
      },
      inputWidth() {
          if (this.addressEntered === '' || this.addressEntered === null) {
            return this.$props.widthFromConfig - 55;
          } else {
            return this.$props.widthFromConfig - 108;
          }
      },
      inputClass() {
        if (this.isMobileOrTablet) {
          return 'pvc-input-mobile';
        } else {
          return 'pvc-input-non-mobile';
        }
      },
      containerClass() {
        if (this.isMobileOrTablet) {
          return 'pvc-container-mobile';
        } else {
          return 'pvc-container-non-mobile';
        }
      },
      buttonClass() {
        if (this.isMobileOrTablet) {
          return 'pvc-button-mobile'
        } else {
          return 'pvc-button-non-mobile'
        }
      },
      addressAutocompleteEnabled() {
        return false;
      },
      isMobileOrTablet() {
        return false;
        // return this.$store.state.isMobileOrTablet;
      },
    },
    methods: {
      getCandidates(address) {
        axios.get('https://cqvfg1pm72.execute-api.us-east-1.amazonaws.com/dev/first-api-test/', {
          params: {
            address,
          },
        })
          .then(this.didGetCandidates)
          .catch(this.didGetCandidatesError);
      },
      didGetCandidates(res) {
        const { matches } = res.data;
        const matchesArray = matches.map(x => x.address);
        this.$store.commit('setCandidates', matchesArray);
      },
      didGetCandidatesError(err) {
        console.log('error getting candidates', err);
        this.$store.commit('setCandidates', []);
      },
      handleFormX() {
        this.$store.commit('setAddressEntered', '');
        this.$store.commit('setShouldShowAddressCandidateList', false);
        this.$store.commit('setCandidates', []);
      },
      handleSearchFormSubmit() {
        let value;
        if (this.addressAutocompleteEnabled){
          value = this.$store.state.addressEntered;
        } else {
          value = document.querySelector('#pvc-search-control-input').value;
        }
        console.log('handleSearchFormSubmit is running, value:', value);
        this.$controller.handleSearchFormSubmit(value);
        this.$store.commit('setAddressEntered', value);
      },
    }
  };

</script>

<style scoped>

#app-root {
  height: 500px;
}

.pvc-search-control-form {
  display: inline-block;
}

/* Container */

.pvc-search-control-container {
  position: absolute;
  margin: 20px;
  display: inline-block;
  border-radius: 2px;
  box-shadow:0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02);
  width: 305px;
}

.pvc-container-non-mobile {
  height: 48px;
}

.pvc-container-mobile {
  height: 38px;
}


/* Input */

.pvc-search-control-input {
  display: inline-block;
  border: 0;
  padding: 15px;
  font-family: 'Montserrat', 'Tahoma', sans-serif;
  font-size: 16px;
  width: 250px;
}

.pvc-input-non-mobile {
  height: 48px;
}

.pvc-input-mobile {
  height: 38px;
}


/* Button */

.pvc-search-control-button {
  display: inline-block;
  color: #fff;
  background: #2176d2;
  padding: 0px;
  width: 50px;
}

.pvc-button-non-mobile {
  height: 48px;
  line-height: 48px;
}

.pvc-button-mobile {
  height: 38px;
  line-height: 38px;
  padding-top: 1px;
}

.data-div {
  margin: 20px;
  position: absolute;
  left: 350px;
  display: inline-block
}

.dor-doc {
  margin-bottom: 10px;
}


</style>
