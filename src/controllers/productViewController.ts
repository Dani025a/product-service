import { logProductView } from '../services/productViewService';
import { getRelatedProducts } from '../services/relatedProductsService';

export const viewProduct = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const userId = req.user?.id || null;
  const sessionId = req.sessionID;
  const ip = req.ip;

  await logProductView(productId, userId, sessionId, ip);

  const relatedProducts = await getRelatedProducts(productId);

  res.json({
    success: true,
    relatedProducts,
  });
};
