const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupDemo() {
  console.log('🚀 Configuration de l\'environnement de démonstration...\n');

  try {
    // 1. Créer un admin
    console.log('1️⃣ Création de l\'administrateur...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@evisa.mr' },
      update: { role: 'admin' },
      create: {
        email: 'admin@evisa.mr',
        name: 'Admin E-Visa',
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
      },
    });
    console.log('   ✅ Admin créé:', admin.email);

    // 2. Créer quelques utilisateurs de test
    console.log('\n2️⃣ Création d\'utilisateurs de test...');
    const userPassword = await bcrypt.hash('user123', 10);
    
    const users = [];
    for (let i = 1; i <= 3; i++) {
      const user = await prisma.user.upsert({
        where: { email: `user${i}@example.com` },
        update: {},
        create: {
          email: `user${i}@example.com`,
          name: `User ${i}`,
          password: userPassword,
          role: 'user',
          createdAt: new Date(),
        },
      });
      users.push(user);
      console.log(`   ✅ Utilisateur ${i} créé:`, user.email);
    }

    // 3. Créer des types de visa
    console.log('\n3️⃣ Création des types de visa...');
    
    // Vérifier si les types existent déjà
    const existingTouristVisa = await prisma.visaType.findFirst({
      where: { name: 'Visa Touristique' }
    });
    
    const existingBusinessVisa = await prisma.visaType.findFirst({
      where: { name: 'Visa Affaires' }
    });
    
    const visaTypes = [];
    
    if (!existingTouristVisa) {
      const touristVisa = await prisma.visaType.create({
        data: {
          name: 'Visa Touristique',
          durationDays: 30,
          price: 50,
          description: 'Visa pour séjour touristique de 30 jours',
          active: true,
        },
      });
      visaTypes.push(touristVisa);
      console.log('   ✅ Visa Touristique créé');
    } else {
      console.log('   ✓  Visa Touristique existe déjà');
    }
    
    if (!existingBusinessVisa) {
      const businessVisa = await prisma.visaType.create({
        data: {
          name: 'Visa Affaires',
          durationDays: 90,
          price: 100,
          description: 'Visa pour voyages d\'affaires de 90 jours',
          active: true,
        },
      });
      visaTypes.push(businessVisa);
      console.log('   ✅ Visa Affaires créé');
    } else {
      console.log('   ✓  Visa Affaires existe déjà');
    }
    
    console.log(`   📊 ${visaTypes.length} nouveau(x) type(s) de visa`);

    console.log('\n✅ Configuration terminée avec succès !\n');
    console.log('📝 Informations de connexion:');
    console.log('   Admin:');
    console.log('   - Email: admin@evisa.mr');
    console.log('   - Mot de passe: admin123');
    console.log('\n   Utilisateurs:');
    console.log('   - Email: user1@example.com');
    console.log('   - Email: user2@example.com');
    console.log('   - Email: user3@example.com');
    console.log('   - Mot de passe pour tous: user123');
    console.log('\n🎉 Vous pouvez maintenant tester l\'application !');
    console.log('   1. npm run dev');
    console.log('   2. Connectez-vous avec admin@evisa.mr / admin123');
    console.log('   3. Accédez à /admin pour le dashboard\n');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDemo();

