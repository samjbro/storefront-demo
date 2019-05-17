import gql from 'graphql-tag'

const SHOW_OVERLAY = gql`
  mutation showOverlay($view: String!) {
    showOverlay(view: $view) @client
  }
`

const CLOSE_OVERLAY = gql`
  mutation closeOverlay {
    closeOverlay @client
  }
`

const LOG_IN = gql`
  mutation login($data: LoginCustomerInput!) {
    login(data: $data) {
      token
      customer {
        customer_id
        name
        email
      }
    }
  }
`

const REGISTER = gql`
  mutation register($data: RegisterCustomerInput!) {
    register(data: $data) {
      token
      customer {
        customer_id
        name
        email
      }
    }
  }
`

const SET_CURRENT_CUSTOMER = gql`
  mutation setCurrentCustomer($customer: Customer!) {
    setCurrentCustomer(customer: $customer) @client
  }
`

export { SHOW_OVERLAY, CLOSE_OVERLAY, LOG_IN, REGISTER, SET_CURRENT_CUSTOMER }