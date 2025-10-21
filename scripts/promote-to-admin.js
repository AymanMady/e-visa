const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function promoteToAdmin() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Usage: node scripts/promote-to-admin.js <email>');
    console.error('   Exemple: node scripts/promote-to-admin.js user@example.com');
    process.exit(1);
  }

  try {
    console.log('🔄 Promotion de l\'utilisateur en admin...');
    
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    });

    console.log('✅ Utilisateur promu admin avec succès !');
    console.log('📧 Email:', user.email);
    console.log('👤 Nom:', user.name);
    console.log('🛡️  Nouveau rôle:', user.role);
    console.log('\n💡 L\'utilisateur doit se déconnecter et se reconnecter pour que les changements prennent effet.');
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('❌ Aucun utilisateur trouvé avec cet email:', email);
    } else {
      console.error('❌ Erreur lors de la promotion:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

promoteToAdmin();

