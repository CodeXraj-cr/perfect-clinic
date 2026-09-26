import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { ClinicStore } from './server/dataStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const clinicStore = ClinicStore.getInstance();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@perfectclinic.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_TOKEN = 'token_perfect_admin_session_2026';

// Middleware for Admin Auth
const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (token !== ADMIN_TOKEN) {
    res.status(403).json({ error: 'Forbidden: Invalid admin token' });
    return;
  }

  next();
};

// ======================== API ROUTES ========================

// 1. Auth routes
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (
    (email === ADMIN_EMAIL || email === 'admin') &&
    (password === ADMIN_PASSWORD || password === 'admin123')
  ) {
    res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: {
        email: ADMIN_EMAIL,
        name: 'Dr. Administrator',
        role: 'Clinic Super Admin'
      }
    });
  } else {
    res.status(401).json({
      error:
        'Invalid email or password. Use demo credentials: admin@perfectclinic.com / admin123'
    });
  }
});

app.get('/api/admin/me', requireAdmin, (req: Request, res: Response) => {
  res.json({
    email: ADMIN_EMAIL,
    name: 'Dr. Administrator',
    role: 'Clinic Super Admin'
  });
});

// 2. Clinic Info
app.get('/api/clinic', (req: Request, res: Response) => {
  try {
    const clinic = clinicStore.getClinic();
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clinic information' });
  }
});

app.put('/api/clinic', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = clinicStore.updateClinic(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update clinic information' });
  }
});

// 3. Doctors
app.get('/api/doctors', (req: Request, res: Response) => {
  try {
    const doctors = clinicStore.getDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

app.get('/api/doctors/:id', (req: Request, res: Response) => {
  try {
    const doctor = clinicStore.getDoctorById(req.params.id);

    if (!doctor) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

app.post('/api/doctors', requireAdmin, (req: Request, res: Response) => {
  try {
    const newDoc = clinicStore.addDoctor(req.body);
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add doctor' });
  }
});

app.put('/api/doctors/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = clinicStore.updateDoctor(req.params.id, req.body);

    if (!updated) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

app.delete('/api/doctors/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const deleted = clinicStore.deleteDoctor(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});

// 4. Availability
app.get('/api/availability', (req: Request, res: Response) => {
  try {
    const doctorId = req.query.doctorId as string | undefined;
    const slots = clinicStore.getAvailability(doctorId);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

app.get('/api/availability/:doctorId', (req: Request, res: Response) => {
  try {
    const slots = clinicStore.getAvailability(req.params.doctorId);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

app.post('/api/availability', requireAdmin, (req: Request, res: Response) => {
  try {
    const newSlot = clinicStore.addAvailability(req.body);
    res.status(201).json(newSlot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create availability slot' });
  }
});

app.put('/api/availability/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = clinicStore.updateAvailability(req.params.id, req.body);

    if (!updated) {
      res.status(404).json({ error: 'Availability slot not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update availability slot' });
  }
});

app.delete('/api/availability/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const deleted = clinicStore.deleteAvailability(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Availability slot not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Slot removed'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete availability slot' });
  }
});

// 5. Services
app.get('/api/services', (req: Request, res: Response) => {
  try {
    const services = clinicStore.getServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/api/services', requireAdmin, (req: Request, res: Response) => {
  try {
    const newService = clinicStore.addService(req.body);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/services/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = clinicStore.updateService(req.params.id, req.body);

    if (!updated) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.delete('/api/services/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const deleted = clinicStore.deleteService(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Service removed'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// 6. Blood Tests
app.get('/api/blood-tests', (req: Request, res: Response) => {
  try {
    const tests = clinicStore.getBloodTests();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blood tests' });
  }
});

app.post('/api/blood-tests', requireAdmin, (req: Request, res: Response) => {
  try {
    const newTest = clinicStore.addBloodTest(req.body);
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blood test' });
  }
});

app.put('/api/blood-tests/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = clinicStore.updateBloodTest(req.params.id, req.body);

    if (!updated) {
      res.status(404).json({ error: 'Blood test not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blood test' });
  }
});

app.delete('/api/blood-tests/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const deleted = clinicStore.deleteBloodTest(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Blood test not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Blood test removed'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blood test' });
  }
});

// 7. Phlebotomist
app.get('/api/phlebotomist', (req: Request, res: Response) => {
  try {
    const phleb = clinicStore.getPhlebotomist();
    res.json(phleb);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch phlebotomist' });
  }
});

app.put('/api/phlebotomist', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = clinicStore.updatePhlebotomist(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update phlebotomist' });
  }
});

// 8. Appointments & Activity Logging
app.get('/api/appointments', requireAdmin, (req: Request, res: Response) => {
  try {
    const appointments = clinicStore.getAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.post('/api/appointments', (req: Request, res: Response) => {
  try {
    const record = clinicStore.logAppointment(req.body);

    res.status(201).json({
      success: true,
      appointment: record
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log appointment' });
  }
});

// 9. Stats
app.get('/api/stats', (req: Request, res: Response) => {
  try {
    const stats = clinicStore.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ======================== SERVER & VITE INTEGRATION ========================

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    const assetsPath = path.resolve(process.cwd(), 'src/assets');

    // Serve the Vite production build
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }

    // Serve images and other assets referenced as /src/assets/...
    if (fs.existsSync(assetsPath)) {
      app.use('/src/assets', express.static(assetsPath));
    }

    // SPA fallback
    if (fs.existsSync(distPath)) {
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `+PERFECT+ Medical Clinic Server running at http://localhost:${PORT}`
    );
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
