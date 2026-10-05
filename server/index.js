import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Paths to persistent data files
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const REVIEWS_FILE = path.join(__dirname, 'data', 'reviews.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const ENQUIRIES_FILE = path.join(__dirname, 'data', 'enquiries.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');

// Helper to read JSON file
async function readJson(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return null;
  }
}

// Helper to write JSON file
async function writeJson(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// ================= AUTHENTICATION ROUTES =================
// Sign In (Checks for special admin credentials or standard user)
app.post('/api/auth/signin', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please enter both username/email and password' });
  }

  const cleanIdent = identifier.trim().toLowerCase();

  // 1. Check for Special Admin Credentials
  const isAdminUser = cleanIdent === 'admin' || cleanIdent === 'admin@moonvenus.in' || cleanIdent === 'moonvenus';
  const isAdminPass = password === 'admin123' || password === 'moonadmin2026';

  if (isAdminUser && isAdminPass) {
    console.log(`🔐 Administrator logged in: ${cleanIdent}`);
    return res.json({
      success: true,
      user: {
        id: 'usr-admin',
        name: 'Moon Venus Admin',
        email: 'admin@moonvenus.in',
        role: 'admin'
      },
      isAdmin: true,
      message: 'Welcome back, Administrator!'
    });
  }

  // 2. Check Standard Customer Database
  const users = (await readJson(USERS_FILE)) || [];
  const foundUser = users.find(u => u.email.toLowerCase() === cleanIdent && u.password === password);

  if (foundUser) {
    const { password: _, ...safeUser } = foundUser;
    return res.json({
      success: true,
      user: safeUser,
      isAdmin: safeUser.role === 'admin',
      message: `Welcome back, ${foundUser.name}!`
    });
  }

  return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
});

// Sign Up (Customer Account Creation)
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = (await readJson(USERS_FILE)) || [];

  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone ? phone.trim() : '',
    password,
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  await writeJson(USERS_FILE, users);

  const { password: _, ...safeUser } = newUser;
  console.log(`👤 New Customer Registered: ${newUser.name} (${newUser.email})`);

  res.status(201).json({
    success: true,
    user: safeUser,
    isAdmin: false,
    message: 'Account created successfully!'
  });
});

// 1. Get Product Details
app.get('/api/product', async (req, res) => {
  const product = await readJson(PRODUCTS_FILE);
  if (!product) return res.status(500).json({ error: 'Failed to load product data' });
  res.json(product);
});

// 2. Check Delivery Pincode
app.post('/api/check-pincode', (req, res) => {
  const { pincode } = req.body;
  if (!pincode || !/^\d{6}$/.test(pincode.trim())) {
    return res.status(400).json({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code' });
  }

  const pin = pincode.trim();
  const firstDigit = pin[0];
  let days = 3;
  let hub = 'Regional Express Hub';

  if (pin.startsWith('560')) {
    days = 1;
    hub = 'Bengaluru Fast-Track Delivery Hub';
  } else if (pin.startsWith('400') || pin.startsWith('110') || pin.startsWith('600') || pin.startsWith('500') || pin.startsWith('700')) {
    days = 2;
    hub = 'Metro Express Sort Center';
  } else if (['1', '2', '3', '4', '5', '6'].includes(firstDigit)) {
    days = 3;
    hub = 'North/West/South Tier-1 Hub';
  } else {
    days = 4;
    hub = 'National Logistics Terminal';
  }

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + days);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };

  res.json({
    valid: true,
    pincode: pin,
    available: true,
    estimatedDays: days,
    estimatedDate: estDate.toLocaleDateString('en-IN', options),
    hub,
    freeDelivery: true,
    codAvailable: true,
    whiteGloveAvailable: true,
    message: `Delivery available by ${estDate.toLocaleDateString('en-IN', options)} with Free White-Glove Installation`
  });
});

// 3. Create New Order (E-commerce Checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, subtotal, discount, couponCode, totalAmount, assembly, payment } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.pincode) {
      return res.status(400).json({ error: 'Incomplete customer details' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one product' });
    }

    const orders = (await readJson(ORDERS_FILE)) || [];
    
    // Generate Order ID like MV-73821
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderId = `MV-${randomDigits}`;
    const trackingNumber = `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`;

    const now = new Date();
    const estDeliveryDate = new Date();
    estDeliveryDate.setDate(estDeliveryDate.getDate() + 3);

    const newOrder = {
      orderId,
      createdAt: now.toISOString(),
      customer,
      items,
      subtotal: subtotal || totalAmount,
      discount: discount || 0,
      couponCode: couponCode || null,
      shipping: 0,
      totalAmount,
      assembly: assembly || 'Standard Delivery',
      payment: {
        method: payment?.method || 'UPI',
        status: payment?.method === 'COD' ? 'PENDING' : 'PAID',
        transactionId: payment?.transactionId || `TXN_${Date.now()}_${randomDigits}`
      },
      status: 'Confirmed',
      tracking: {
        courier: 'Bluedart Express Cargo',
        trackingNumber,
        estimatedDelivery: estDeliveryDate.toISOString().split('T')[0],
        checkpoints: [
          {
            status: 'Order Placed & Confirmed',
            time: now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            note: 'Order payment verified. Allocated to Moon Venus precision production floor.',
            done: true
          },
          {
            status: 'Precision Quality Inspection',
            time: 'Scheduled (Next 4 Hours)',
            note: 'Aviation-grade weld testing, leveling glide calibration & satin white finish inspection.',
            done: false
          },
          {
            status: 'Dispatched via Express Air/Surface',
            time: 'Upcoming',
            note: 'Insured wooden crate packaging with shock sensors.',
            done: false
          },
          {
            status: 'In Transit to Destination Hub',
            time: 'Upcoming',
            note: `Routed toward ${customer.city || 'Destination Hub'} Sort Facility.`,
            done: false
          },
          {
            status: 'Out for Delivery & Installation',
            time: 'Upcoming',
            note: 'Technician will call before arrival.',
            done: false
          },
          {
            status: 'Delivered',
            time: 'Upcoming',
            note: '100-Night risk-free trial starts on delivery.',
            done: false
          }
        ]
      }
    };

    orders.unshift(newOrder);
    await writeJson(ORDERS_FILE, orders);

    // Business Owner Real-Time Notification Alert
    console.log(`\n🔔 ========================================================`);
    console.log(`🚨 NEW ORDER ALERT — MOON VENUS HQ`);
    console.log(`📋 Order ID:    ${orderId}`);
    console.log(`👤 Customer:    ${customer.name}`);
    console.log(`📞 Phone:       ${customer.phone} | Email: ${customer.email}`);
    console.log(`📍 Address:     ${customer.address}, ${customer.city} - ${customer.pincode}`);
    console.log(`🛒 Desk Specs:  ${items.map(i => `${i.size} - ${i.finish}`).join(', ')}`);
    console.log(`💳 Payment:     ₹${totalAmount.toLocaleString('en-IN')} (${payment?.method} - ${newOrder.payment.status})`);
    console.log(`🚚 Carrier:     ${newOrder.tracking.courier} (${trackingNumber})`);
    console.log(`🔔 ========================================================\n`);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// 4. Track Order by Order ID or Email / Phone
app.get('/api/orders/:identifier', async (req, res) => {
  const { identifier } = req.params;
  const orders = (await readJson(ORDERS_FILE)) || [];

  const cleanId = identifier.trim().toLowerCase();
  const order = orders.find(
    o => o.orderId.toLowerCase() === cleanId ||
         (o.customer?.email && o.customer.email.toLowerCase() === cleanId) ||
         (o.customer?.phone && o.customer.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, ''))
  );

  if (!order) {
    return res.status(404).json({ error: 'No order found with the provided Order ID or contact' });
  }

  res.json(order);
});

// 5. Get All Orders (Admin Dashboard)
app.get('/api/orders', async (req, res) => {
  const orders = (await readJson(ORDERS_FILE)) || [];
  const { status, search } = req.query;

  let filtered = [...orders];

  if (status && status !== 'All') {
    filtered = filtered.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      o => o.orderId.toLowerCase().includes(q) ||
           o.customer?.name.toLowerCase().includes(q) ||
           o.customer?.email?.toLowerCase().includes(q) ||
           o.customer?.phone?.includes(q) ||
           o.customer?.city?.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// 6. Update Order Status (Admin Dashboard)
app.patch('/api/orders/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const { status, note } = req.body;

  const validStatuses = ['Confirmed', 'Processing', 'In Transit', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  const orders = (await readJson(ORDERS_FILE)) || [];
  const orderIndex = orders.findIndex(o => o.orderId.toLowerCase() === orderId.toLowerCase());

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[orderIndex];
  order.status = status;

  // Update tracking checkpoints
  const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  if (order.tracking && order.tracking.checkpoints) {
    // Mark corresponding checkpoint as done
    let checkpointFound = false;
    for (const cp of order.tracking.checkpoints) {
      if (cp.status.toLowerCase().includes(status.toLowerCase())) {
        cp.done = true;
        cp.time = nowStr;
        if (note) cp.note = note;
        checkpointFound = true;
        break;
      }
    }

    if (!checkpointFound && note) {
      order.tracking.checkpoints.push({
        status,
        time: nowStr,
        note,
        done: true
      });
    }
  }

  orders[orderIndex] = order;
  await writeJson(ORDERS_FILE, orders);

  res.json({ success: true, message: `Order status updated to ${status}`, order });
});

// 7. Admin Metrics / Stats
app.get('/api/admin/stats', async (req, res) => {
  const orders = (await readJson(ORDERS_FILE)) || [];
  
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment?.status === 'PAID' ? o.totalAmount : 0), 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const inTransitOrders = orders.filter(o => ['In Transit', 'Dispatched', 'Out for Delivery', 'Confirmed'].includes(o.status)).length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Breakdown by size
  const sizeCount = {};
  orders.forEach(o => {
    o.items?.forEach(item => {
      const sz = item.size || '140 × 70 cm';
      sizeCount[sz] = (sizeCount[sz] || 0) + (item.quantity || 1);
    });
  });

  res.json({
    totalRevenue,
    totalOrders,
    deliveredOrders,
    inTransitOrders,
    avgOrderValue,
    sizeBreakdown: sizeCount,
    recentOrders: orders.slice(0, 5)
  });
});

// 8. Reviews API
app.get('/api/reviews', async (req, res) => {
  const reviews = (await readJson(REVIEWS_FILE)) || [];
  res.json(reviews);
});

app.post('/api/reviews', async (req, res) => {
  const { author, location, rating, title, comment, sizeBought, finishBought } = req.body;
  if (!author || !rating || !comment) {
    return res.status(400).json({ error: 'Name, rating, and review text are required' });
  }

  const reviews = (await readJson(REVIEWS_FILE)) || [];
  const newReview = {
    id: `rev-${Date.now()}`,
    author,
    location: location || 'Verified Buyer, India',
    rating: Number(rating),
    date: new Date().toISOString().split('T')[0],
    title: title || 'Exceptional craftsmanship',
    comment,
    verified: true,
    sizeBought: sizeBought || '140 × 70 cm',
    finishBought: finishBought || 'Pristine Matte White'
  };

  reviews.unshift(newReview);
  await writeJson(REVIEWS_FILE, reviews);

  res.status(201).json({ success: true, review: newReview });
});

// 9. Settings API (for WhatsApp Number configuration)
app.get('/api/settings', async (req, res) => {
  const settings = (await readJson(SETTINGS_FILE)) || {
    whatsappNumber: '919123456789',
    businessEmail: 'concierge@moonvenus.in',
    supportPhone: '+91 (080) 4918-0000'
  };
  res.json(settings);
});

app.post('/api/settings', async (req, res) => {
  const { whatsappNumber, businessEmail, supportPhone } = req.body;
  const current = (await readJson(SETTINGS_FILE)) || {};
  const updated = {
    ...current,
    whatsappNumber: whatsappNumber ? whatsappNumber.replace(/\D/g, '') : current.whatsappNumber,
    businessEmail: businessEmail || current.businessEmail,
    supportPhone: supportPhone || current.supportPhone
  };
  await writeJson(SETTINGS_FILE, updated);
  console.log(`⚙️ Business WhatsApp number updated to: ${updated.whatsappNumber}`);
  res.json({ success: true, settings: updated });
});

// 10. Enquiries API (Direct WhatsApp Integration & Persistent Storage)
app.get('/api/enquiries', async (req, res) => {
  const enquiries = (await readJson(ENQUIRIES_FILE)) || [];
  res.json(enquiries);
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, phone, email, city, pincode, deskSize, finish, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const enquiries = (await readJson(ENQUIRIES_FILE)) || [];
    const settings = (await readJson(SETTINGS_FILE)) || { whatsappNumber: '919123456789' };

    const newEnquiry = {
      id: `ENQ-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      city: city ? city.trim() : '',
      pincode: pincode ? pincode.trim() : '',
      deskSize: deskSize || '140 × 70 cm',
      finish: finish || 'Pristine Matte White',
      message: message ? message.trim() : 'Interested in Moon Venus Horizon Desk',
      status: 'New'
    };

    enquiries.unshift(newEnquiry);
    await writeJson(ENQUIRIES_FILE, enquiries);

    // Alert Business Owner in Console
    console.log(`\n💬 ========================================================`);
    console.log(`📲 NEW WHATSAPP ENQUIRY RECEIVED!`);
    console.log(`📋 Enquiry ID: ${newEnquiry.id}`);
    console.log(`👤 Customer:   ${newEnquiry.name}`);
    console.log(`📞 Phone:      ${newEnquiry.phone} | Email: ${newEnquiry.email}`);
    console.log(`📍 Location:   ${newEnquiry.city} (${newEnquiry.pincode})`);
    console.log(`📐 Desk Size:  ${newEnquiry.deskSize} - ${newEnquiry.finish}`);
    console.log(`💬 Message:    ${newEnquiry.message}`);
    console.log(`💬 ========================================================\n`);

    // Prepare WhatsApp Formatted Text
    const waText = 
`🌟 *NEW ENQUIRY - MOON VENUS HORIZON DESK* 🌟
━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${newEnquiry.name}
📞 *Mobile:* ${newEnquiry.phone}
📧 *Email:* ${newEnquiry.email || 'N/A'}
📍 *Location:* ${newEnquiry.city || 'N/A'} ${newEnquiry.pincode ? `(${newEnquiry.pincode})` : ''}
📐 *Desk Size:* ${newEnquiry.deskSize}
🎨 *Finish:* ${newEnquiry.finish}
💬 *Requirement:*
"${newEnquiry.message}"
━━━━━━━━━━━━━━━━━━━━
_Enquiry Ref: #${newEnquiry.id} | moonvenus.in_`;

    const encodedText = encodeURIComponent(waText);
    const targetPhone = (settings.whatsappNumber || '919123456789').replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Opening WhatsApp...',
      enquiry: newEnquiry,
      whatsappUrl,
      whatsappNumber: targetPhone
    });
  } catch (err) {
    console.error('Enquiry error:', err);
    res.status(500).json({ error: 'Failed to process enquiry' });
  }
});

app.patch('/api/enquiries/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const enquiries = (await readJson(ENQUIRIES_FILE)) || [];
  const idx = enquiries.findIndex(e => e.id.toLowerCase() === id.toLowerCase());
  if (idx === -1) return res.status(404).json({ error: 'Enquiry not found' });

  enquiries[idx].status = status;
  await writeJson(ENQUIRIES_FILE, enquiries);
  res.json({ success: true, enquiry: enquiries[idx] });
});

// Serve frontend build if present
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.send('Moon Venus API running. Access frontend on Vite dev port 3000/5173.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Moon Venus Backend Server running on http://localhost:${PORT}`);
});
