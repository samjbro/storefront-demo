import {
  mount
} from '@vue/test-utils'

import ProductCards from '../ProductCards'

describe('ProductCards.vue', () => {
  it('filters products within department by category', () => {
    const searchTerms = {
      department_id: 1,
      category_id: 1
    }
    const productA = {
      id: 1,
      locations: {
        department: {
          department_id: 1
        },
        category: {
          category_id: 1
        }
      }
    }
    const productB = {
      id: 1,
      locations: {
        department: {
          department_id: 1
        },
        category: {
          category_id: 2
        }
      }
    }
    const wrapper = renderComponent({
      searchTerms,
      productList: [productA, productB]
    })

    expect(wrapper.vm.filteredProducts.length).toBe(1)
    expect(wrapper.vm.filteredProducts[0].id).toBe(1)
  })
})

const renderComponent = ({
  searchTerms,
  productList
}) => {
  return mount(ProductCards, {
    data: () => ({
      searchTerms,
      products: {
        product_list: productList
      }

    })
  })
}