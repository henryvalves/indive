@@
-  const user = await prisma.user.create({
-    data: { email: 'customer@example.com', name: 'Customer', password: '$2b$10$changeme', role: 'CUSTOMER' },
-  })
-
-  const owner = await prisma.user.create({
-    data: { email: 'owner@example.com', name: 'Owner', password: '$2b$10$changeme', role: 'RESTAURANT' },
-  })
-
-  const restaurant = await prisma.restaurant.create({
-    data: {
-      ownerId: owner.id,
-      name: 'Cafe Central',
-      address: 'Main Street 1',
-      menuItems: { create: [
-        { name: 'Sandwich', description: 'Tasty', price: 500 },
-        { name: 'Coffee', description: 'Hot', price: 200 }
-      ] }
-    },
-    include: { menuItems: true }
-  })
+  const user = await prisma.user.create({
+    data: { email: 'customer@example.com', name: 'Customer', password: '$2b$10$changeme', role: 'CUSTOMER' },
+  })
+
+  const owner = await prisma.user.create({
+    data: { email: 'owner@example.com', name: 'Owner', password: '$2b$10$changeme', role: 'RESTAURANT' },
+  })
+
+  const restaurant = await prisma.restaurant.create({
+    data: {
+      ownerId: owner.id,
+      name: 'Cafe Central',
+      address: 'Main Street 1',
+      lat: 33.5731,
+      lng: -7.5898,
+      menuItems: { create: [
+        { name: 'Sandwich', description: 'Tasty', price: 500 },
+        { name: 'Coffee', description: 'Hot', price: 200 }
+      ] }
+    },
+    include: { menuItems: true }
+  })
+
+  // sample driver
+  const driverUser = await prisma.user.create({ data: { email: 'driver@example.com', name: 'Driver', password: '$2b$10$changeme', role: 'DRIVER' } })
+  const driver = await prisma.driver.create({ data: { userId: driverUser.id, vehicleType: 'bike', status: 'AVAILABLE', currentLat: 33.5725, currentLng: -7.5850 } })
