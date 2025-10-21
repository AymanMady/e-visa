const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listAdmins() {
  try {
    console.log('🔍 Recherche des administrateurs...\n');
    
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (admins.length === 0) {
      console.log('⚠️  Aucun administrateur trouvé.');
      console.log('💡 Utilisez: node scripts/create-admin.js <email> <password> pour créer un admin.');
      return;
    }

    console.log(`✅ ${admins.length} administrateur(s) trouvé(s) :\n`);
    
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🛡️  Rôle: ${admin.role}`);
      console.log(`   📅 Créé le: ${admin.createdAt.toLocaleDateString('fr-FR')}`);
      if (admin.lastLogin) {
        console.log(`   🔐 Dernière connexion: ${admin.lastLogin.toLocaleDateString('fr-FR')}`);
      }
      console.log('');
    });

    console.log(`📊 Total: ${admins.length} administrateur(s)`);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des admins:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

listAdmins();

