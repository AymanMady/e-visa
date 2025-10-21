const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUsersRole() {
  console.log('🔄 Mise à jour des utilisateurs sans rôle...\n');
  
  try {
    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      console.log('ℹ️  Aucun utilisateur trouvé dans la base de données.');
      return;
    }

    console.log(`📊 ${users.length} utilisateur(s) trouvé(s)\n`);
    
    let updated = 0;
    let alreadyOk = 0;
    
    for (const user of users) {
      if (!user.role || user.role === null || user.role === '') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'user' },
        });
        updated++;
        console.log(`✅ Mis à jour: ${user.email || user.id} → role: "user"`);
      } else {
        alreadyOk++;
        console.log(`✓  Déjà OK: ${user.email || user.id} → role: "${user.role}"`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`✅ ${updated} utilisateur(s) mis à jour`);
    console.log(`✓  ${alreadyOk} utilisateur(s) déjà à jour`);
    console.log('='.repeat(50));
    
    if (updated > 0) {
      console.log('\n💡 Les utilisateurs peuvent maintenant se connecter normalement.');
      console.log('💡 Ils doivent se déconnecter et se reconnecter pour que les changements prennent effet.');
    }
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error('\n💡 Assurez-vous que :');
    console.error('   1. La base de données est accessible');
    console.error('   2. Vous avez exécuté: npx prisma generate');
    console.error('   3. Vous avez exécuté: npx prisma db push');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixUsersRole();

