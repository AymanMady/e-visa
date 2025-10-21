const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function demoteAdmin() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Usage: node scripts/demote-admin.js <email>');
    console.error('   Exemple: node scripts/demote-admin.js admin@example.com');
    process.exit(1);
  }

  try {
    console.log('🔄 Rétrogradation de l\'admin en utilisateur normal...');
    
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'user' },
    });

    console.log('✅ Admin rétrogradé en utilisateur avec succès !');
    console.log('📧 Email:', user.email);
    console.log('👤 Nom:', user.name);
    console.log('👥 Nouveau rôle:', user.role);
    console.log('\n💡 L\'utilisateur doit se déconnecter et se reconnecter pour que les changements prennent effet.');
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('❌ Aucun utilisateur trouvé avec cet email:', email);
    } else {
      console.error('❌ Erreur lors de la rétrogradation:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

demoteAdmin();

