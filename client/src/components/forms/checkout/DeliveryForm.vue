<template>
  <div class="delivery-form" :class="{'delivery-form--error': error}">
    <div class="delivery-form__options">
      <div class="delivery-form__address">
        <div class="delivery-form__row">
          <div class="delivery-form__option"
            :class="{'delivery-form__option--missing': error && !deliveryData.firstName}"
          >
            <label for="firstName">First name</label>
            <input type="text" v-model="deliveryData.firstName" id="firstName">
          </div>
          <div class="delivery-form__option"
            :class="{'delivery-form__option--missing': error && !deliveryData.lastName}"
          >
            <label for="lastName">Last name</label>
            <input type="text" v-model="deliveryData.lastName" id="lastName">
          </div>
        </div>
        <div class="delivery-form__row">
          <div class="delivery-form__option"
            :class="{'delivery-form__option--missing': error && !deliveryData.address}"
          >
            <label for="address">Address</label>
            <input type="text" v-model="deliveryData.address" id="address">
          </div>
          <div class="delivery-form__option"
            :class="{'delivery-form__option--missing': error && !deliveryData.city}"
          >
            <label for="city">City</label>
            <input type="text" v-model="deliveryData.city" id="city">
          </div>
        </div>
        <div class="delivery-form__row">
          <div class="delivery-form__option"
            :class="{'delivery-form__option--missing': error && !deliveryData.state}"
          >
            <label for="state">Region / State</label>
            <input type="text" v-model="deliveryData.state" id="state">
          </div>
          <div class="delivery-form__option"
            :class="{'delivery-form__option--missing': error && !deliveryData.zipCode}"
          >
            <label for="zipCode">Post code / Zip code</label>
            <input type="text" v-model="deliveryData.zipCode" id="zipCode">
          </div>
        </div>
        <div class="delivery-form__row delivery-form__row--region">
            <div class="delivery-form__regions">
              <h3>Country:</h3>
              <div
                  v-for="region in shippingRegions" :key="region.shipping_region_id"
                  class="delivery-form__region"
                  :class="{'delivery-form__region--selected': region === shippingRegion}"
                  @click="updateRegion(region)"
                >
                {{ region.shipping_region }}
              </div>
            </div>
            <div class="delivery-form__shipping" v-if="shippingRegions">
              <h3>Select Shipping:</h3>
              <div
                class="delivery-form__shipping-type" 
                v-for="type in shippingRegion.shipping_types" 
                :key="type.shipping_id"
                :class="{'delivery-form__shipping-type--selected': shippingType && type.shipping_id === shippingType.shipping_id}"
                @click="setShippingType(type)"
                >
                {{ type.shipping_type }}
              </div>
            </div>
        </div>
      </div>
    </div>
    <div class="delivery-form__message">
      <template v-if="error">
        {{ error.message }}
      </template>
    </div>
    <CheckoutButtons @submit="submit" @cancel="cancel" :submitting="settingAddress">
      <template v-slot:submitText>
        <span>Next</span>
      </template>
    </CheckoutButtons>
  </div>
</template>

<script>
import { GET_SHIPPING_REGIONS, GET_CURRENT_CUSTOMER, CREATE_ORDER, ADD_CUSTOMER_ADDRESS, SET_SHIPPING_TYPE, GET_SHIPPING_TYPE } from '@/apollo/operations'
import CheckoutButtons from './CheckoutButtons'
export default {
  components: { CheckoutButtons },
  data () {
    return {
      deliveryData: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        shippingCountry: '',
        shippingRegionId: null
      },
      shippingRegion: null,
      error: null,
      settingAddress: 0
    }
  },
  computed: {
    formComplete () {
      return this.deliveryData.firstName && this.deliveryData.lastName && this.deliveryData.address && this.deliveryData.city && this.deliveryData.state && this.deliveryData.zipCode
    }
  },
  methods: {
    setShippingType (shippingType) {
       this.$apollo.mutate({
        mutation: SET_SHIPPING_TYPE,
        variables: {
          shippingType
        }
      })
    },
    async submit () {
      try {
        this.settingAddress++
        if (!this.formComplete) throw new Error('Please fill in all fields')
        await this.$apollo.mutate({
          mutation: ADD_CUSTOMER_ADDRESS,
          variables: {
            data: this.deliveryData
          },
          update: (cache, { data: { addCustomerAddress }}) => {
            console.log({addCustomerAddress})
            cache.writeQuery({ query: GET_CURRENT_CUSTOMER, data: {
              currentCustomer: addCustomerAddress
            }})
          }
        })
        this.settingAddress--
        this.$emit('submit')
      } catch (e) {
        console.log(e)
        this.settingAddress--
        this.error = e
        setTimeout(() => {
          this.error = null
        }, 2000)
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    updateRegion (region) {
      console.log({region})
      this.shippingRegion = region
      this.deliveryData.shippingCountry = region.shipping_region
      this.deliveryData.shippingRegionId = region.shipping_region_id
      this.setShippingType(region.shipping_types[0])
    }
  },
  apollo: {
    shippingRegions () {
      return {
        query: GET_SHIPPING_REGIONS,
        result: ({ data }) => {
          this.updateRegion(data.shippingRegions[0])
        }
      }
    },
    shippingType () {
      return {
        query: GET_SHIPPING_TYPE
      }
    },
    currentCustomer () {
      return {
        query: GET_CURRENT_CUSTOMER,
        result: ({ data: { currentCustomer }}) => {
          const nameGuess = currentCustomer.name.split(' ')
          if (nameGuess.length > 1) {
            this.deliveryData.firstName = nameGuess.slice(0, -1).join(' ')
            this.deliveryData.lastName = nameGuess.slice(-1)
          } else {
            this.deliveryData.firstName = nameGuess[0]
          }
          this.deliveryData.address = currentCustomer.address.address
          this.deliveryData.city = currentCustomer.address.city
          this.deliveryData.state = currentCustomer.address.state
          this.deliveryData.zipCode = currentCustomer.address.zipCode

        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
@import "~#/abstracts/animations";
@import "~#/abstracts/mixins";
.delivery-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 100%;
  &__options {
    background-color: $color-off-white;
    border: 1px solid $color-gray-light;
    border-radius: 2px;
    padding: 1rem 3rem;
    margin-bottom: 1rem;
    overflow-y: scroll;
  }
  &__row {
    display: flex;
    margin-bottom: 1rem;
    align-items: center;

    @include respond(phone) {
      flex-direction: column;
      margin-bottom: .3rem;
    }

    &--region {
      color: $color-gray-med;
      font-weight: 600;
      font-size: 1.2rem;
      min-height: 3rem;
      justify-content: space-between;
    }
  }
  &__option {
    flex: 1;
    width: 100%;

    &:not(:last-child) {
      margin-right: 1rem;
       @include respond(phone) {
         margin-right: 0;
       }
    }

    label {
      display: block;
      color: $color-gray-med;
      font-weight: 600;
      font-size: 1.2rem;
      margin-bottom: .5rem;
    }
        
    input {
      &:not(:last-child) {
        margin-bottom: .8rem;
      }
      width: 100%;
      padding: .5rem 1rem;
      // min-width: 30rem;
      border-radius: .4rem;
      border: 1px solid $color-gray-light-2;
      font-size: 1.4rem;
      @include respond(phone) {
        padding: .2rem 1rem;
      }
      &::placeholder {
        text-align: center;
      }
    }
    &--shipping {
      display: flex;
      align-items: center;
      div {
        &:first-child {
          margin-right: 2rem;
          font-weight: 600;
          color: $color-gray-med;
        }
      }
    }
    &--missing {
      input {
        background-color: rgba($color-red, .2);
      }
    }
  }
  &__regions {
    display: flex;
    margin-left: 2rem;
    align-content: center;
    @include respond(phone) {
      margin-left: 0;
    }
    h3 {
      vertical-align: middle;
      display: flex;
      align-items: center;
      margin-right: 1rem;
    }
  }
  &__region {
    border-radius: 2rem;
    padding: .5rem .8rem;
    border: 1px solid $color-gray-med;
    cursor: pointer;
    text-align: center;
    display: flex;
    align-items: center;

    &--selected {
      color: $color-white;
      background-color: $color-red;
      border-color: $color-white;
    }

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
  &--error {
    animation: shake .5s;
  }
  &__message {
    display: flex;
    font-weight: 600;
    justify-content: center;
    color: $color-red;
    min-height: 2rem;
  }
  &__shipping {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    margin-top: 1rem;
    border: 1px solid $color-gray-light-2;
    background-color: $color-white;
    margin-left: 2rem;
    padding: .7rem 1.5rem;
    min-width: 22rem;
    min-height: 8rem;
    @include respond(phone) {
      align-items: center;
    }

    h3 {
      font-size: 1.5rem;
    }
  }
  &__shipping-type {
    cursor: pointer;
    transition: transform .2s;
    &:hover {
      transform: translateX(-.5rem);
    }
    &--selected {
      color: $color-red;
      font-size: 1.5rem;
    }
  }
}
</style>
