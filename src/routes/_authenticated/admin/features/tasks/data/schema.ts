import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  created: z.string(),
  id: z.string(),
  status: z.string(),
  title: z.string(),
})

export const Schema = z.object({
  invoice_id: z.string(),
  subscription_id: z.string(),
  issue_date: z.string(),
  due_date: z.string(),
  paid_at: z.string(),
  amount: z.string(),
  invoice_status: z.string(),
  amount_due: z.number(),
  amount_paid: z.number(),
  amount_remaining: z.number(),
  customer_id: z.string(),
  paid_status: z.boolean(),
  plan_details: z.object({
    name: z.string(),
    price: z.string(),
    courseLimit: z.number(),
    color: z.string(),
  }),
  price_id: z.string(),
})

export type Schema = z.infer<typeof Schema>
export type Task = z.infer<typeof taskSchema>
