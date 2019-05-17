let overlayHidden = true

export default {
  closeOverlay (parent, data, { cache }) {          
    cache.writeData({
      data: {
        overlay: {
          __typename: 'Overlay',
          showing: false,
        }
      }
    })
    return null
  },
  showOverlay (parent, { view }, { cache }) {
    cache.writeData({
      data: {
        overlay: {
          __typename: 'Overlay',
          showing: true,
          view
        }
      }
    })
    return null
  },
  setCurrentCustomer: async (_, { customer }, { cache }) => {
    await cache.writeData({
      data: {
        currentCustomer: customer
      }
    })
    return null
  }
}