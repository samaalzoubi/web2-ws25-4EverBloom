import { API_MODE } from '@/config/api.config'
import { addToCartREST, getActiveCartREST, patchCartItemQuantityREST, clearCartREST } from '@/services/api/cartRestService.js'
import { addToCartGraphQL, getActiveCartGraphQL, patchCartItemQuantityGraphQL, clearCartGraphQL } from '@/services/api/cartGraphqlService.js'

const USE_REST = API_MODE === 'REST'

export async function getActiveCart(userId) {
  return USE_REST ? getActiveCartREST(userId) : getActiveCartGraphQL(userId)
}

export async function addToCart(userId, bouquetId) {
  return USE_REST
    ? addToCartREST(userId, bouquetId)
    : addToCartGraphQL(userId, bouquetId)
}

export async function patchCartItemQuantity(userId, itemId, delta) {
  return USE_REST
    ? patchCartItemQuantityREST(userId, itemId, delta)
    : patchCartItemQuantityGraphQL(userId, itemId, delta)
}

export async function clearCart(userId) {
  return USE_REST ? clearCartREST(userId) : clearCartGraphQL(userId)
}
