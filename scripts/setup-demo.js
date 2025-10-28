const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

// MongoDB connection helper
async function getMongoClient() {
  const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://localhost:27017/e-visa');
  await client.connect();
  return client;
}

async function setupDemo() {
  console.log('🚀 Configuration de l\'environnement de démonstration...\n');

  try {
    const client = await getMongoClient();
    const db = client.db('e-visa');
    const users = db.collection('User');
    const visaTypes = db.collection('VisaType');

    // 1. Créer un admin
    console.log('1️⃣ Création de l\'administrateur...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin exists
    let admin = await users.findOne({ email: 'admin@evisa.mr' });
    
    if (!admin) {
      const adminResult = await users.insertOne({
        email: 'admin@evisa.mr',
        name: 'Admin E-Visa',
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
      });
      admin = { _id: adminResult.insertedId, email: 'admin@evisa.mr' };
      console.log('   ✅ Admin créé:', admin.email);
    } else {
      // Update role if exists
      await users.updateOne(
        { _id: admin._id },
        { $set: { role: 'admin' } }
      );
      console.log('   ✅ Admin mis à jour:', admin.email);
    }

    // 2. Créer quelques utilisateurs de test
    console.log('\n2️⃣ Création d\'utilisateurs de test...');
    const userPassword = await bcrypt.hash('user123', 10);
    
    const testUsers = [];
    for (let i = 1; i <= 3; i++) {
      const email = `user${i}@example.com`;
      
      // Check if user exists
      let user = await users.findOne({ email });
      
      if (!user) {
        const userResult = await users.insertOne({
          email,
          name: `User ${i}`,
          password: userPassword,
          role: 'user',
          createdAt: new Date(),
        });
        user = { _id: userResult.insertedId, email };
        console.log(`   ✅ Utilisateur ${i} créé:`, user.email);
      } else {
        console.log(`   ✓  Utilisateur ${i} existe déjà:`, user.email);
      }
      testUsers.push(user);
    }

    // 3. Créer des types de visa
    console.log('\n3️⃣ Création des types de visa...');
    
    // Vérifier si les types existent déjà
    const existingTouristVisa = await visaTypes.findOne({ name: 'Visa Touristique' });
    const existingBusinessVisa = await visaTypes.findOne({ name: 'Visa Affaires' });
    
    const newVisaTypes = [];
    
    if (!existingTouristVisa) {
      const touristVisaResult = await visaTypes.insertOne({
        name: 'Visa Touristique',
        durationDays: 30,
        price: 50,
        description: 'Visa pour séjour touristique de 30 jours',
        active: true,
      });
      newVisaTypes.push({ _id: touristVisaResult.insertedId, name: 'Visa Touristique' });
      console.log('   ✅ Visa Touristique créé');
    } else {
      console.log('   ✓  Visa Touristique existe déjà');
    }
    
    if (!existingBusinessVisa) {
      const businessVisaResult = await visaTypes.insertOne({
        name: 'Visa Affaires',
        durationDays: 90,
        price: 100,
        description: 'Visa pour voyages d\'affaires de 90 jours',
        active: true,
      });
      newVisaTypes.push({ _id: businessVisaResult.insertedId, name: 'Visa Affaires' });
      console.log('   ✅ Visa Affaires créé');
    } else {
      console.log('   ✓  Visa Affaires existe déjà');
    }
    
    console.log(`   📊 ${newVisaTypes.length} nouveau(x) type(s) de visa`);

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
    await client.close();
  }
}

setupDemo();

