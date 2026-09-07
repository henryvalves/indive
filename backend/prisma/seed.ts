import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: { email: 'customer@example.com', name: 'Customer', password: '$2b$10$changeme', role: 'CUSTOMER' },
  })

  const owner = await prisma.user.create({
    data: { email: 'owner@example.com', name: 'Owner', password: '$2b$10$changeme', role: 'RESTAURANT' },
  })

  const restaurant = await prisma.restaurant.create({
    data: {
      ownerId: owner.id,
      name: 'Cafe Central',
      address: 'Main Street 1',
      menuItems: { create: [
        { name: 'Sandwich', description: 'Tasty', price: 500 },
        { name: 'Coffee', description: 'Hot', price: 200 }
      ] }
    },
    include: { menuItems: true }
  })

  console.log({ user: user.email, owner: owner.email, restaurant: restaurant.name })
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
