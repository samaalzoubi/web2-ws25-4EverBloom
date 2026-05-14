import { fetchTopProductsREST } from "@/services/api/dashboardRestService.js";

export async function fetchTopProducts({
    shopId,
    sortBy = null,
    startDate = null,
    endDate = null
}) {
  return await fetchTopProductsREST({
    shopId,
    sortBy,
    startDate,
    endDate
  });
}