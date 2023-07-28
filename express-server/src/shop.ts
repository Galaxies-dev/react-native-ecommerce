import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
const router = express.Router();
import { drizzle } from 'drizzle-orm/node-postgres';
import { OrderItem, order_items, orders, products } from './db/schema';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}`, ssl: { rejectUnauthorized: false } });
const db = drizzle(pool);

// Error handler for database queries
const handleQueryError = (err: any, res: Response) => {
  console.error('Error executing query:', err);
  res.status(500).json({ error: 'An error occurred while executing the query.' });
};

// Get all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(products);
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Get a single product by ID
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows = await db.select().from(products).where(eq(products.id, +id));
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Create a new order with multiple products and a user email
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { email, products: orderBody } = req.body;

    const order = await db.transaction(async (trx) => {
      const [newOrder] = await trx.insert(orders).values({ customer_email: email }).returning();
      const productPrices = await Promise.all(
        orderBody.map(async (orderItem: any) => {
          const [res] = await db.select().from(products).where(eq(products.id, +orderItem.product_id));
          return res.product_price;
        })
      );

      const orderProducts = await Promise.all(
        orderBody.map(async (orderItem: any, index: number) => {
          const total = (+productPrices[index] * +orderItem.quantity).toFixed(2);
          const [orderProduct] = await trx.insert(order_items).values({ order_id: newOrder.id, product_id: orderItem.product_id, quantity: orderItem.quantity, total: +total }).returning();
          return orderProduct;
        })
      );

      // Update the total price of the order
      const total = orderProducts.reduce((acc: number, curr: OrderItem) => {
        return acc + curr.total;
      }, 0);

      const [updatedOrder] = await trx
        .update(orders)
        .set({ total: total.toFixed(2) })
        .where(eq(orders.id, newOrder.id))
        .returning();
      return { ...updatedOrder, products: orderProducts };
    });
    res.json(order);
  } catch (err) {
    handleQueryError(err, res);
  }
});

export default router;
