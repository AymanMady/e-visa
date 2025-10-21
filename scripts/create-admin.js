const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin';
  
  if (!email || !password) {
    console.error('❌ Usage: node scripts/create-admin.js <email> <password> [name]');
    console.error('   Exemple: node scripts/create-admin.js admin@example.com SecurePass123 "John Admin"');
    process.exit(1);
  }

  try {
    console.log('🔄 Création de l\'administrateur...');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.user.upsert({
      where: { email },
      update: { 
        role: 'admin',
        name,
      },
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
      },
    });

    console.log('✅ Admin créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nom:', admin.name);
    console.log('🛡️  Rôle:', admin.role);
    console.log('\n🎉 Vous pouvez maintenant vous connecter avec ces identifiants !');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

