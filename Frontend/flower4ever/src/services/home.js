import { API_MODE } from '@/config/api.config'
import { fetchFlowersREST } from '@/services/api/bouquetRestService.js'
import { fetchFlowersGraphQL } from '@/services/api/bouquetGraphqlService.js'
import { fetchShopsREST } from '@/services/api/userRestService.js'
import { fetchShopsGraphQL } from '@/services/api/userGraphqlService.js'

const DEFAULT_SHOP_LOGO = 'https://images.scalebranding.com/flower-shop-logo-2a1cfde0-daf2-417f-a0a6-de1d596a23d7.jpg'

export async function fetchHomeBouquets() {
  const shopsData =
    API_MODE === 'REST'
      ? await fetchFlowersREST()
      : await fetchFlowersGraphQL()

  // shopsData: [{ shopId, shopLogo?, bouquets: [...] }, ...]
  const bouquets = shopsData.flatMap(shop =>
    (shop.bouquets || []).map(b => ({
      ...b,
      shopLogo: shop.shopLogo || DEFAULT_SHOP_LOGO,
      shopId: shop.shopId
    }))
  )

  return bouquets
}

export async function fetchHomeShops() {
  const shops =
    API_MODE === 'REST'
      ? await fetchShopsREST()
      : await fetchShopsGraphQL()

  return shops
}
