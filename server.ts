import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { createServer as createViteServer } from "vite";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  const apiRouter = express.Router();

  // API Routes
  apiRouter.get("/health", async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok", db: "connected" });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Database connection failed" });
    }
  });

  // Workspaces
  apiRouter.get("/workspaces", async (req, res) => {
    const workspaces = await prisma.workspace.findMany();
    res.json(workspaces);
  });

  apiRouter.post("/workspaces", async (req, res) => {
    const { name, description, type } = req.body;
    const workspace = await prisma.workspace.create({
      data: { name, description, type },
    });
    
    // Default statuses
    let statusesToCreate = [
      { workspaceId: workspace.id, name: "Akan Dilakukan", order: 1, color: "#cbd5e1" },
      { workspaceId: workspace.id, name: "Sedang Dikerjakan", order: 2, color: "#93c5fd" },
      { workspaceId: workspace.id, name: "Selesai", order: 3, color: "#86efac" }
    ];

    let tasksToCreate: {title: string, desc: string, priority: string, statusIndex: number}[] = [];

    if (type === "Pengajar" || type === "Pendidikan") {
      statusesToCreate = [
        { workspaceId: workspace.id, name: "Perencanaan", order: 1, color: "#cbd5e1" },
        { workspaceId: workspace.id, name: "Sedang Mengajar", order: 2, color: "#93c5fd" },
        { workspaceId: workspace.id, name: "Evaluasi", order: 3, color: "#86efac" }
      ];
      tasksToCreate = [
        { title: "Siapkan materi matematika", desc: "Bab 3 Persamaan Linear", priority: "Tinggi", statusIndex: 0 },
        { title: "Periksa ujian Biologi", desc: "Kelas 10A", priority: "Sedang", statusIndex: 1 }
      ];
    } else if (type === "Marketing") {
      statusesToCreate = [
        { workspaceId: workspace.id, name: "Ide Kampanye", order: 1, color: "#fef08a" },
        { workspaceId: workspace.id, name: "Persiapan", order: 2, color: "#cbd5e1" },
        { workspaceId: workspace.id, name: "Berjalan", order: 3, color: "#93c5fd" },
        { workspaceId: workspace.id, name: "Selesai", order: 4, color: "#86efac" }
      ];
      tasksToCreate = [
        { title: "Draft post sosmed", desc: "Untuk promo tengah tahun", priority: "Tinggi", statusIndex: 0 },
        { title: "Jalankan iklan FB", desc: "Budget Rp 500rb", priority: "Sedang", statusIndex: 1 }
      ];
    } else if (type === "Sales") {
      statusesToCreate = [
        { workspaceId: workspace.id, name: "Prospek", order: 1, color: "#cbd5e1" },
        { workspaceId: workspace.id, name: "Kontak Pertama", order: 2, color: "#fde047" },
        { workspaceId: workspace.id, name: "Negosiasi", order: 3, color: "#f9a8d4" },
        { workspaceId: workspace.id, name: "Deal", order: 4, color: "#86efac" }
      ];
      tasksToCreate = [
        { title: "Follow up klien A", desc: "Tanyakan proposal kemaren", priority: "Tinggi", statusIndex: 1 },
        { title: "Kirim proposal B", desc: "Draft terbaru harga", priority: "Sedang", statusIndex: 0 }
      ];
    } else if (type === "Toko Kelontong") {
      statusesToCreate = [
        { workspaceId: workspace.id, name: "Stok Habis", order: 1, color: "#fca5a5" },
        { workspaceId: workspace.id, name: "Dipesan", order: 2, color: "#fde047" },
        { workspaceId: workspace.id, name: "Tersedia", order: 3, color: "#86efac" }
      ];
      tasksToCreate = [
        { title: "Pesan beras", desc: "Beras merah 10kg", priority: "Tinggi", statusIndex: 0 },
        { title: "Restock minuman", desc: "Air mineral botol", priority: "Sedang", statusIndex: 1 }
      ];
    } else if (type === "UMKM") {
      statusesToCreate = [
        { workspaceId: workspace.id, name: "Bahan Baku", order: 1, color: "#cbd5e1" },
        { workspaceId: workspace.id, name: "Produksi", order: 2, color: "#fde047" },
        { workspaceId: workspace.id, name: "Siap Jual", order: 3, color: "#86efac" },
        { workspaceId: workspace.id, name: "Terjual", order: 4, color: "#6ee7b7" }
      ];
      tasksToCreate = [
        { title: "Beli kemasan", desc: "Kardus polos", priority: "Tinggi", statusIndex: 0 },
        { title: "Buat produk sampel", desc: "Rasa baru", priority: "Sedang", statusIndex: 1 }
      ];
    } else if (type === "Restoran") {
      statusesToCreate = [
        { workspaceId: workspace.id, name: "Persiapan Dapur", order: 1, color: "#cbd5e1" },
        { workspaceId: workspace.id, name: "Antrian Pesanan", order: 2, color: "#fca5a5" },
        { workspaceId: workspace.id, name: "Disajikan", order: 3, color: "#86efac" }
      ];
      tasksToCreate = [
        { title: "Belanja sayur", desc: "Sayur segar", priority: "Tinggi", statusIndex: 0 },
        { title: "Siapkan bumbu dasar", desc: "Untuk besok", priority: "Sedang", statusIndex: 0 }
      ];
    } else if (type === "Fotografer") {
      statusesToCreate = [
        { workspaceId: workspace.id, name: "Booking", order: 1, color: "#cbd5e1" },
        { workspaceId: workspace.id, name: "Pemotretan", order: 2, color: "#fde047" },
        { workspaceId: workspace.id, name: "Editing", order: 3, color: "#c4b5fd" },
        { workspaceId: workspace.id, name: "Selesai", order: 4, color: "#86efac" }
      ];
      tasksToCreate = [
        { title: "Foto prewed klien C", desc: "Lokasi pantai", priority: "Tinggi", statusIndex: 1 },
        { title: "Edit foto produk D", desc: "Batch 1", priority: "Sedang", statusIndex: 2 }
      ];
    } else if (type === "Mahasiswa") {
      statusesToCreate = [
        { workspaceId: workspace.id, name: "Tugas Baru", order: 1, color: "#cbd5e1" },
        { workspaceId: workspace.id, name: "Sedang Dikerjakan", order: 2, color: "#93c5fd" },
        { workspaceId: workspace.id, name: "Selesai", order: 3, color: "#86efac" }
      ];
      tasksToCreate = [
        { title: "Kerjakan makalah sejarah", desc: "Bab 1-3", priority: "Tinggi", statusIndex: 1 },
        { title: "Belajar ujian kalkulus", desc: "Besok lusa", priority: "Tinggi", statusIndex: 0 }
      ];
    } else if (type === "IT / Software") {
      statusesToCreate = [
        { workspaceId: workspace.id, name: "Backlog", order: 1, color: "#cbd5e1" },
        { workspaceId: workspace.id, name: "To Do", order: 2, color: "#fde047" },
        { workspaceId: workspace.id, name: "In Progress", order: 3, color: "#93c5fd" },
        { workspaceId: workspace.id, name: "Testing", order: 4, color: "#c4b5fd" },
        { workspaceId: workspace.id, name: "Done", order: 5, color: "#86efac" }
      ];
      tasksToCreate = [
        { title: "Setup repo", desc: "Init git", priority: "Tinggi", statusIndex: 4 },
        { title: "Bikin UI", desc: "Halaman depan", priority: "Sedang", statusIndex: 2 },
        { title: "Fix bug login", desc: "Gagal login kalau password salah", priority: "Tinggi", statusIndex: 1 }
      ];
    }

    // Insert statuses
    await prisma.status.createMany({
      data: statusesToCreate
    });

    // Get the inserted statuses to know their IDs
    const createdStatuses = await prisma.status.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { order: 'asc' }
    });

    if (tasksToCreate.length > 0 && createdStatuses.length > 0) {
      await prisma.workItem.createMany({
        data: tasksToCreate.map(task => ({
          title: task.title,
          description: task.desc,
          priority: task.priority,
          workspaceId: workspace.id,
          statusId: createdStatuses[task.statusIndex].id
        }))
      });
    }

    res.json(workspace);
  });

  apiRouter.get("/workspaces/:id", async (req, res) => {
    const workspace = await prisma.workspace.findUnique({
      where: { id: req.params.id },
      include: {
        statuses: { orderBy: { order: 'asc' } },
        workItems: { include: { status: true } }
      }
    });
    if (!workspace) return res.status(404).json({ error: "Workspace not found" });
    res.json(workspace);
  });
  
  apiRouter.delete("/workspaces/:id", async (req, res) => {
    await prisma.workspace.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // Statuses
  apiRouter.post("/workspaces/:id/statuses", async (req, res) => {
    const { name, color, order } = req.body;
    const status = await prisma.status.create({
      data: { name, color, order, workspaceId: req.params.id }
    });
    res.json(status);
  });

  // Work Items
  apiRouter.post("/workspaces/:id/work-items", async (req, res) => {
    const { title, description, priority, statusId, labels, dueDate } = req.body;
    let finalStatusId = statusId;
    if (!finalStatusId) {
      const firstStatus = await prisma.status.findFirst({
        where: { workspaceId: req.params.id },
        orderBy: { order: 'asc' }
      });
      if (firstStatus) finalStatusId = firstStatus.id;
    }

    const initialActivities = [
      {
        timestamp: new Date().toISOString(),
        text: "Tugas dibuat"
      }
    ];

    const workItem = await prisma.workItem.create({
      data: {
        workspaceId: req.params.id,
        title,
        description,
        priority: priority || "Sedang",
        statusId: finalStatusId,
        dueDate: dueDate ? new Date(dueDate) : null,
        labels,
        activities: JSON.stringify(initialActivities)
      },
      include: { status: true }
    });
    res.json(workItem);
  });

  apiRouter.patch("/work-items/:id", async (req, res) => {
    try {
      const existing = await prisma.workItem.findUnique({
        where: { id: req.params.id },
        include: { status: true }
      });

      let activitiesList: { timestamp: string; text: string }[] = [];
      if (existing?.activities) {
        try {
          activitiesList = JSON.parse(existing.activities);
        } catch (e) {}
      }

      if (req.body.dueDate !== undefined) {
        if (req.body.dueDate) {
          const newDate = new Date(req.body.dueDate);
          req.body.dueDate = newDate;
          activitiesList.push({
            timestamp: new Date().toISOString(),
            text: `Batas waktu diatur ke ${newDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
          });
        } else {
          req.body.dueDate = null;
          activitiesList.push({
            timestamp: new Date().toISOString(),
            text: `Batas waktu dihapus`
          });
        }
      }

      if (req.body.statusId && req.body.statusId !== existing?.statusId) {
        const oldStatusName = existing?.status?.name || "Tanpa Status";
        const newStatus = await prisma.status.findUnique({ where: { id: req.body.statusId } });
        const newStatusName = newStatus?.name || "Tanpa Status";
        activitiesList.push({
          timestamp: new Date().toISOString(),
          text: `Status diubah dari '${oldStatusName}' ke '${newStatusName}'`
        });
      }

      if (req.body.priority && req.body.priority !== existing?.priority) {
        activitiesList.push({
          timestamp: new Date().toISOString(),
          text: `Prioritas diubah dari '${existing?.priority || "Normal"}' ke '${req.body.priority}'`
        });
      }

      if (req.body.title && req.body.title !== existing?.title) {
        activitiesList.push({
          timestamp: new Date().toISOString(),
          text: `Judul diubah dari '${existing?.title}' ke '${req.body.title}'`
        });
      }

      if (req.body.description !== undefined && req.body.description !== existing?.description) {
        activitiesList.push({
          timestamp: new Date().toISOString(),
          text: `Deskripsi diperbarui`
        });
      }

      if (req.body.subtasks !== undefined && req.body.subtasks !== existing?.subtasks) {
        try {
          const oldSubs: { id: string; title: string; done: boolean }[] = existing?.subtasks ? JSON.parse(existing.subtasks) : [];
          const newSubs: { id: string; title: string; done: boolean }[] = req.body.subtasks ? JSON.parse(req.body.subtasks) : [];
          
          for (const ns of newSubs) {
            const os = oldSubs.find(x => x.id === ns.id);
            if (os) {
              if (os.done !== ns.done) {
                activitiesList.push({
                  timestamp: new Date().toISOString(),
                  text: `Subtugas '${ns.title}' ditandai ${ns.done ? "selesai" : "belum selesai"}`
                });
              } else if (os.title !== ns.title) {
                activitiesList.push({
                  timestamp: new Date().toISOString(),
                  text: `Subtugas diubah nama dari '${os.title}' ke '${ns.title}'`
                });
              }
            } else {
              activitiesList.push({
                timestamp: new Date().toISOString(),
                text: `Subtugas '${ns.title}' ditambahkan`
              });
            }
          }
          
          for (const os of oldSubs) {
            const ns = newSubs.find(x => x.id === os.id);
            if (!ns) {
              activitiesList.push({
                timestamp: new Date().toISOString(),
                text: `Subtugas '${os.title}' dihapus`
              });
            }
          }
        } catch (e) {
          activitiesList.push({
            timestamp: new Date().toISOString(),
            text: `Subtugas diperbarui`
          });
        }
      }

      req.body.activities = JSON.stringify(activitiesList);

      const workItem = await prisma.workItem.update({
        where: { id: req.params.id },
        data: req.body,
        include: { status: true }
      });
      res.json(workItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update work item" });
    }
  });

  apiRouter.delete("/work-items/:id", async (req, res) => {
    await prisma.workItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });
  
  apiRouter.get("/tasks", async (req, res) => {
    const tasks = await prisma.workItem.findMany({
      include: { workspace: true, status: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  });

  app.use('/api', apiRouter);
  app.use('/', apiRouter);
  app.use((process.env.BASE_PATH || '') + '/api', apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(process.env.BASE_PATH || "", express.static(distPath));
    app.get(`${process.env.BASE_PATH || ""}/*all`, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
