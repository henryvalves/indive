@@
   @Post('checkout')
   async checkout(@Body() body: any) {
@@
     const order = await this.prisma.order.create({
@@
     })
-    // emit event to restaurant and dispatch logic
-    this.socket.serverEmit('order:created', order)
+    // emit event to restaurant and dispatch logic
+    this.socket.serverEmit('order:created', order)
+
+    // dispatch: find nearest available drivers and send them a request
+    if (order.restaurant && order.restaurant.lat != null && order.restaurant.lng != null) {
+      try {
+        const restaurantLat = order.restaurant.lat
+        const restaurantLng = order.restaurant.lng
+        // find available drivers
+        const candidates = await this.prisma.driver.findMany({ where: { status: 'AVAILABLE', currentLat: { not: null }, currentLng: { not: null } } })
+        // simple haversine in JS
+        const haversine = (a: any, b: any) => {
+          const R = 6371
+          const dLat = (b.lat - a.lat) * Math.PI / 180
+          const dLon = (b.lng - a.lng) * Math.PI / 180
+          const lat1 = a.lat * Math.PI / 180
+          const lat2 = b.lat * Math.PI / 180
+          const sinDLat = Math.sin(dLat/2)
+          const sinDLon = Math.sin(dLon/2)
+          const aa = sinDLat*sinDLat + sinDLon*sinDLon * Math.cos(lat1) * Math.cos(lat2)
+          const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa))
+          return R * c
+        }
+        const withDist = candidates.map(d => ({ driver: d, dist: haversine({ lat: restaurantLat, lng: restaurantLng }, { lat: d.currentLat!, lng: d.currentLng! }) }))
+        withDist.sort((a,b) => a.dist - b.dist)
+        const top = withDist.slice(0,3)
+        for (const t of top) {
+          // emit a driver request to each driver's room
+          this.socket.server?.to(`driver_${t.driver.id}`).emit('driver:request', { order })
+        }
+      } catch (e) {
+        console.error('dispatch error', e)
+      }
+    }
     return { orderId: order.id }
   }
